import { WebSocketServer, type WebSocket } from "ws";
import type { IncomingMessage, Server } from "http";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import type {
  WsEvent,
  WsConnectionEstablishedEvent,
  WsPongEvent,
  WsChatHistoryEvent,
  WsChatMessageEvent,
  WsChatUserListEvent,
  WsChatUserJoinedEvent,
  WsChatUserLeftEvent,
  ChatUser,
  ChatMessage,
} from "@fsd/api";

interface JwtPayload {
  userId: string;
  email: string;
  username: string;
  displayName: string;
}

interface ExtendedWebSocket extends WebSocket {
  sessionId: string;
  isAlive: boolean;
  user?: ChatUser;
}

// sessionId → ChatUser (인증된 접속자만 등록)
const onlineUsers = new Map<string, ChatUser>();

function send(ws: WebSocket, event: WsEvent): void {
  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(event));
  }
}

function broadcastAll(wss: WebSocketServer, event: WsEvent): void {
  const payload = JSON.stringify(event);
  wss.clients.forEach((rawWs) => {
    if (rawWs.readyState === rawWs.OPEN) {
      rawWs.send(payload);
    }
  });
}

function broadcastOthers(
  wss: WebSocketServer,
  sender: WebSocket,
  event: WsEvent,
): void {
  const payload = JSON.stringify(event);
  wss.clients.forEach((rawWs) => {
    if (rawWs !== sender && rawWs.readyState === rawWs.OPEN) {
      rawWs.send(payload);
    }
  });
}

async function handleChatJoin(
  ws: ExtendedWebSocket,
  wss: WebSocketServer,
  token: string,
): Promise<void> {
  const secret = process.env["JWT_SECRET"];
  if (!secret) return;

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, secret) as JwtPayload;
  } catch {
    console.error("[WS] Invalid token on chat:join");
    ws.close(1008, "Invalid token");
    return;
  }

  let dbUser;
  try {
    dbUser = await prisma.user.findUnique({ where: { id: payload.userId } });
  } catch (err) {
    console.error("[WS] DB error on chat:join:", err);
    ws.close(1011, "DB error");
    return;
  }
  if (!dbUser) {
    ws.close(1008, "User not found");
    return;
  }

  const chatUser: ChatUser = {
    id: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.displayName,
    avatarUrl: dbUser.avatarUrl,
  };

  ws.user = chatUser;
  onlineUsers.set(ws.sessionId, chatUser);

  let messages;
  try {
    messages = await prisma.message.findMany({
      take: 50,
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("[WS] DB error fetching messages:", err);
    messages = [];
  }

  const history: ChatMessage[] = messages.map((m) => ({
    id: m.id,
    content: m.content,
    author: m.author,
    createdAt: m.createdAt.toISOString(),
  }));

  const historyEvent: WsChatHistoryEvent = {
    type: "chat:history",
    timestamp: new Date().toISOString(),
    payload: { messages: history },
  };
  send(ws, historyEvent);

  const userListEvent: WsChatUserListEvent = {
    type: "chat:user_list",
    timestamp: new Date().toISOString(),
    payload: {
      users: [
        ...new Map(
          Array.from(onlineUsers.values()).map((u) => [u.id, u]),
        ).values(),
      ],
    },
  };
  send(ws, userListEvent);

  const userJoinedEvent: WsChatUserJoinedEvent = {
    type: "chat:user_joined",
    timestamp: new Date().toISOString(),
    payload: { user: chatUser },
  };
  broadcastOthers(wss, ws, userJoinedEvent);

  console.log(`[WS] ${chatUser.username} joined chat`);
}

async function handleChatSend(
  ws: ExtendedWebSocket,
  wss: WebSocketServer,
  content: string,
): Promise<void> {
  if (!ws.user) {
    console.warn("[WS] chat:send from unauthenticated client — ignored");
    return;
  }

  const trimmed = content?.trim();
  if (!trimmed || trimmed.length > 2000) return;

  const message = await prisma.message.create({
    data: { content: trimmed, authorId: ws.user.id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });

  const chatMessage: ChatMessage = {
    id: message.id,
    content: message.content,
    author: message.author,
    createdAt: message.createdAt.toISOString(),
  };

  const messageEvent: WsChatMessageEvent = {
    type: "chat:message",
    timestamp: new Date().toISOString(),
    payload: { message: chatMessage },
  };
  broadcastAll(wss, messageEvent);
}

async function handleMessage(
  ws: ExtendedWebSocket,
  wss: WebSocketServer,
  data: Buffer,
): Promise<void> {
  let event: WsEvent | null = null;
  try {
    event = JSON.parse(data.toString()) as WsEvent;
  } catch {
    console.error("[WS] Failed to parse message");
    return;
  }

  switch (event.type) {
    case "ping": {
      const pong: WsPongEvent = {
        type: "pong",
        timestamp: new Date().toISOString(),
        payload: undefined,
      };
      send(ws, pong);
      break;
    }
    case "chat:join":
      await handleChatJoin(ws, wss, event.payload.token);
      break;
    case "chat:send":
      await handleChatSend(ws, wss, event.payload.content);
      break;
    default:
      console.warn(`[WS] Unhandled event: ${(event as WsEvent).type}`);
  }
}

export function createWsServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const heartbeatInterval = setInterval(() => {
    wss.clients.forEach((rawWs) => {
      const ws = rawWs as ExtendedWebSocket;
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, 30_000);

  wss.on("close", () => clearInterval(heartbeatInterval));

  wss.on("connection", (rawWs: WebSocket, _req: IncomingMessage) => {
    const ws = rawWs as ExtendedWebSocket;
    ws.sessionId = crypto.randomUUID();
    ws.isAlive = true;

    console.log(`[WS] Client connected — sessionId=${ws.sessionId}`);

    const established: WsConnectionEstablishedEvent = {
      type: "connection:established",
      timestamp: new Date().toISOString(),
      payload: { sessionId: ws.sessionId },
    };
    send(ws, established);

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (data: Buffer) => {
      void handleMessage(ws, wss, data);
    });

    ws.on("close", () => {
      console.log(`[WS] Client disconnected — sessionId=${ws.sessionId}`);

      if (ws.user) {
        onlineUsers.delete(ws.sessionId);

        const userLeftEvent: WsChatUserLeftEvent = {
          type: "chat:user_left",
          timestamp: new Date().toISOString(),
          payload: { userId: ws.user.id },
        };
        broadcastAll(wss, userLeftEvent);

        console.log(`[WS] ${ws.user.username} left chat`);
      }
    });

    ws.on("error", (err: Error) => {
      console.error(`[WS] Error — sessionId=${ws.sessionId}`, err.message);
    });
  });

  return wss;
}

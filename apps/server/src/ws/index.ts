import { WebSocketServer, type WebSocket } from "ws";
import type { IncomingMessage, Server } from "http";
import type {
  WsEvent,
  WsConnectionEstablishedEvent,
  WsPongEvent,
} from "@fsd/api";

interface ExtendedWebSocket extends WebSocket {
  sessionId: string;
  isAlive: boolean;
}

/**
 * Creates and attaches a WebSocket server to the given HTTP server.
 * Returns the wss instance for external use (broadcasting, etc.).
 */
export function createWsServer(httpServer: Server): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  // Heartbeat interval — drop stale connections every 30 seconds
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

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  wss.on("connection", (rawWs: WebSocket, _req: IncomingMessage) => {
    const ws = rawWs as ExtendedWebSocket;
    ws.sessionId = crypto.randomUUID();
    ws.isAlive = true;

    console.warn(`[WS] Client connected — sessionId=${ws.sessionId}`);

    // Send connection:established event
    const established: WsConnectionEstablishedEvent = {
      type: "connection:established",
      timestamp: new Date().toISOString(),
      payload: { sessionId: ws.sessionId },
    };
    ws.send(JSON.stringify(established));

    ws.on("pong", () => {
      ws.isAlive = true;
    });

    ws.on("message", (data: Buffer) => {
      let event: WsEvent | null = null;
      try {
        event = JSON.parse(data.toString()) as WsEvent;
      } catch {
        console.error("[WS] Failed to parse message");
        return;
      }

      if (event.type === "ping") {
        const pong: WsPongEvent = {
          type: "pong",
          timestamp: new Date().toISOString(),
          payload: undefined,
        };
        ws.send(JSON.stringify(pong));
        return;
      }

      console.warn(`[WS] Received event: ${event.type}`);
    });

    ws.on("close", () => {
      console.warn(`[WS] Client disconnected — sessionId=${ws.sessionId}`);
    });

    ws.on("error", (err: Error) => {
      console.error(`[WS] Error — sessionId=${ws.sessionId}`, err.message);
    });
  });

  return wss;
}

/**
 * Broadcasts a typed WsEvent to all currently connected clients.
 */
export function broadcast(wss: WebSocketServer, event: WsEvent): void {
  const payload = JSON.stringify(event);
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(payload);
    }
  });
}

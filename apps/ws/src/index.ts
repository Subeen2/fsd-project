import http from "http";
import { createWsServer } from "./ws/index";

const PORT = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3002;
const HOST = process.env["HOST"] ?? "0.0.0.0";

const httpServer = http.createServer((_req, res) => {
  // Fly.io health check
  if (_req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" }).end("ok");
    return;
  }
  res.writeHead(404).end();
});

const wss = createWsServer(httpServer);

httpServer.listen(PORT, HOST, () => {
  console.log(`[WS] WebSocket server running at ws://${HOST}:${PORT}/ws`);
  console.log(`[WS] Connected clients: ${wss.clients.size}`);
});

function shutdown(signal: string): void {
  console.log(`[WS] Received ${signal}, shutting down gracefully...`);
  wss.close(() => {
    httpServer.close(() => {
      process.exit(0);
    });
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

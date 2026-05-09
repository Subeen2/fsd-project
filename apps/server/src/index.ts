import http from "http";
import express from "express";
import cors from "cors";
import router from "./routes/index";
import { createWsServer } from "./ws/index";

const PORT = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 3001;
const HOST = process.env["HOST"] ?? "0.0.0.0";

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] ?? "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use("/", router);

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: "NOT_FOUND", message: "Route not found" },
  });
});

// ─── Error handler ────────────────────────────────────────────────────────────

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[HTTP] Unhandled error:", err.message);
    res.status(500).json({
      success: false,
      error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong" },
    });
  }
);

// ─── HTTP + WebSocket server ──────────────────────────────────────────────────

const httpServer = http.createServer(app);
const wss = createWsServer(httpServer);

httpServer.listen(PORT, HOST, () => {
  console.warn(`[HTTP] Server running at http://${HOST}:${PORT}`);
  console.warn(`[WS]   WebSocket server running at ws://${HOST}:${PORT}/ws`);
  console.warn(`[WS]   Connected clients: ${wss.clients.size}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

function shutdown(signal: string): void {
  console.warn(`\n[Server] Received ${signal}, shutting down gracefully…`);
  wss.close(() => {
    httpServer.close(() => {
      console.warn("[Server] All connections closed.");
      process.exit(0);
    });
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

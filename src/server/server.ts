import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Cliente conectado!");

  ws.on("message", (message) => {
    console.log("Mensagem recebida:", message.toString());

    // Reenvia a mensagem para todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === ws.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on("close", () => console.log("Cliente desconectado"));
});

console.log("Servidor WebSocket rodando na porta 8080");

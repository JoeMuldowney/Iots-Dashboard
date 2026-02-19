const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });

console.log("WebSocket running on ws://localhost:4000");

setInterval(() => {
  const data = {
    temperature: (20 + Math.random() * 5).toFixed(2),
    humidity: (40 + Math.random() * 10).toFixed(2),
  };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}, 1000);

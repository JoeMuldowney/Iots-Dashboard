import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [status, setStatus] = useState("Connecting...");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onopen = () => setStatus("Connected");

    ws.onclose = () => setStatus("Disconnected");

    ws.onerror = () => setStatus("Error");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      const point = {
        time: new Date().toLocaleTimeString(),
        temperature: msg.temperature,
        humidity: msg.humidity,
      };

      setLatest(msg);
      setData((prev) => [...prev.slice(-30), point]);
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ fontFamily: "Arial", padding: 20 }}>
      <h2>IoT Realtime Dashboard</h2>

      <p>Status: <b>{status}</b></p>

      {/* Sensor Cards */}
      <div style={{ display: "flex", gap: 20 }}>
        <Card title="Temperature" value={latest?.temperature} unit="°C" />
        <Card title="Humidity" value={latest?.humidity} unit="%" />
      </div>

      {/* Realtime Chart */}
      <div style={{ marginTop: 30 }}>
        <h3>Live Sensor Data</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temperature" dot={false} />
            <Line type="monotone" dataKey="humidity" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Card({ title, value, unit }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        borderRadius: 10,
        background: "#f4f4f4",
        textAlign: "center",
      }}
    >
      <h4>{title}</h4>
      <h2>{value ?? "--"} {unit}</h2>
    </div>
  );
}

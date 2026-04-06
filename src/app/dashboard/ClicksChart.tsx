"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type ChartItem = {
  name: string;
  clicks: number;
};

export default function ClicksChart({ data }: { data: ChartItem[] }) {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#1a1a1a",
        border: "1px solid #2a2a2a",
        borderRadius: "16px",
        padding: "16px",
        boxSizing: "border-box",
        overflowX: "auto",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px 0",
          fontSize: "22px",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        Cliques por link
      </h2>

      <div style={{ minWidth: "700px" }}>
        <BarChart
          width={700}
          height={280}
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
          <XAxis dataKey="name" stroke="#a3a3a3" />
          <YAxis stroke="#a3a3a3" allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f1f1f",
              border: "1px solid #333",
              color: "#fff",
              borderRadius: "10px",
            }}
            labelStyle={{ color: "#aaa" }}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="clicks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </div>
    </div>
  );
}
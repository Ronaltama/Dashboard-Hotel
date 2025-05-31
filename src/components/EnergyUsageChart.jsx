import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EnergyUsageChart = ({ data, selectedRange }) => {
  // Menerima selectedRange
  // Penyesuaian interval XAxis berdasarkan rentang waktu
  let xAxisInterval = 3; // Default untuk daily (per 3 jam)
  let xAxisAngle = -45;
  let xAxisHeight = 30;

  if (selectedRange === "weekly") {
    xAxisInterval = 0; // Tampilkan semua label hari
    xAxisAngle = -30;
    xAxisHeight = 40;
  } else if (selectedRange === "monthly") {
    xAxisInterval = 4; // Tampilkan setiap 5 hari (0, 5, 10, ...)
    xAxisAngle = -45;
    xAxisHeight = 30;
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -15,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e0e0e0"
            vertical={false}
          />
          <XAxis
            dataKey="label" // Menggunakan 'label' karena bisa berupa jam, tanggal, atau nomor hari
            tick={{ fontSize: 9, fill: "#6b7280" }}
            angle={xAxisAngle}
            textAnchor="end"
            interval={xAxisInterval}
            height={xAxisHeight}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e0" }}
          />
          <YAxis
            label={{
              value: "KWH",
              angle: -90,
              position: "insideLeft",
              offset: -5,
              fontSize: 10,
              fill: "#6b7280",
            }}
            tick={{ fontSize: 9, fill: "#6b7280" }}
            domain={["dataMin - 10", "dataMax + 10"]}
            tickLine={false}
            axisLine={{ stroke: "#cbd5e0" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #a0aec0",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
            labelStyle={{ color: "#2d3748", fontWeight: "bold" }}
            itemStyle={{ color: "#4a5568" }}
            formatter={(value, name) => [`${value} KWH`, ` ${name}`]} // Hapus 'Hour:' karena label bisa bervariasi
          />
          <Line
            type="monotone"
            dataKey="kwh"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 5,
              strokeWidth: 2,
              fill: "#60a5fa",
              stroke: "#fff",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyUsageChart;

"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function TrendChart({
  data,
  dataKeys,
}: {
  data: Array<Record<string, number | string>>;
  dataKeys: { key: string; color: string; label: string }[];
}) {
  return (
    <div className="w-full h-56">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#E8E3D9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#7B7E8A", fontSize: 11 }}
            stroke="#E8E3D9"
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fill: "#7B7E8A", fontSize: 11 }}
            stroke="#E8E3D9"
            tickLine={false}
            width={28}
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #E8E3D9",
              borderRadius: 12,
              fontSize: 12,
            }}
          />
          {dataKeys.map((dk) => (
            <Line
              key={dk.key}
              type="monotone"
              dataKey={dk.key}
              name={dk.label}
              stroke={dk.color}
              strokeWidth={2}
              dot={{ r: 2.5 }}
              activeDot={{ r: 4 }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

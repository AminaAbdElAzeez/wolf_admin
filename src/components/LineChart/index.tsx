import React from "react";
import { FormattedMessage } from "react-intl";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
} from "recharts";

const data = [
  { index: 0, value: 0 },
  { index: 10, value: 5000 },
  { index: 20, value: 15000 },
  { index: 30, value: 25000 },
  { index: 40, value: 20000 },
  { index: 50, value: 35000 },
  { index: 60, value: 15000 },
  { index: 70, value: 0 },
  { index: 80, value: 5000 },
  { index: 90, value: 18000 },
  { index: 100, value: 28000 },
  { index: 110, value: 10000 },
  { index: 120, value: 36000 },
  { index: 130, value: 15000 },
  { index: 140, value: 0 },
  { index: 150, value: 8000 },
  { index: 160, value: 1000 },
  { index: 170, value: 8000 },
  { index: 180, value: 3000 },
  { index: 190, value: 26000 },
  { index: 200, value: 25000 },
];

const LineChartComponent = () => {
  return (
    <div className="lineChart bg-white p-4 rounded-2xl shadow-md mb-9">
      <h3 className="text-[22px] text-[#202224] font-[700] mb-8">
        <FormattedMessage id="chart4" />
      </h3>
      <div className="w-full max-w-full overflow-x-auto flex items-center rtl:justify-end ltr:justify-start">
        <ResponsiveContainer minWidth={600} width="100%" height={400}>
          <LineChart data={data} className="">
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis dataKey="index" tick={{ fontSize: 12, fill: "#666" }} />
            <YAxis tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4A90E2" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="none"
              fill="url(#colorGradient)"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4A90E2"
              strokeWidth={2}
              dot={{
                fill: "#4A90E2",
                stroke: "#ffffff",
                strokeWidth: 2,
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;

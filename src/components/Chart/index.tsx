import React, { useState } from "react";
import { Card, Table } from "antd";
import { Line } from "@ant-design/plots";
import { LineChartOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";

const Chart = () => {
  const stats = [
    {
      title: <FormattedMessage id="chart1" />,
      value: "2040",
      bg: "#B7FFDB",
      color: "#36CA7F",
    },
    {
      title: <FormattedMessage id="chart2" />,
      value: "240",
      bg: "#FFDED2",
      color: "#FF9066",
    },
    {
      title: <FormattedMessage id="chart3" />,
      value: "2040",
      bg: "#DEEAFF",
      color: "#2A374E",
    },
  ];

  return (
    <div className="chart py-5 rtl text-right mb-4">
      <div className="flex justify-start items-center flex-wrap gap-4">
        {stats.map((stat, index) => {
          const [hovered, setHovered] = useState(false);
          return (
            <Card
              key={index}
              className="shadow-md p-4 w-[32%] h-[152px] min-w-[305px] max-[996px]:w-full transition-all duration-300"
              style={{
                borderBottom: `4px solid ${
                  hovered ? stat.color : "transparent"
                }`,
                backgroundColor: hovered ? "#f3f4f6" : "white",
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div className="w-[88%] ltr:text-left">
                <h2 className="text-[15px] text-[#374957] font-[700]">
                  {stat.title}
                </h2>
                <p className="text-[30px] text-[#2A374E] font-[700]">
                  {stat.value}
                </p>
              </div>
              <div className="w-[12%] text-left">
                <LineChartOutlined
                  style={{
                    fontSize: "25px",
                    backgroundColor: stat.bg,
                    color: stat.color,
                    padding: "12px",
                    borderRadius: "50%",
                  }}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Chart;

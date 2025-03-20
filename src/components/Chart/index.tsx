import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import { Line } from "@ant-design/plots";
import { LineChartOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import axios from "utlis/library/helpers/axios";

const Chart = () => {
  const [totalSubmissions, setTotalSubmissions] = useState(null);
  const [totalContacts, setTotalContacts] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [servicesRes, contactsRes] = await Promise.all([
          axios.get("statistics/total-services"),
          axios.get("statistics/total-contacts"),
        ]);

        setTotalSubmissions(servicesRes.data.totalSubmissions);
        setTotalContacts(contactsRes.data.totalSubmissions);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const stats = [
    {
      title: <FormattedMessage id="chart1" />,
      value: loading ? "..." : totalSubmissions || 0,
      bg: "#B7FFDB",
      color: "#36CA7F",
    },
    {
      title: <FormattedMessage id="chart2" />,
      value: loading ? "..." : totalContacts || 0,
      bg: "#FFDED2",
      color: "#FF9066",
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
              className="shadow-md p-4 w-[48%] h-[152px] min-w-[305px] max-[996px]:w-full transition-all duration-300"
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
                <h2 className="text-[20px] text-[#374957] font-[700] transition-colors duration-300 hover:text-[#ed1c24]">
                  {stat.title}
                </h2>
                <p className="text-[30px] text-[#2A374E] font-[600] transition-colors duration-300 hover:text-[#ed1c24]">
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

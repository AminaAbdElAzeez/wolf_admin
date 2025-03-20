import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import RollerLoading from "components/loading/roller";
import { FormattedMessage, useIntl } from "react-intl";
import axios from "utlis/library/helpers/axios";

interface ServiceData {
  serviceTypeId: number;
  count: number;
}

interface ServiceType {
  id: number;
  name: string;
}

const COLORS = ["#D84D4D", "#E87052", "#6AC49D", "#58B3A3", "#E6E46F"];

const ServicePieChart = () => {
  const { locale } = useIntl();
  const headers = { "Accept-Language": locale === "ar" ? "ar-SA" : "en-US" };

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["serviceStats", locale],
    queryFn: async () => {
      const response = await axios.get<ServiceData[]>(
        "/statistics/by-service-type",
        { headers }
      );
      return response.data;
    },
  });

  const {
    data: serviceTypes,
    isLoading: typesLoading,
    error: typesError,
  } = useQuery({
    queryKey: ["serviceTypes", locale],
    queryFn: async () => {
      const response = await axios.get<{ data: ServiceType[] }>(
        "/Servicetype",
        { headers }
      );
      return response.data.data;
    },
  });

  const isLoading = statsLoading || typesLoading;
  const error = statsError || typesError;

  const transformData = () => {
    if (!stats || !serviceTypes) return [];
    return stats.map((item) => {
      const service = serviceTypes.find((s) => s.id === item.serviceTypeId);
      return {
        name: service ? service.name : `Service ${item.serviceTypeId}`,
        value: item.count,
        id: item.serviceTypeId,
      };
    });
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg w-[92%] mx-auto">
      <h2 className="pt-3 text-[20px] font-bold text-gray-700 text-center mb-4">
        <FormattedMessage id="serviceDistribution" />
      </h2>

      <div className="overflow-x-auto overflow-y-auto p-4" style={{ maxHeight: "600px" }}>
      <div style={{ minWidth: "600px" }} className="flex justify-center items-center">
        <PieChart width={500} height={500}>
          <Pie
            data={transformData()}
            cx="50%"
            cy="50%"
            outerRadius={150}
            dataKey="value"
            label={({ name, percent, midAngle, outerRadius, index }) => {
              const RADIAN = Math.PI / 180;
              const service = serviceTypes?.find((s) => s.name === name);
              const isSpecialService = service
                ? service.id === 3 || service.id === 5
                : false;
              const radius = outerRadius + (isSpecialService ? 30 : 60);
              const x = 250 + radius * Math.cos(-midAngle * RADIAN);
              const y = 250 + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill={COLORS[index % COLORS.length]}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  style={{ pointerEvents: "none" }}
                >
                  <tspan x={x} dy="-5">
                    {name}
                  </tspan>
                  <tspan x={x} dy="20">{`${(percent * 100).toFixed(
                    0
                  )}%`}</tspan>
                </text>
              );
            }}
            labelLine={true}
          >
            {transformData().map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              fontSize: "14px",
              fontWeight: "bold",
              fontFamily: "Tajawal, Cairo, sans-serif",
            }}
          />
        </PieChart>
      </div>
      </div>
    </div>
  );
};

export default ServicePieChart;

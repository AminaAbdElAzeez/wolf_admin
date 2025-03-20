import { useQuery } from "@tanstack/react-query";
import axios from "utlis/library/helpers/axios";
import dayjs from "dayjs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FormattedMessage, useIntl } from "react-intl";

interface StatisticsChartProps {
  selectedDate: string;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({ selectedDate }) => {
  const { locale } = useIntl();
  const headers = {
    "Accept-Language": locale === "ar" ? "ar-SA" : "en-US",
  };

  const fetchStatistics = async (date: string) => {
    try {
      const formattedDate = dayjs(date).format("YYYY-MM");
      // console.log("📅 Fetching statistics for month:", formattedDate);

      const response = await axios.get(`statistics/per-day`, {
        params: { date: formattedDate },
        headers, 
      });

      // console.log("✅ API Response:", response.data);
      return response.data;
    } catch (error: any) {
      // console.error("❌ API Error:", error?.response?.data || error.message);
      throw new Error(error?.response?.data?.message);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["statistics", selectedDate, locale],
    queryFn: () => fetchStatistics(selectedDate),
    enabled: !!selectedDate,
    staleTime: 0,
  });

  const chartData =
    data && data.days && data.counts
      ? data.days.map((day: string, index: number) => ({
          time: dayjs(`${selectedDate.slice(0, 7)}-${day.padStart(2, "0")}`).format("YYYY-MM-DD"),
          value: Number(data.counts[index]),
        }))
      : [];

  return (
    
    <div className="p-4 bg-white shadow-lg rounded-lg w-[92%] mx-auto mb-5">
        <div className="overflow-x-auto" style={{ minHeight: "400px" }}>
          <div style={{ minWidth: "600px" }}>
          <ResponsiveContainer width="100%" height={350} >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickFormatter={(time) => dayjs(time).format("DD MMM")} />
            <YAxis allowDecimals={false} domain={[0, "dataMax + 10"]} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
          </div>
        </div>
    </div>
  );
};

export default StatisticsChart;

import { useState } from "react";
import {
  DatePicker,
} from "antd";

import RollerLoading from "components/loading/roller";
import Chart from "components/Chart";
import ServicePieChart from "components/pieChart";
import dayjs from "dayjs";
import StatisticsChart from "components/statisticsChart";
import { FormattedMessage } from "react-intl";

const Statistics = () => {


  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format("YYYY-MM-DD")
  );

  return (
    <>
      <div className="container mx-auto">
      <Chart />
        <ServicePieChart />
        <div className="p-6 bg-white shadow-lg rounded-lg w-[92%] mx-auto mt-6">
          <h2 className="text-xl font-bold mb-4"><FormattedMessage id="MonthlyStatistics" />
                </h2>
        <DatePicker
          className="mb-6 p-3 border rounded-md"
          picker="month"
          onChange={(date) =>
            setSelectedDate(date ? dayjs(date).format("YYYY-MM") : "")
          }
        />
          <StatisticsChart selectedDate={selectedDate} />
        </div>
      </div>
    </>
  );
};

export default Statistics;

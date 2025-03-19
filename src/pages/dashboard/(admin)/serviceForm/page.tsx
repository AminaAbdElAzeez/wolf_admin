import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { InputRef, TableColumnsType, TableColumnType } from "antd";
import axios from "utlis/library/helpers/axios";
import {
  Input,
  Space,
  Table,
  Button,
  message,
  Form,
  Modal,
  Tooltip,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "react-intl";
import faqsActions from "../../../../store/faq/actions";
import RollerLoading from "components/loading/roller";
import { FaPlus } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";

// import FaqModal from "./modal";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
}

type DataIndex = keyof DataType;

const ServiceForm = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [serviceType, setServiceType] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [branch, setBranch] = useState("");
  const [vehicleSize, setVehicleSize] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");

  const vehicleSizes = [
    { id: 0, name: <FormattedMessage id="small" /> },
    { id: 1, name: <FormattedMessage id="compact" /> },
    { id: 2, name: <FormattedMessage id="intermediate" /> },
    { id: 3, name: <FormattedMessage id="large" /> },
    { id: 4, name: <FormattedMessage id="family" /> },
  ];

  const deliveryMethods = [
    { id: 0, name: <FormattedMessage id="atCenter" /> },
    { id: 1, name: <FormattedMessage id="ViaTowTruck" /> },
  ];

  const [form] = Form.useForm();
  const searchQuery = () => {
    let search = "";
    if (Object.keys(query).length > 0) {
      for (let x in query) {
        search = `${search}` + `&${x}=${query[x]}`;
      }
    }
    return search;
  };
  ///table data
  const columnSearch = (placeholder, state, setState, columnName) => {
    return (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={placeholder}
          value={state}
          onChange={(e) => setState(e.target.value)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Button
          icon={<SearchOutlined className="mr-[-2px]" />}
          className="bg-[#03b89e] text-[#fff] w-full"
          onClick={() => {
            if (state) {
              setQuery({ ...query, [columnName]: state });
            } else {
              const obj = { ...query };
              delete obj[columnName];
              setQuery(obj);
            }
          }}
        >
          <FormattedMessage id="search" />
        </Button>
      </div>
    );
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: <FormattedMessage id="name2" />,
      dataIndex: "name",
      key: "name",
      width: "10%",
      // filterDropdown: columnSearch("name", name, setName, "name"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="phone" />,
      dataIndex: "phone",
      key: "phone",
      width: "8%",
      // filterDropdown: columnSearch("phone", phone, setPhone, "phone"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: phone ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="email" />,
      dataIndex: "email",
      key: "email",
      width: "10%",
      // filterDropdown: columnSearch("email", email, setEmail, "email"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: email ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="couponCode" />,
      dataIndex: "couponCode",
      key: "couponCode",
      width: "8%",
      // filterDropdown: columnSearch(
      //   "couponCode",
      //   couponCode,
      //   setCouponCode,
      //   "couponCode"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: couponCode ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="serviceType" />,
      dataIndex: "serviceType",
      key: "serviceType",
      width: "8%",
      // filterDropdown: columnSearch(
      //   "serviceType",
      //   serviceType,
      //   setServiceType,
      //   "serviceType"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: serviceType ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="vehicleType" />,
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: "8%",
      // filterDropdown: columnSearch(
      //   "vehicleType",
      //   vehicleType,
      //   setVehicleType,
      //   "vehicleType"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: vehicleType ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="vehicleSize" />,
      dataIndex: "vehicleSize",
      key: "vehicleSize",
      width: "8%",
      render: (value) => {
        const size = vehicleSizes.find((size) => size.id === value);
        return size ? size.name : value;
      },
      // filterDropdown: columnSearch(
      //   "vehicleSize",
      //   vehicleSize,
      //   setVehicleSize,
      //   "vehicleSize"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: vehicleSize ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="branch" />,
      dataIndex: "branch",
      key: "branch",
      width: "8%",
      // filterDropdown: columnSearch("branch", branch, setBranch, "branch"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: branch ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="delivery" />,
      dataIndex: "carDeliveryMethod",
      key: "carDeliveryMethod",
      width: "8%",
      render: (value) => {
        const method = deliveryMethods.find((method) => method.id === value);
        return method ? method.name : value;
      },
      // filterDropdown: columnSearch("branch", branch, setBranch, "branch"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: branch ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="startDate" />,
      dataIndex: "date",
      key: "date",
      width: "8%",
      // filterDropdown: columnSearch(
      //   "startDate",
      //   startDate,
      //   setStartDate,
      //   "startDate"
      // ),
      // filterIcon: (
      //   <SearchOutlined style={{ color: startDate ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="time" />,
      dataIndex: "time",
      key: "time",
      width: "8%",
      // filterDropdown: columnSearch("endDate", endDate, setEndDate, "endDate"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: endDate ? "#03b89e" : undefined }} />
      // ),
    },
  ];

  //// get all faqs
  const fetchData = async () => {
    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    const searchParams = searchQuery();
    // params.query = query;

    const { data } = await axios.get(`Form/service`);
    // console.log(data)
    setPagination((current) => ({
      ...current,
      totalCount: data?.count,
    }));

    return data?.data;
  };
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      "fetchFaqs",
      pagination?.currentPage,
      pagination?.pageSize,
      query,
    ],
    queryFn: fetchData,
    // refetchInterval: 5000,
  });

  return (
    <>
      <div className="container mx-auto">
        {isLoading ? (
          <RollerLoading />
        ) : (
          <Table<DataType>
            columns={columns}
            // dataSource={data}
            dataSource={data?.map((item) => ({ ...item, key: item.id }))}
            scroll={{ x: 2400, y: 350 }}
            pagination={{
              total: pagination.totalCount,
              current: pagination.currentPage + 1,
              pageSize: pagination.pageSize,
              onChange(page, pageSize) {
                setPagination((current) => ({
                  ...current,
                  pageSize,
                  currentPage: page - 1,
                }));
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default ServiceForm;

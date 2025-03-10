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
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  // id: number;

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

  const [questionArabic, setQuestionArabic] = useState("");
  const [questionEnglish, setQuestionEnglish] = useState("");
  const [answerArabic, setAnswerArabic] = useState("");
  const [answerEnglish, setAnswerEnglish] = useState("");
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [editFaqOpen, setEditFaqOpen] = useState(false);
  const [deleteFaqOpen, setDeleteFaqOpen] = useState(false);
  const [faqId, setFaqId] = useState(undefined);

  //   const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");

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
      title: <FormattedMessage id="name" />,
      dataIndex: "name",
      key: "name",
      width: "20%",
      filterDropdown: columnSearch("name", name, setName, "name"),
      filterIcon: (
        <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="phone" />,
      dataIndex: "phone",
      key: "phone",
      width: "20%",
      filterDropdown: columnSearch("phone", phone, setPhone, "phone"),
      filterIcon: (
        <SearchOutlined
          style={{ color: questionEnglish ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="email" />,
      dataIndex: "email",
      key: "email",
      width: "20%",
      filterDropdown: columnSearch("email", email, setEmail, "email"),
      filterIcon: (
        <SearchOutlined
          style={{ color: questionEnglish ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="couponCode" />,
      dataIndex: "couponCode",
      key: "couponCode",
      width: "20%",
      filterDropdown: columnSearch(
        "couponCode",
        couponCode,
        setCouponCode,
        "couponCode"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: couponCode ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="serviceType" />,
      dataIndex: "serviceType",
      key: "serviceType",
      width: "20%",
      filterDropdown: columnSearch(
        "serviceType",
        serviceType,
        setServiceType,
        "serviceType"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: serviceType ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="vehicleType" />,
      dataIndex: "vehicleType",
      key: "vehicleType",
      width: "20%",
      filterDropdown: columnSearch(
        "vehicleType",
        vehicleType,
        setVehicleType,
        "vehicleType"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: vehicleType ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="vehicleSize" />,
      dataIndex: "vehicleSize",
      key: "vehicleSize",
      width: "20%",
      filterDropdown: columnSearch(
        "vehicleSize",
        vehicleSize,
        setVehicleSize,
        "vehicleSize"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: vehicleSize ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="branch" />,
      dataIndex: "branch",
      key: "branch",
      width: "20%",
      filterDropdown: columnSearch("branch", branch, setBranch, "branch"),
      filterIcon: (
        <SearchOutlined style={{ color: branch ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="startDate" />,
      dataIndex: "startDate",
      key: "startDate",
      width: "20%",
      filterDropdown: columnSearch(
        "startDate",
        startDate,
        setStartDate,
        "startDate"
      ),
      filterIcon: (
        <SearchOutlined style={{ color: startDate ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="endDate" />,
      dataIndex: "endDate",
      key: "endDate",
      width: "20%",
      filterDropdown: columnSearch("endDate", endDate, setEndDate, "endDate"),
      filterIcon: (
        <SearchOutlined style={{ color: endDate ? "#03b89e" : undefined }} />
      ),
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
  //// add Faq logic
  const addFaqMutation = useMutation({
    mutationFn: (values: any) => axios["post"](`Branch`, values),
    onSuccess: (res) => {
      setAddFaqOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addFaqFunc = (values: any) => {
    addFaqMutation.mutate(values);
  };

  //// edit Faq logic
  const editFaqMutation = useMutation({
    mutationFn: (values: { id: number; name: string; nameAr: string }) =>
      axios["put"](`Branch`, { ...values, id: faqId }),
    onSuccess: (res) => {
      setEditFaqOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editFaqFunc = (values: {
    id: number;
    name: string;
    nameAr: string;
  }) => {
    console.log("🚀 Sending Data:", values);
    editFaqMutation.mutate(values);
  };

  /// delete faq logic

  const deleteFaqMutation = useMutation({
    mutationFn: () => axios["delete"](`Branch?id=${faqId}`),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;

      setDeleteFaqOpen(false);
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteFaqFunc = () => {
    deleteFaqMutation.mutate();
  };

  return (
    <>
      <div className="container mx-auto">
        {isLoading ? (
          <RollerLoading />
        ) : (
          <Table<DataType>
            title={() => (
              <Button
                type="primary"
                className="shadow-none"
                icon={<FaPlus />}
                shape="circle"
                // loading={loading}
                onClick={() => {
                  form.resetFields();
                  setAddFaqOpen(true);
                }}
              />
            )}
            columns={columns}
            dataSource={data}
            scroll={{ x: 1500, y: 350 }}
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

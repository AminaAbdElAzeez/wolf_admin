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
import RollerLoading from "components/loading/roller";

// import FaqModal from "./modal";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
}

type DataIndex = keyof DataType;

const ContactForm = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [faqId, setFaqId] = useState(undefined);
  const [details, setDetails] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

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
      width: "25%",
      // filterDropdown: columnSearch("name", name, setName, "name"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="email" />,
      dataIndex: "email",
      key: "email",
      width: "25%",
      // filterDropdown: columnSearch("email", email, setEmail, "email"),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: email ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="subject" />,
      dataIndex: "subject",
      key: "subject",
      width: "25%",
      // filterDropdown: columnSearch("subject", subject, setSubject, "subject"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: subject ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="details" />,
      dataIndex: "details",
      key: "details",
      width: "25%",
      // filterDropdown: columnSearch("details", details, setDetails, "details"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: details ? "#03b89e" : undefined }} />
      // ),
    },
  ];

  //// get all faqs
  const fetchData = async () => {
    const params = {
      pageNumber: pagination.currentPage + 1,
      pageSize: pagination.pageSize,
    };

    console.log("🚀 API Params:", params);

    const { data } = await axios.get(`Form/contact`, { params });

    console.log("✅ API Response:", data);

    setPagination((current) => ({
      ...current,
      totalCount: data?.totalRecords,
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
            scroll={{ x: 1200, y: 350 }}
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
                refetch();
              },
            }}
          />
        )}
      </div>
    </>
  );
};

export default ContactForm;

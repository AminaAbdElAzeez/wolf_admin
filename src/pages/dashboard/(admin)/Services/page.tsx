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
import { AddServiceModal, DeleteServiceModal, EditServiceModal } from "./modal";

// import FaqModal from "./modal";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
}

type DataIndex = keyof DataType;

const Services = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [editServiceOpen, setEditServiceOpen] = useState(false);
  const [deleteServiceOpen, setDeleteServiceOpen] = useState(false);
  const [ServiceId, setServiceId] = useState(undefined);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const { locale } = useIntl();
  const headers = {
    "Accept-Language": locale === "ar" ? "ar-SA" : "en-US",
  };

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
      width: "33%",
      // filterDropdown: columnSearch("name", name, setName, "name"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="nameAr" />,
      dataIndex: "nameAr",
      key: "nameAr",
      width: "33%",
      // filterDropdown: columnSearch("nameAr", nameAr, setNameAr, "nameAr"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: nameAr ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="actions" />,
      key: "actions",
      width: "33%",
      render: (_, record: DataType) => (
        <div className="flex">
          <Tooltip title={<FormattedMessage id="edit" />} color="#209163">
            <span>
              <FiEdit
                className="text-primary cursor-pointer mx-3 text-xl text-[#209163]"
                onClick={() => {
                  setServiceId(record.id);
                  form.setFieldsValue({
                    name: record?.name,
                    nameAr: record?.nameAr,
                  });
                  setEditServiceOpen(true);
                }}
              />
            </span>
          </Tooltip>
          <Tooltip
            title={<FormattedMessage id="delete" />}
            color="rgb(185 28 28)"
          >
            <span>
              <FiTrash
                className="text-red-700  cursor-pointer mx-3 text-xl"
                onClick={() => {
                  setServiceId(record.id);
                  setDeleteServiceOpen(true);
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // get all Services
  const fetchData = async () => {
    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    const searchParams = searchQuery();
    // params.query = query;

    const { data } = await axios.get(`Servicetype/admin`);
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

  // add Service logic
  const addServiceMutation = useMutation({
    mutationFn: (values: any) =>
      axios["post"](`Servicetype`, values, { headers: headers }),
    onSuccess: (res) => {
      setAddServiceOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addServiceFunc = (values: any) => {
    addServiceMutation.mutate(values);
  };

  // edit Service logic
  const editFaqMutation = useMutation({
    mutationFn: (values: { id: number; name: string; nameAr: string }) =>
      axios["put"](
        `Servicetype`,
        { ...values, id: ServiceId },
        { headers: headers }
      ),
    onSuccess: (res) => {
      setEditServiceOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editServiceFunc = (values: {
    id: number;
    name: string;
    nameAr: string;
  }) => {
    console.log("🚀 Sending Data:", values);
    editFaqMutation.mutate(values);
  };

  /// delete Service logic
  const deleteServiceMutation = useMutation({
    mutationFn: () =>
      axios["delete"](`Servicetype?id=${ServiceId}`, { headers: headers }),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;
      setDeleteServiceOpen(false);
      refetch();
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteServiceFunc = () => {
    deleteServiceMutation.mutate();
  };

  return (
    <>
      <div className="container mx-auto">
        {isLoading ? (
          <RollerLoading />
        ) : (
          <Table<DataType>
            title={() => (
              <Tooltip title={<FormattedMessage id="add" />} color="#ed1c24">
                <Button
                  type="primary"
                  className="shadow-none"
                  icon={<FaPlus />}
                  shape="circle"
                  // loading={loading}
                  onClick={() => {
                    form.resetFields();
                    setAddServiceOpen(true);
                  }}
                />
              </Tooltip>
            )}
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
              },
            }}
          />
        )}
      </div>
      <AddServiceModal
        open={addServiceOpen}
        cancel={() => {
          setAddServiceOpen(false);
          form.resetFields();
        }}
        ok={addServiceFunc}
        form={form}
        loading={addServiceMutation.isPending}
      />
      <EditServiceModal
        open={editServiceOpen}
        cancel={() => setEditServiceOpen(false)}
        form={form}
        ok={editServiceFunc}
        loading={editFaqMutation.isPending}
      />
      <DeleteServiceModal
        open={deleteServiceOpen}
        cancel={() => setDeleteServiceOpen(false)}
        ok={deleteServiceFunc}
        loading={deleteServiceMutation.isPending}
      />
    </>
  );
};

export default Services;

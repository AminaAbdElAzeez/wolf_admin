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
import { EditFaqModal, DeleteFaqModal, AddBranchModal } from "./modal";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
}

type DataIndex = keyof DataType;

const Branches = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [addBranchOpen, setAddBranchOpen] = useState(false);
  const [editBranchOpen, setEditBranchOpen] = useState(false);
  const [deleteBranchOpen, setDeleteBranchOpen] = useState(false);
  const [branchId, setBranchId] = useState(undefined);
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
                className="cursor-pointer mx-3 text-xl text-[#209163]"
                onClick={() => {
                  setBranchId(record.id);
                  form.setFieldsValue({
                    name: record?.name,
                    nameAr: record?.nameAr,
                  });
                  setEditBranchOpen(true);
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
                  setBranchId(record.id);
                  setDeleteBranchOpen(true);
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // get all Branches
  const fetchData = async () => {
    const params = {
      pageNumber: pagination.currentPage + 1,
      pageSize: pagination.pageSize,
    };

    console.log("🚀 API Params:", params);

    const { data } = await axios.get(`Branch/admin`, { params });

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

  // add Branch logic
  const addBranchMutation = useMutation({
    mutationFn: (values: any) =>
      axios["post"](`Branch`, values, { headers: headers }),
    onSuccess: (res) => {
      setAddBranchOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addBranchFunc = (values: any) => {
    addBranchMutation.mutate(values);
  };

  // edit Branch logic
  const editBranchMutation = useMutation({
    mutationFn: (values: { id: number; name: string; nameAr: string }) =>
      axios["put"](`Branch`, { ...values, id: branchId }, { headers: headers }),
    onSuccess: (res) => {
      setEditBranchOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editBranchFunc = (values: {
    id: number;
    name: string;
    nameAr: string;
  }) => {
    editBranchMutation.mutate(values);
  };

  /// delete Branch logic

  const deleteBranchMutation = useMutation({
    mutationFn: () =>
      axios["delete"](`Branch?id=${branchId}`, { headers: headers }),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;

      setDeleteBranchOpen(false);
      refetch();
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteBranchFunc = () => {
    deleteBranchMutation.mutate();
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
                  className="shadow-none bg-[#ed1c24]"
                  icon={<FaPlus />}
                  shape="circle"
                  // loading={loading}
                  onClick={() => {
                    form.resetFields();
                    setAddBranchOpen(true);
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
                refetch();
              },
            }}
          />
        )}
      </div>
      <AddBranchModal
        open={addBranchOpen}
        cancel={() => {
          setAddBranchOpen(false);
          form.resetFields();
        }}
        ok={addBranchFunc}
        form={form}
        loading={addBranchMutation.isPending}
      />
      <EditFaqModal
        open={editBranchOpen}
        cancel={() => setEditBranchOpen(false)}
        form={form}
        ok={editBranchFunc}
        loading={editBranchMutation.isPending}
      />
      <DeleteFaqModal
        open={deleteBranchOpen}
        cancel={() => setDeleteBranchOpen(false)}
        ok={deleteBranchFunc}
        loading={deleteBranchMutation.isPending}
      />
    </>
  );
};

export default Branches;

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
  Image,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useIntl, FormattedMessage } from "react-intl";
import faqsActions from "../../../../store/faq/actions";
import RollerLoading from "components/loading/roller";
import { FaPlus } from "react-icons/fa";
import { FiTrash } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import { AddLogoModal, DeleteLogoModal, EditLogoModal } from "./modals";

// import FaqModal from "./modal";

export interface DataType {
  id: number;
  imageUrl?: string;
}

type DataIndex = keyof DataType;

const Logo = () => {
  const dispatch = useDispatch();
  const intl = useIntl();
  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [addLogoOpen, setAddLogoOpen] = useState(false);
  const [editLogoOpen, setEditLogoOpen] = useState(false);
  const [deleteLogoOpen, setDeleteLogoOpen] = useState(false);
  const [LogoId, setLogoId] = useState(undefined);
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
      title: <FormattedMessage id="imageUrl" />,
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "50%",
      render: (_, record) =>
        record.imageUrl ? (
          <Image
            src={record.imageUrl}
            alt={intl.formatMessage({ id: "imageAlt" })}
            width={50}
            height={50}
            style={{ borderRadius: "5px", objectFit: "cover" }}
          />
        ) : (
          <span>No Data</span>
        ),
    },

    {
      title: <FormattedMessage id="actions" />,
      key: "actions",
      width: "50%",
      render: (_, record: DataType) => (
        <div className="flex">
          <Tooltip title={<FormattedMessage id="edit" />} color="#209163">
            <span>
              <FiEdit
                className="text-primary cursor-pointer mx-3 text-xl text-[#209163]"
                onClick={() => {
                  setLogoId({
                    id: record.id,
                    imageUrl: record.imageUrl,
                  });
                  setEditLogoOpen(true);
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
                  setLogoId(record.id);
                  setDeleteLogoOpen(true);
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // get all Logos
  const fetchData = async () => {
    const params = {
      pageNumber: pagination.currentPage + 1,
      pageSize: pagination.pageSize,
    };

    console.log("🚀 API Params:", params);

    const { data } = await axios.get(`Home/slider/logos`, { params });

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

  const addLogoMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();

      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("ImageUrl", values.Image[0].originFileObj);
      }
      // console.log("FormData Entries:", [...formData.entries()]);

      return axios.post(`/Home/slider/logos`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setAddLogoOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addLogoFunc = (values: any) => {
    addLogoMutation.mutate(values);
  };

  const editLogoMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("ImageUrl", values.Image[0].originFileObj);
      }

      return axios.put(`/Home/slider/logos?id=${values.Id}`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setEditLogoOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  // console.log(VehiclesId);

  const editLogoFunc = (values: any) => {
    const updatedValues = { ...values, Id: LogoId.id };
    editLogoMutation.mutate(updatedValues);
  };

  /// delete faq logic

  const deleteLogoMutation = useMutation({
    mutationFn: () =>
      axios["delete"](`Home/slider/logos?id=${LogoId}`, { headers: headers }),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;

      setDeleteLogoOpen(false);
      refetch();
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const deleteFaqFunc = () => {
    deleteLogoMutation.mutate();
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
                    setAddLogoOpen(true);
                  }}
                />
              </Tooltip>
            )}
            columns={columns}
            // dataSource={data}
            dataSource={data?.map((item) => ({ ...item, key: item.id }))}
            scroll={{ x: 1000, y: 350 }}
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
      <AddLogoModal
        open={addLogoOpen}
        cancel={() => {
          setAddLogoOpen(false);
          form.resetFields();
        }}
        ok={addLogoFunc}
        form={form}
        loading={addLogoMutation.isPending}
      />
      <EditLogoModal
        open={editLogoOpen}
        cancel={() => setEditLogoOpen(false)}
        form={form}
        ok={editLogoFunc}
        loading={editLogoMutation.isPending}
        data={LogoId}
      />
      <DeleteLogoModal
        open={deleteLogoOpen}
        cancel={() => setDeleteLogoOpen(false)}
        ok={deleteFaqFunc}
        loading={deleteLogoMutation.isPending}
      />
    </>
  );
};

export default Logo;

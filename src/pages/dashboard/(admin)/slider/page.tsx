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
import { AddSliderModal, DeleteSliderModal, EditSliderModal } from "./modals";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
  imageUrl?: string;
  ImageUrl?: string;
  Name: string;
  NameAr: string;
  titleEn: string;
  titleAr: string;
  descriptionAr: string;
  descriptionEn: string;
}

type DataIndex = keyof DataType;

const Slider = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [addSliderOpen, setAddSliderOpen] = useState(false);
  const [editSliderOpen, setEditSliderOpen] = useState(false);
  const [deleteSliderOpen, setDeleteSliderOpen] = useState(false);
  const [SliderId, setSliderId] = useState(undefined);
  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");

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
      title: <FormattedMessage id="titleEn" />,
      dataIndex: "titleEn",
      key: "titleEn",
      width: "17%",
      // filterDropdown: columnSearch("titleEn", titleEn, setTitleEn, "titleEn"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: titleEn ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="titleAr" />,
      dataIndex: "titleAr",
      key: "titleAr",
      width: "17%",
      // filterDropdown: columnSearch("titleAr", titleAr, setTitleAr, "titleAr"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: titleAr ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="descriptionEn2" />,
      dataIndex: "descriptionEn",
      key: "descriptionEn",
      width: "20%",
      // filterDropdown: columnSearch(
      //   "descriptionEn",
      //   descriptionEn,
      //   setDescriptionEn,
      //   "descriptionEn"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: descriptionEn ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="descriptionAr2" />,
      dataIndex: "descriptionAr",
      key: "descriptionAr",
      width: "20%",
      // filterDropdown: columnSearch(
      //   "descriptionAr",
      //   descriptionAr,
      //   setDescriptionAr,
      //   "descriptionAr"
      // ),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: descriptionAr ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="imageUrl" />,
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "10%",
      render: (_, record) =>
        record.imageUrl ? (
          <Image
            src={record.imageUrl}
            alt={record.name || "Branch Image"}
            width={50}
            height={50}
            style={{ borderRadius: "5px", objectFit: "cover" }}
          />
        ) : (
          <span>لا يوجد صورة</span>
        ),
    },

    {
      title: <FormattedMessage id="actions" />,
      key: "actions",
      width: "16%",
      render: (_, record: DataType) => (
        <div className="flex">
          <Tooltip title={<FormattedMessage id="edit" />} color="#209163">
            <span>
              <FiEdit
                className="text-primary cursor-pointer mx-3 text-xl text-[#209163]"
                onClick={() => {
                  setSliderId({
                    id: record.id,
                    titleEn: record.titleEn,
                    descriptionAr: record.descriptionAr,
                    descriptionEn: record.descriptionEn,
                    titleAr: record.titleAr,
                    imageUrl: record.imageUrl,
                  });
                  form.setFieldsValue({
                    Name: record.name,
                    NameAr: record.nameAr,
                  });
                  setEditSliderOpen(true);
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
                  setSliderId(record.id);
                  setDeleteSliderOpen(true);
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // get all Slider
  const fetchData = async () => {
    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    const searchParams = searchQuery();
    // params.query = query;

    const { data } = await axios.get(`Home/slider/admin`);
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

  // const yourAuthToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6ImZmYjhmMGQ5LTU2ODgtNGI4OC0yYTIwLTA4ZGQ1MDJmMWQwOSIsImp0aSI6ImU2M2Q2ZDA0LWM1ZGMtNDhmNS1iYmZjLThlOTVkYTJhOWM3OCIsImV4cCI6MTc0MTY3OTE5MywiaXNzIjoiV29sZlNoYWRvd0lzc3VlciIsImF1ZCI6IldvbGZTaGFkb3dVc2VyIn0.o6xDmFdwSKylpPoAc0y5mFRl8lULKDA_C8cUOvZOL50";

  // add Slider logic

  // const addVehicleMutation = useMutation({
  //   mutationFn: (values: any) => {
  //     const formData = new FormData();
  //     formData.append("id", values.Id);
  //     formData.append("name", values.Name);
  //     formData.append("nameAr", values.NameAr);

  //     if (
  //       values.Image &&
  //       values.Image.length > 0 &&
  //       values.Image[0].originFileObj
  //     ) {
  //       formData.append("image", values.Image[0].originFileObj);
  //     }

  //     return axios.post(`/Home/slider`, formData, {
  //       baseURL: "https://backend.wolf-shadow.com/api",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${yourAuthToken || ""}`,
  //       },
  //     });
  //   },
  //   onSuccess: (res) => {
  //     setAddFaqOpen(false);
  //     refetch();
  //     message.success(res?.data?.message, 3);
  //     form.resetFields();
  //   },
  //   onError: (err) => {
  //     message.error(err.message);
  //   },
  // });

  // const addVehicleFunc = (values: any) => {
  //   addVehicleMutation.mutate(values);
  // };

  const addSliderMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("TitleEn", values.titleEn);
      formData.append("TitleAr", values.titleAr);
      formData.append("DescriptionEn", values.descriptionEn);
      formData.append("DescriptionAr", values.descriptionAr);
      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("ImageUrl", values.Image[0].originFileObj);
      }

      return axios.post(`/Home/slider`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },

    onSuccess: (res) => {
      setAddSliderOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addSliderFunc = (values: any) => {
    form.resetFields();
    console.log("Form Values:", values);
    addSliderMutation.mutate(values);
  };

  const editSliderMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("Id", values.Id);
      formData.append("TitleEn", values.titleEn);
      formData.append("TitleAr", values.titleAr);
      formData.append("DescriptionEn", values.descriptionEn);
      formData.append("DescriptionAr", values.descriptionAr);
      formData.append("DescriptionAr", values.Image[0].originFileObj);

      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("ImageUrl", values.Image[0].originFileObj);
      }

      return axios.put(`/Home/slider`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setEditSliderOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editSliderFunc = (values: any) => {
    const updatedValues = { ...values, Id: SliderId.id };
    editSliderMutation.mutate(updatedValues);
  };

  /// delete Slider logic
  const deleteSliderMutation = useMutation({
    mutationFn: () => axios["delete"](`Home/slider?id=${SliderId}`),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;
      setDeleteSliderOpen(false);
      refetch();
      message.success(res?.data?.message);
    },
    onError: (err) => {
      message.error(err.message);
    },
  });
  const deleteSliderFunc = () => {
    deleteSliderMutation.mutate();
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
                    setAddSliderOpen(true);
                  }}
                />
              </Tooltip>
            )}
            columns={columns}
            // dataSource={data}
            dataSource={data?.map((item) => ({ ...item, key: item.id }))}
            scroll={{ x: 1600, y: 350 }}
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
      <AddSliderModal
        open={addSliderOpen}
        cancel={() => {
          setAddSliderOpen(false);
          form.resetFields();
        }}
        ok={addSliderFunc}
        form={form}
        loading={addSliderMutation.isPending}
      />
      <EditSliderModal
        open={editSliderOpen}
        cancel={() => setEditSliderOpen(false)}
        form={form}
        ok={editSliderFunc}
        loading={editSliderMutation.isPending}
        data={SliderId}
      />
      <DeleteSliderModal
        open={deleteSliderOpen}
        cancel={() => setDeleteSliderOpen(false)}
        ok={deleteSliderFunc}
        loading={deleteSliderMutation.isPending}
      />
    </>
  );
};

export default Slider;

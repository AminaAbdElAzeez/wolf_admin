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
import {
  AddVehiclesModal,
  DeleteVehiclesModal,
  EditVehicleModal,
} from "./modals";

// import FaqModal from "./modal";

export interface DataType {
  name: string;
  id: number;
  nameAr: string;
  imageUrl?: string;
  Name: string;
  NameAr: string;
}

type DataIndex = keyof DataType;

const Vehicles = () => {
  const dispatch = useDispatch();

  const [query, setQuery] = useState({} as any);
  const [pagination, setPagination] = useState({
    pageSize: 10,
    totalCount: 0,
    currentPage: 0,
  });

  const [addVehiclesOpen, setAddVehiclesOpen] = useState(false);
  const [editVehiclesOpen, setEditVehiclesOpen] = useState(false);
  const [deleteVehiclesOpen, setDeleteVehiclesOpen] = useState(false);
  const [VehiclesId, setVehiclesId] = useState(undefined);
  const { locale } = useIntl();
  const headers = {
    "Accept-Language": locale === "ar" ? "ar-SA" : "en-US",
  };

  const [name, setName] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [imageUrl, setImageUrl] = useState("");

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
      width: "25%",
      // filterDropdown: columnSearch("name", name, setName, "name"),
      // filterIcon: (
      //   <SearchOutlined style={{ color: name ? "#03b89e" : undefined }} />
      // ),
    },
    {
      title: <FormattedMessage id="nameAr" />,
      dataIndex: "nameAr",
      key: "nameAr",
      width: "25%",
      // filterDropdown: columnSearch("nameAr", nameAr, setNameAr, "nameAr"),
      // filterIcon: (
      //   <SearchOutlined
      //     style={{ color: nameAr ? "#03b89e" : undefined }}
      //   />
      // ),
    },
    {
      title: <FormattedMessage id="imageUrl" />,
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "25%",
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
      width: "25%",
      render: (_, record: DataType) => (
        <div className="flex">
          <Tooltip title={<FormattedMessage id="edit" />} color="#209163">
            <span>
              <FiEdit
                className="text-primary cursor-pointer mx-3 text-xl text-[#209163]"
                onClick={() => {
                  setVehiclesId({
                    id: record.id,
                    name: record.name,
                    nameAr: record.nameAr,
                    imageUrl: record.imageUrl,
                  });
                  form.setFieldsValue({
                    Name: record.name,
                    NameAr: record.nameAr,
                  });
                  setEditVehiclesOpen(true);
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
                  setVehiclesId(record.id);
                  setDeleteVehiclesOpen(true);
                }}
              />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  // get all Vehicles
  const fetchData = async () => {
    const params: { [key: string]: string | number } = {};
    if (typeof pagination.currentPage === "number") {
      params.skip = pagination.currentPage * pagination.pageSize;
      params.take = pagination.pageSize;
    }
    const searchParams = searchQuery();
    // params.query = query;

    const { data } = await axios.get(`Vehicletype/admin`);
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
  // add Vehicles logic
  // const addFaqMutation = useMutation({
  //   mutationFn: async ({
  //     url,
  //     formData,
  //   }: {
  //     url: string;
  //     formData?: FormData;
  //   }) => {
  //     if (formData) {
  //       return axios.post(url, formData, {
  //         headers: { "Content-Type": "multipart/form-data" },
  //       });
  //     } else {
  //       return axios.post(
  //         url,
  //         { Name: name, NameAr: nameAr },
  //         { headers: { "Content-Type": "application/json" } }
  //       );
  //     }
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

  // const addFaqFunc = (values: {
  //   name: string;
  //   nameAr: string;
  //   image?: File;
  // }) => {
  //   const { name, nameAr, image } = values;

  //   if (!image) {
  //     addFaqMutation.mutate({
  //       url: `Vehicletype`,
  //       formData: undefined,
  //     });

  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("Name", name);
  //   formData.append("NameAr", nameAr);
  //   formData.append("Image", image);

  //   addFaqMutation.mutate({
  //     url: `Vehicletype`,
  //     formData,
  //   });
  // };

  // const yourAuthToken =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6ImZmYjhmMGQ5LTU2ODgtNGI4OC0yYTIwLTA4ZGQ1MDJmMWQwOSIsImp0aSI6ImU2M2Q2ZDA0LWM1ZGMtNDhmNS1iYmZjLThlOTVkYTJhOWM3OCIsImV4cCI6MTc0MTY3OTE5MywiaXNzIjoiV29sZlNoYWRvd0lzc3VlciIsImF1ZCI6IldvbGZTaGFkb3dVc2VyIn0.o6xDmFdwSKylpPoAc0y5mFRl8lULKDA_C8cUOvZOL50";

  // const handleAddVehicle = async (values: any) => {
  //   try {
  //     const formData = new FormData();

  //     formData.append("name", values.Name);
  //     formData.append("nameAr", values.NameAr);

  //     if (
  //       values.Image &&
  //       values.Image.length > 0 &&
  //       values.Image[0].originFileObj
  //     ) {
  //       const imageFile = values.Image[0].originFileObj;
  //       console.log(, imageFile);
  //       formData.append("image", imageFile);
  //     } else {
  //       console.error("Error");
  //       return;
  //     }

  //     for (let pair of formData.entries()) {
  //       console.log(`📂 ${pair[0]}:`, pair[1]);
  //     }

  //     const response = await axios.post("/Vehicletype", formData, {
  //       baseURL: "https://backend.wolf-shadow.com/api",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${yourAuthToken || ""}`,
  //       },
  //     });

  //     console.log(, response.data);

  //     setAddFaqOpen(false);
  //     form.resetFields();
  //   } catch (error) {
  //     console.error( error.response?.data || error);
  //   }
  // };

  const addVehicleMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("id", values.Id);
      formData.append("name", values.Name);
      formData.append("nameAr", values.NameAr);

      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("image", values.Image[0].originFileObj);
      }

      return axios.post(`/Vehicletype`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setAddVehiclesOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const addVehicleFunc = (values: any) => {
    addVehicleMutation.mutate(values);
  };

  const editVehicleMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("Id", values.Id);
      formData.append("Name", values.Name);
      formData.append("NameAr", values.NameAr);

      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("Image", values.Image[0].originFileObj);
      }

      return axios.put(`/Vehicletype`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setEditVehiclesOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  const editVehicleFunc = (values: any) => {
    const updatedValues = { ...values, Id: VehiclesId.id };
    editVehicleMutation.mutate(updatedValues);
  };

  /// delete faq logic

  const deleteFaqMutation = useMutation({
    mutationFn: () =>
      axios["delete"](`Vehicletype?id=${VehiclesId}`, { headers: headers }),
    onSuccess: (res) => {
      // const { data } = res?.data?.data;

      setDeleteVehiclesOpen(false);
      refetch();
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
              <Tooltip title={<FormattedMessage id="add" />} color="#ed1c24">
                <Button
                  type="primary"
                  className="shadow-none"
                  icon={<FaPlus />}
                  shape="circle"
                  // loading={loading}
                  onClick={() => {
                    form.resetFields();
                    setAddVehiclesOpen(true);
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
      <AddVehiclesModal
        open={addVehiclesOpen}
        cancel={() => {
          setAddVehiclesOpen(false);
          form.resetFields();
        }}
        ok={addVehicleFunc}
        form={form}
        loading={addVehicleMutation.isPending}
      />
      <EditVehicleModal
        open={editVehiclesOpen}
        cancel={() => setEditVehiclesOpen(false)}
        form={form}
        ok={editVehicleFunc}
        loading={editVehicleMutation.isPending}
        data={VehiclesId}
      />
      <DeleteVehiclesModal
        open={deleteVehiclesOpen}
        cancel={() => setDeleteVehiclesOpen(false)}
        ok={deleteFaqFunc}
        loading={deleteFaqMutation.isPending}
      />
    </>
  );
};

export default Vehicles;

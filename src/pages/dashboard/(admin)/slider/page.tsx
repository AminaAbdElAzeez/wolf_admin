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
import { AddFaqModal, DeleteFaqModal, EditVehicleModal } from "./modals";

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
  imageUrl?: string;
  Name: string;
  NameAr: string;
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

  const [questionArabic, setQuestionArabic] = useState("");
  const [questionEnglish, setQuestionEnglish] = useState("");
  const [answerArabic, setAnswerArabic] = useState("");
  const [answerEnglish, setAnswerEnglish] = useState("");
  const [addFaqOpen, setAddFaqOpen] = useState(false);
  const [editFaqOpen, setEditFaqOpen] = useState(false);
  const [deleteFaqOpen, setDeleteFaqOpen] = useState(false);
  const [faqId, setFaqId] = useState(undefined);

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
      title: <FormattedMessage id="title" />,
      dataIndex: "titleEn",
      key: "titleEn",
      width: "20%",
      filterDropdown: columnSearch("titleEn", titleEn, setTitleEn, "titleEn"),
      filterIcon: (
        <SearchOutlined style={{ color: titleEn ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="title" />,
      dataIndex: "titleAr",
      key: "titleAr",
      width: "20%",
      filterDropdown: columnSearch("titleAr", titleAr, setTitleAr, "titleAr"),
      filterIcon: (
        <SearchOutlined style={{ color: titleAr ? "#03b89e" : undefined }} />
      ),
    },
    {
      title: <FormattedMessage id="description" />,
      dataIndex: "descriptionEn",
      key: "descriptionEn",
      width: "20%",
      filterDropdown: columnSearch(
        "descriptionEn",
        descriptionEn,
        setDescriptionEn,
        "descriptionEn"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: descriptionEn ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="description" />,
      dataIndex: "descriptionAr",
      key: "descriptionAr",
      width: "20%",
      filterDropdown: columnSearch(
        "descriptionAr",
        descriptionAr,
        setDescriptionAr,
        "descriptionAr"
      ),
      filterIcon: (
        <SearchOutlined
          style={{ color: descriptionAr ? "#03b89e" : undefined }}
        />
      ),
    },
    {
      title: <FormattedMessage id="imageUrl" />,
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "20%",
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
      width: "20%",
      render: (_, record: DataType) => (
        <div className="flex">
          <Tooltip title={<FormattedMessage id="edit" />} color="#209163">
            <FiEdit
              className="text-primary cursor-pointer mx-3 text-xl"
              onClick={() => {
                setFaqId({
                  id: record.id,
                  name: record.name, // تأكد من استخدام المفتاح الصحيح
                  nameAr: record.nameAr,
                  imageUrl: record.imageUrl, // تأكد من وجود الصورة
                });
                form.setFieldsValue({
                  // Id: record.id,
                  Name: record.name,
                  NameAr: record.nameAr,
                  // Image: record.imageUrl ? [{ url: record.imageUrl }] : [], // تحميل الصورة
                });
                setEditFaqOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title={<FormattedMessage id="delete" />}
            color="rgb(185 28 28)"
          >
            <FiTrash
              className="text-red-700  cursor-pointer mx-3 text-xl"
              onClick={() => {
                setFaqId(record.id);
                setDeleteFaqOpen(true);
              }}
            />
          </Tooltip>
        </div>
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
  //// add Faq logic
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
  //         { Name: name, NameAr: nameAr }, // ✅ إرسال البيانات كـ JSON
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
  //     // ✅ عند عدم وجود صورة، نرسل البيانات كـ JSON وليس داخل formData
  //     addFaqMutation.mutate({
  //       url: `Vehicletype`,
  //       formData: undefined, // ✅ لا نمرر FormData
  //     });

  //     return;
  //   }

  //   // ✅ عند وجود صورة، نستخدم FormData
  //   const formData = new FormData();
  //   formData.append("Name", name);
  //   formData.append("NameAr", nameAr);
  //   formData.append("Image", image);

  //   addFaqMutation.mutate({
  //     url: `Vehicletype`,
  //     formData,
  //   });
  // };

  const yourAuthToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6ImZmYjhmMGQ5LTU2ODgtNGI4OC0yYTIwLTA4ZGQ1MDJmMWQwOSIsImp0aSI6ImU2M2Q2ZDA0LWM1ZGMtNDhmNS1iYmZjLThlOTVkYTJhOWM3OCIsImV4cCI6MTc0MTY3OTE5MywiaXNzIjoiV29sZlNoYWRvd0lzc3VlciIsImF1ZCI6IldvbGZTaGFkb3dVc2VyIn0.o6xDmFdwSKylpPoAc0y5mFRl8lULKDA_C8cUOvZOL50";

  // const handleAddVehicle = async (values: any) => {
  //   try {
  //     const formData = new FormData();

  //     // ✅ تأكيد إضافة الاسم والاسم العربي
  //     formData.append("name", values.Name);
  //     formData.append("nameAr", values.NameAr);

  //     // ✅ التأكد من أن الصورة موجودة قبل الإرسال
  //     if (
  //       values.Image &&
  //       values.Image.length > 0 &&
  //       values.Image[0].originFileObj
  //     ) {
  //       const imageFile = values.Image[0].originFileObj;
  //       console.log("📷 تفاصيل الصورة:", imageFile);
  //       formData.append("image", imageFile);
  //     } else {
  //       console.error("🚨 لم يتم تحديد صورة بشكل صحيح!");
  //       return;
  //     }

  //     // ✅ طباعة جميع البيانات داخل FormData قبل الإرسال
  //     for (let pair of formData.entries()) {
  //       console.log(`📂 ${pair[0]}:`, pair[1]);
  //     }

  //     // ✅ إرسال البيانات إلى السيرفر
  //     const response = await axios.post("/Vehicletype", formData, {
  //       baseURL: "https://backend.wolf-shadow.com/api",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${yourAuthToken || ""}`,
  //       },
  //     });

  //     console.log("🚀 تمت الإضافة بنجاح:", response.data);

  //     setAddFaqOpen(false);
  //     form.resetFields();
  //   } catch (error) {
  //     console.error("❌ خطأ أثناء الإضافة:", error.response?.data || error);
  //   }
  // };

  //// edit Faq logic

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

  const addVehicleMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();

      // إضافة القيم النصية إلى FormData
      formData.append("TitleEn", values.titleEn);
      formData.append("TitleAr", values.titleAr);
      formData.append("DescriptionEn", values.descriptionEn);
      formData.append("DescriptionAr", values.descriptionAr);

      // إضافة الصورة إلى FormData إذا كانت موجودة
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
          Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
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

  const addVehicleFunc = (values: any) => {
    console.log("Form Values:", values);
    addVehicleMutation.mutate(values);
  };

  const editVehicleMutation = useMutation({
    mutationFn: (values: any) => {
      const formData = new FormData();
      formData.append("Id", values.Id);
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

      if (
        values.Image &&
        values.Image.length > 0 &&
        values.Image[0].originFileObj
      ) {
        formData.append("Image", values.Image[0].originFileObj);
      }

      return axios.put(`/Home/slider`, formData, {
        baseURL: "https://backend.wolf-shadow.com/api",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${yourAuthToken || ""}`,
        },
      });
    },
    onSuccess: (res) => {
      setEditFaqOpen(false);
      refetch();
      message.success(res?.data?.message, 3);
      form.resetFields();
    },
    onError: (err) => {
      message.error(err.message);
    },
  });

  // ✅ استدعاء التعديل عند الضغط على حفظ
  const editVehicleFunc = (values: any) => {
    const updatedValues = { ...values, Id: faqId.id }; // إضافة `faqId` إلى البيانات
    editVehicleMutation.mutate(updatedValues);
  };

  /// delete faq logic

  const deleteFaqMutation = useMutation({
    mutationFn: () => axios["delete"](`Home/slider?id=${faqId}`),
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
      <AddFaqModal
        open={addFaqOpen}
        cancel={() => {
          setAddFaqOpen(false);
          form.resetFields();
        }}
        ok={addVehicleFunc}
        form={form}
        loading={addVehicleMutation.isPending}
      />
      <EditVehicleModal
        open={editFaqOpen}
        cancel={() => setEditFaqOpen(false)}
        form={form}
        ok={editVehicleFunc}
        loading={editVehicleMutation.isPending}
        data={faqId}
      />
      <DeleteFaqModal
        open={deleteFaqOpen}
        cancel={() => setDeleteFaqOpen(false)}
        ok={deleteFaqFunc}
        loading={deleteFaqMutation.isPending}
      />
    </>
  );
};

export default Slider;

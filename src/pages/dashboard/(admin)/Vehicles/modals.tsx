import React, { useEffect, useState, useRef } from "react";

import { Input, Form, Modal, Button, Dropdown, Select, Upload } from "antd";
import type { FormInstance } from "antd/es/form";
import { UploadOutlined } from "@ant-design/icons";

import { FormattedMessage } from "react-intl";
export interface DataType {
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  // id: number;

  name: string;
  id: number;
  nameAr: string;
  Image?: string;

  Name: string;
  Id: number;
  NameAr: string;
  imageUrl?: string;
  // faqId: number;
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
// type Props = {
//    setValue: SetState<string>;
//  };

type Props = {
  open: boolean;
  // setOpen: SetState<boolean>;
  cancel: (e: React.MouseEvent<HTMLButtonElement>) => void;
  //cancel: () => void;
  ok: (values: any) => void;
  data?: DataType;
  form?: FormInstance;
  loading: boolean;
};
{
  /***********edit Faq modal********* */
}
export const EditVehicleModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
  data, // بيانات المركبة الحالية
}) => {
  const [fileList, setFileList] = useState<any[]>(() =>
    data?.Image ? [{ url: data.Image }] : []
  );

  useEffect(() => {
    console.log(data);
    if (data && open) {
      form.setFieldsValue({
        Id: data?.id,
        Name: data?.name,
        NameAr: data?.nameAr,
        Image: data?.imageUrl ? [{ url: data.imageUrl }] : [],
      });
    }
  }, [open, data, form]);

  const handleChange = ({ fileList }: any) => {
    setFileList(Array.isArray(fileList) ? fileList : []);
  };

  return (
    <Modal
      title={
        <p className="text-[18px]">
          <FormattedMessage id="edit-faq" />
        </p>
      }
      open={open}
      onCancel={cancel}
      footer={null}
    >
      <Form layout="vertical" form={form} initialValues={data} onFinish={ok}>
        <Form.Item
          label={<FormattedMessage id="name" />}
          name="Name"
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="nameAr" />}
          name="NameAr"
          rules={[{ required: true }]}
        >
          <Input size="large" />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="image" />}
          name="Image"
          valuePropName="fileList"
          getValueFromEvent={(e) => e.fileList}
        >
          <Upload
            beforeUpload={() => false}
            onChange={handleChange}
            listType="picture"
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>اختر صورة</Button>
          </Upload>
        </Form.Item>
        <Form.Item className="flex justify-end">
          <Button
            size="large"
            className="modals-cancel-btn me-1"
            onClick={cancel}
          >
            <FormattedMessage id="cancel" />
          </Button>
          <Button
            size="large"
            className="modals-confirm-btn bg-primary text-white ms-1"
            htmlType="submit"
            loading={loading}
          >
            <FormattedMessage id="edit" />
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

{
  /*******add faq modal******** */
}
// mitsubshi;
// متسوبيشي
export const AddFaqModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const handleChange = ({ fileList }: any) => {
    console.log("📂 قائمة الملفات المرفوعة:", fileList);

    setFileList(fileList);
  };

  return (
    <>
      {/** add FAQ** */}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-faq" />
          </p>
        }
        open={open}
        // onOk={() => {
        //   setIsAddFaqOpen(false);
        //   form.resetFields();
        // }}
        onCancel={cancel}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFieldsChange={(changedFields, allFields) => {}}
          onFinish={ok}

          // autoComplete="off"
        >
          <div
            className="my-8 px-2 py-1 
           
            "
          >
            <Form.Item
              label={<FormattedMessage id="name" />}
              name="Name"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="question-arabic-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="question-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="question-max-100-char" />,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="nameAr" />}
              name="NameAr"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="question-english-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="question-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="question-max-100-char" />,
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="image" />}
              name="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
            >
              <Upload
                // fileList={fileList}
                beforeUpload={() => false} // منع الرفع التلقائي
                onChange={handleChange}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>اختر صورة</Button>
              </Upload>
            </Form.Item>
          </div>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-4">
            <Button
              // type="primary"

              size="large"
              className="modals-cancel-btn min-w-[65px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={cancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              // type="primary"

              size="large"
              className="modals-confirm-btn text-white min-w-[65px] ms-1 bg-primary hover:bg-primary inline-block"
              htmlType="submit"
              loading={loading}
            >
              <FormattedMessage id="add" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

{
  /******delete modal****** */
}
export const DeleteFaqModal: React.FC<Props> = ({
  open,
  cancel,
  ok,

  loading,
}) => {
  return (
    <>
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="delete-faq" />
          </p>
        }
        open={open}
        onCancel={cancel}
        footer={
          <>
            <div className="flex justify-end items-center">
              <Button
                className="cursor-pointer py-2 px-3 b text-black shadow-md mx-2 rounded-md border-none"
                onClick={cancel}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                className="cursor-pointer py-2 px-3 bg-red-700 text-white hover:!bg-red-700 hover:!text-white  mx-2 rounded-md border-none"
                onClick={ok}
                loading={loading}
              >
                <FormattedMessage id="delete" />
              </Button>
            </div>
          </>
        }
      >
        <p className="text-[16px] py-8">
          {<FormattedMessage id="sure-delete-faq" />}
        </p>
      </Modal>
    </>
  );
};

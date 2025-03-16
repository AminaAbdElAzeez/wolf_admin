import React, { useEffect, useState, useRef } from "react";

import { Input, Form, Modal, Button, Dropdown, Select, Upload } from "antd";
import type { FormInstance } from "antd/es/form";
import { UploadOutlined } from "@ant-design/icons";

import { FormattedMessage, useIntl } from "react-intl";
export interface DataType {
  id: number;
  Image?: string;
  Id: number;
  imageUrl?: string;
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
  /***********edit Logo modal********* */
}
export const EditLogoModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
  data,
}) => {
  const [fileList, setFileList] = useState<any[]>(() =>
    data?.Image ? [{ url: data.Image }] : []
  );

  useEffect(() => {
    // console.log(data);
    if (data && open) {
      form.setFieldsValue({
        Id: data?.id,
        Image: data?.imageUrl ? [{ url: data.imageUrl }] : [],
      });
    }
  }, [open, data, form]);

  const handleChange = ({ fileList }: any) => {
    setFileList(Array.isArray(fileList) ? fileList : []);
  };

  const intl = useIntl();

  return (
    <Modal
      title={
        <p className="text-[18px]">
          <FormattedMessage id="edit-modal" />
        </p>
      }
      open={open}
      onCancel={cancel}
      footer={null}
    >
      <Form layout="vertical" form={form} initialValues={data} onFinish={ok}>
        <div className="my-5 px-0">
          <Form.Item
            // label={<FormattedMessage id="image" />}
            name="Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            className="pt-3"
          >
            <Upload
              beforeUpload={() => false}
              onChange={handleChange}
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} className="mb-2">
                <FormattedMessage id="select-img" />
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-0">
            <Button
              type="primary"
              size="large"
              className="modals-cancel-btn min-w-[65px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={cancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              type="primary"
              size="large"
              className="modals-confirm-btn text-white min-w-[65px] ms-1 bg-primary hover:bg-primary inline-block"
              htmlType="submit"
              loading={loading}
            >
              <FormattedMessage id="edit" />
            </Button>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

{
  /*******add Logo modal******** */
}

export const AddLogoModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const handleChange = ({ fileList }: any) => {
    console.log(fileList);

    setFileList(fileList);
  };
  const intl = useIntl();

  return (
    <>
      {/** add Vehicles** */}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-logo" />
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
            className="my-5 px-0  
           
            "
          >
            <Form.Item
              // label={<FormattedMessage id="image" />}
              name="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => e.fileList}
              className="pt-3"
            >
              <Upload
                // fileList={fileList}
                beforeUpload={() => false}
                onChange={handleChange}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />} className="mb-2">
                  <FormattedMessage id="select-img" />
                </Button>
              </Upload>
            </Form.Item>
          </div>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-0">
            <Button
              type="primary"
              size="large"
              className="modals-cancel-btn min-w-[65px] me-1 text-black inline-block hover:text-black hover:border-black"
              onClick={cancel}
            >
              <FormattedMessage id="cancel" />
            </Button>
            <Button
              type="primary"
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
export const DeleteLogoModal: React.FC<Props> = ({
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
            <FormattedMessage id="delete-Logo" />
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
        <p className="text-[16px] my-2 px-0 ">
          {<FormattedMessage id="sure-delete-logo" />}
        </p>
      </Modal>
    </>
  );
};

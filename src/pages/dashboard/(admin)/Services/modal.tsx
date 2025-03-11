import React, { useEffect, useState, useRef } from "react";

import { Input, Form, Modal, Button, Dropdown, Select } from "antd";
import type { FormInstance } from "antd/es/form";

import { FormattedMessage, useIntl } from "react-intl";
export interface DataType {
  name: string;
  id: number;
  nameAr: string;
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
  /***********edit Service modal********* */
}
export const EditServiceModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  data,
  form,
  loading,
}) => {
  const intl = useIntl();

  return (
    <>
      {/** edit Services** */}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="edit-Service" />
          </p>
        }
        open={open}
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
          <div className="my-5 px-0 ">
            <Form.Item
              label={<FormattedMessage id="name" />}
              name="name"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-english-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: "nameMsgEn" })}
              />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="nameAr" />}
              name="nameAr"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-arabic-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: "nameMsgAr" })}
              />
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
              <FormattedMessage id="edit" />
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

{
  /*******add Service modal******** */
}

export const AddServiceModal: React.FC<Props> = ({
  open,
  cancel,
  ok,
  form,
  loading,
}) => {
  const intl = useIntl();

  return (
    <>
      {/** add Service** */}
      <Modal
        title={
          <p className="text-[18px]">
            <FormattedMessage id="add-Service" />
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
          <div className="my-5 px-0 ">
            <Form.Item
              label={<FormattedMessage id="name" />}
              name="name"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-english-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: "nameMsgEn" })}
              />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="nameAr" />}
              name="nameAr"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="name-arabic-required" />,
                },
                {
                  min: 2,
                  message: <FormattedMessage id="name-min-2-char" />,
                },
                {
                  max: 100,
                  message: <FormattedMessage id="name-max-100-char" />,
                },
              ]}
            >
              <Input
                size="large"
                placeholder={intl.formatMessage({ id: "nameMsgAr" })}
              />
            </Form.Item>
          </div>
          <Form.Item className="modals-btns update-user-modal-btns flex justify-end items-center sticky bottom-0 bg-white z-[1000] pt-4">
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
export const DeleteServiceModal: React.FC<Props> = ({
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
            <FormattedMessage id="delete-service" />
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
          {<FormattedMessage id="sure-delete-service" />}
        </p>
      </Modal>
    </>
  );
};

import React from "react";
import { Layout, Avatar, Badge, Dropdown, MenuProps, Button } from "antd";
import { BellOutlined, DownCircleOutlined } from "@ant-design/icons";
import TobBarLanguage from "components/TobBarLanguage";
import { FormattedMessage } from "react-intl";

const { Header } = Layout;

function TopBar() {
  const menuItems: MenuProps["items"] = [
    { key: "1", label: <FormattedMessage id="personalProfile" /> },
    { key: "2", label: <FormattedMessage id="setting" /> },
    { key: "3", label: <FormattedMessage id="logout" /> },
  ];

  return (
    <Header className="bg-[#F7F7F7] shadow-md py-2 w-full flex justify-between items-center mb-8 rounded-lg px-0">
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
        className="mx-3"
      >
        <Button
          type="text"
          className="flex items-center gap-4 cursor-pointer bg-transparent max-w-max h-auto"
        >
          <Avatar
            src="/Mask.png"
            size={48}
            className="border border-gray-300 shadow-sm"
          />
          <div className="text-right ltr:text-left">
            <p className="text-[#404040] font-semibold text-base leading-6">
              <FormattedMessage id="user.name" />
            </p>
            <p className="text-[#565656] text-sm">
              <FormattedMessage id="user.subTitle" />
            </p>
          </div>
          <DownCircleOutlined className="text-[18px] text-[#929191] font-[600]" />
        </Button>
      </Dropdown>

      <div className="flex items-center gap-5 mx-3">
        <Badge count={6} offset={[-3, 3]}>
          <BellOutlined className="text-gray-600 text-xl cursor-pointer" />
        </Badge>
        <TobBarLanguage />
      </div>
    </Header>
  );
}

export default TopBar;

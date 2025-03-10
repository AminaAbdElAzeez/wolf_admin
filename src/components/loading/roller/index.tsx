import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { useEffect } from "react";
function RollerLoading() {
  return (
    <div className="flex flex-col items-center justify-center fixed top-0 left-0 h-[100vh] w-[100vw]">
      <div className="drop-shadow-xl ">
        <img
          loading="eager"
          width={48}
          height={48}
          className="w-14 h-auto"
          src="/logo.png"
          alt="proffer dashboard"
        />
      </div>
      <Spin size="large" className="text-[#ed1c24] mt-5" />
    </div>
  );
}

export default RollerLoading;

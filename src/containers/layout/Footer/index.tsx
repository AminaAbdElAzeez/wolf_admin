import { Footer as AntdFooter } from "antd/es/layout/layout";

function Footer() {
  return (
    <AntdFooter
      dir="ltr"
      className=" py-1 bg-transparent h-[45px] flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis text-[#374957] text-[14px] font-[400] bg-[#D6E1F5] "
    >
      Copyright © {new Date().getFullYear()}
      <span className="inline-flex gap-1 ms-1">
        {" "}
        By{" "}
        <a
          className="text-[#ed1c24] hover:text-main-red"
          rel="noopener noreferrer"
          target="_blank"
          href="https://www.appssquare.sa"
        >
          {" "}
          Apps Square.
        </a>{" "}
        All rights reserved.
      </span>
    </AntdFooter>
  );
}

export default Footer;

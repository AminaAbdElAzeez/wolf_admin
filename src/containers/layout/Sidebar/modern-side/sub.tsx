import ScrollerRenderView from "components/scroller-render-view";
import MyMenu from "../menu";
import { motion } from "framer-motion";
import { theme } from "antd";
import { Link } from "react-router-dom";

function SubSide({
  width,
  collapsed,
  variantsSubSide,
}: {
  width: ISIdeWidth;
  collapsed: boolean;
  variantsSubSide: any;
}) {
  const { token } = theme.useToken();

  return (
    <motion.div
      variants={variantsSubSide}
      style={{
        backgroundColor: token.colorBgContainer,
        width: width.sub,
      }}
      className={` ltr:pl-16 rtl:pr-16  box-border inset-y-0  border-r-2 border-indigo-100 shadow-md  ltr:rounded-tr-[24px] ltr:rounded-br-3xl rtl:rounded-tl-[24px] rtl:rounded-bl-3xl`}
    >
      <div className="sideLogo flex items-center justify-center flex-shrink-0 ltr:rounded-tr-[24px] rtl:rounded-tl-[24px]">
        <Link
          to={"/"}
          target="_blank"
          className="sideLogo ltr:rounded-tr-[50px] ltr:rounded-br-[50px] rtl:rounded-tl-[24px] rtl:rounded-bl-[24px] block w-[100%] h-full p-8 text-center"
        >
          <img
            className="w-[120px] h-auto"
            src="/logo.png"
            width={152}
            height={39}
            alt="outlet plus admin"
          />
        </Link>
      </div>
      <ScrollerRenderView
        className={`!h-[calc(100dvh_-_153px_-_13px)]  sm:!h-[calc(100dvh_-_153px)]`}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
      >
        <div className="px-2">
          <MyMenu collapsed={collapsed} />
        </div>
      </ScrollerRenderView>
    </motion.div>
  );
}

export default SubSide;

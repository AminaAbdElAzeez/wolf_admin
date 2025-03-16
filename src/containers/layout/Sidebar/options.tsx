import { FormattedMessage } from "react-intl";
import { IoLogoSlack, IoSettingsSharp } from "react-icons/io5";
import { FaCodeBranch, FaDatabase } from "react-icons/fa";
import { BiCategoryAlt } from "react-icons/bi";
import { MdLocationCity } from "react-icons/md";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { GiModernCity } from "react-icons/gi";
import { RiListUnordered } from "react-icons/ri";
import { MdOutlineFormatListNumbered, MdReportProblem } from "react-icons/md";
import { FaPrescriptionBottle } from "react-icons/fa";
import { PiFlagBannerFoldBold } from "react-icons/pi";
import { FaQuestionCircle } from "react-icons/fa";
import { RiCoupon4Line } from "react-icons/ri";
import { BiSolidContact } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { MdLocalOffer } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { BiShapeSquare } from "react-icons/bi";
import { ImTree } from "react-icons/im";
import { RiFootballFill } from "react-icons/ri";
import { MdOutlineGridOn } from "react-icons/md";
import { AiFillDatabase } from "react-icons/ai";
import { FaCrown, FaSliders } from "react-icons/fa6";
import { FaChartPie } from "react-icons/fa";
import { TbChartHistogram } from "react-icons/tb";
import { TbPokerChip } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { FaHandHoldingHeart } from "react-icons/fa";
import { ImTarget } from "react-icons/im";
import { RiDoorLockFill } from "react-icons/ri";
import { PiPulseFill } from "react-icons/pi";
import { RiCustomerServiceFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa6";
import { IoMdContact } from "react-icons/io";

// Registrations

interface MenuItem {
  key: string;
  to?: string;
  icon?: any;
  label: any;
  onClick?: () => void;
  hidden?: boolean;
  disabled?: boolean;
  children?: MenuItem[];
}
// const getMenuItems: (profile: any) => MenuItem[] = (profile) => {
const getMenuItems: () => MenuItem[] = () => {
  //console.log("profileData",profile?.roles[0])
  //const role = profile?.roles[0].roleName;

  return [
    {
      key: "branches",
      to: "branches",
      label: <FormattedMessage id="branches" />,
      icon: <FaCodeBranch className="!text-xl" />,
      disabled: false,
      //hidden: false,
    },

    {
      key: "services",
      to: "services",
      label: <FormattedMessage id="services" />,
      icon: <RiCustomerServiceFill className="!text-xl" />,
      disabled: false,
      //hidden: false,
    },
    {
      key: "vehicles",
      to: "vehicles",
      label: <FormattedMessage id="vehicles" />,
      icon: <FaCar className="!text-xl" />,
      disabled: false,
    },
    {
      key: "slider",
      to: "slider",
      label: <FormattedMessage id="slider" />,
      icon: <FaSliders className="!text-xl" />,
      disabled: false,
    },
    {
      key: "logo",
      to: "logo",
      label: <FormattedMessage id="logo" />,
      icon: <IoLogoSlack className="!text-xl" />,
      disabled: false,
    },
    {
      key: "service-form",
      to: "service-form",
      label: <FormattedMessage id="service-form" />,
      icon: <FaDatabase className="!text-xl" />,
      disabled: false,
    },
    {
      key: "contact-form",
      to: "contact-form",
      label: <FormattedMessage id="contact-form" />,
      icon: <IoMdContact className="!text-xl" />,
      disabled: false,
    },
  ];
};
export default getMenuItems;

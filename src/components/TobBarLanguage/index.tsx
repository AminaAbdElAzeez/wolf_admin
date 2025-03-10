import { Dropdown, MenuProps, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import LanguageSwitcherActions from "store/languageSwitcher/actions";
import { getCurrentLanguage } from "store/languageSwitcher/config";
import flagEn from "../../assets/flagEn.png";
import flagAr from "../../assets/flagAr.png";
import { DownOutlined } from "@ant-design/icons";

const { changeLanguage } = LanguageSwitcherActions;

const TobBarLanguage = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(
    ({ LanguageSwitcher }) => LanguageSwitcher.language
  );

  const languages = [
    { languageId: "english", text: "English", flag: flagEn },
    { languageId: "arabic", text: "العربية", flag: flagAr },
  ];

  const currentLanguage = getCurrentLanguage(selectedLanguage.languageId);

  return (
    <Dropdown
      menu={{
        items: languages.map(({ languageId, text, flag }) => ({
          key: languageId,
          label: (
            <div
              className="flex items-center gap-2"
              onClick={() => dispatch(changeLanguage(languageId))}
            >
              <img src={flag} alt={text} className="w-6 h-4 rounded-sm" />
              <span>{text}</span>
            </div>
          ),
        })),
      }}
      trigger={["click"]}
    >
      <Button
        type="text"
        className="flex items-center gap-2 bg-transparent ltr:flex-row-reverse"
      >
        <DownOutlined />
        <span className="text-gray-700 font-medium">
          {currentLanguage.text}
        </span>
        <img
          src={currentLanguage.languageId === "english" ? flagEn : flagAr}
          alt={currentLanguage.text}
          className="w-6 h-4 rounded-sm"
        />
      </Button>
    </Dropdown>
  );
};

export default TobBarLanguage;

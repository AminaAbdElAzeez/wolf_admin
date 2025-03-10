import {
  Button,
  Form,
  Input,
  Checkbox,
  Layout,
  theme,
  Dropdown,
  Space,
  MenuProps,
  message,
  Card,
} from "antd";
import { useState } from "react";
import LangSwitcher from "containers/layout/Topbar/LangSwitcher";
import ThemesSwitcher from "containers/layout/Topbar/ThemesSwitcher";
import authAction from "store/auth/actions";
import { useDispatch } from "react-redux";
import middleware from "utlis/navigation/mw";
import { useSelector } from "react-redux";
import { LoggedUserCanNotOpen } from "middlewares";
import axios from "utlis/library/helpers/axios";
import { toast } from "react-hot-toast";
import { FormattedMessage } from "react-intl";
import { Typography } from "antd";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { permissionsTransform } from "utlis/library/helpers/permissions";
import { useForm } from "antd/lib/form/Form";
import SmallLogo from "components/LogoWraper/small-logo";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { PhoneNumberUtil } from "google-libphonenumber";
import profileActions from "store/profile/actions";

const { Title } = Typography;

const { login } = authAction;
const { fetchProfileDataSuccess } = profileActions;
const phoneUtil = PhoneNumberUtil.getInstance();

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );

  //   const onFinish = (values: any) => {
  //   setLoading(true);
  //   const myPromise = axios["post"]("/login", values);

  //   // toast.promise(
  //   //   myPromise,
  //   //   {
  //   //     loading: (
  //   //       <div className="min-w-[200px]">
  //   //         {locale === "ar" ? "جاري المعالجة " : "Pending"}
  //   //       </div>
  //   //     ),
  //   //     success: (res) => {
  //   //       setLoading(false);

  //   //       return "Backend Message Error Occured";
  //   //     },
  //   //     error: (err) => {
  //   //       setLoading(false);
  //   //       return err.response?.data?.message || "Backend Error Occured";
  //   //     },
  //   //   },
  //   //   {
  //   //     style: {
  //   //       minWidth: "250px",
  //   //     },
  //   //     success: {
  //   //       duration: 3000,
  //   //       icon: "🔥",
  //   //     },
  //   //   }
  //   // );
  // };

  const [form] = useForm();
  console.log(locale);

  const mutation = useMutation({
    mutationFn: (values) =>
      axios["post"]("/Auth/login", values, {
        headers: {
          "Accept-Language": `${locale === "en" ? "en-US" : "ar-SA"}`,
        },
      }),
    onSuccess: (res) => {
      // const token =
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbiIsInN1YiI6ImZmYjhmMGQ5LTU2ODgtNGI4OC0yYTIwLTA4ZGQ1MDJmMWQwOSIsImp0aSI6ImIyZGYyNWVlLTA1MGEtNGEyNy04Mzc0LWU5YzRjNmY1MDY1ZSIsImV4cCI6MTc0MDAzNDMxOSwiaXNzIjoiV29sZlNoYWRvd0lzc3VlciIsImF1ZCI6IldvbGZTaGFkb3dVc2VyIn0.bNDD2cieJYMZZbqBRfZlqgePbMCtz0GOL7qVWv_Fqrg";

      // const decoded = JSON.parse(atob(token.split(".")[1]));
      // console.log(decoded);

      const token = res.data;
      dispatch(login(token));
      localStorage.setItem("token", token.data);
      dispatch(fetchProfileDataSuccess(token));

      // data.isVerified = true; // toClear
      // data.isActivated = true; // toClear
      // data.isApproved = true; // toClear
      // if (data?.permissions) {
      //   data.permissions = permissionsTransform(data.permissions);
      // }
      // dispatch(fetchProfileDataSuccess(data));
      // Invalidate and refetch
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (err) => {
      const {
        status,
        data: { message },
      } = (err as any).response;

      toast.error(message, {
        position: "top-center",
        duration: 5000,
      });
    },
  });
  const onFinish = (values: any) => {
    mutation.mutate(values);
  };
  return (
    <div className="bg-texture-light dark:bg-texture-dark">
      <div className="box-border absolute inset-x-0 top-0 w-full flex items-center justify-between container mx-auto py-5 px-2">
        <div className="brightness-90 flex items-center text-[#3730a3] no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
          <Link to={"/"}>
            <img
              className="w-20 h-auto"
              src="/logo.png"
              width={52}
              height={73}
              alt="outlet plus-admin"
            />
          </Link>{" "}
        </div>
        <ul className="flex gap-3 items-center">
          <li className="isoUser flex">
            <LangSwitcher />
          </li>
          {/* <li className="isoUser">
            <ThemesSwitcher />
          </li> */}
        </ul>
      </div>

      <div className="login min-h-[100dvh] box-border  flex items-center justify-center px-3 sm:px-6 py-8 mx-auto lg:py-0 w-[466px]">
        <motion.div
          initial={{ y: -150, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="w-full max-w-2xl"
        >
          <Card className="rounded-lg shadow-md md:mt-0 ">
            <Title className=" font-bold tracking-tight text-[18px]">
              <FormattedMessage id="signin.signToYourAccount" />
            </Title>
            <p className="mb-4 text-[#606060] text-[14px] font-[400]">
              <FormattedMessage id="signin.signToYourAccountDesc"></FormattedMessage>
            </p>
            <Form
              layout="vertical"
              form={form}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label={<FormattedMessage id="email" />}
                name="email"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="email" />,
                  },
                  {
                    type: "email",
                    message: <FormattedMessage id="invalid-email" />,
                  },
                ]}
              >
                <Input size="large" />
              </Form.Item>
              <Form.Item
                label={<FormattedMessage id="password" />}
                name="password"
                rules={[
                  {
                    required: true,
                    message: <FormattedMessage id="password" />,
                  },
                ]}
              >
                <Input.Password size="large" />
              </Form.Item>
              <div className="flex justify-between mb-5">
                <Form.Item
                  className="mb-0"
                  name="remember"
                  valuePropName="checked"
                >
                  <Checkbox>
                    <FormattedMessage id="page.signInRememberMe" />
                  </Checkbox>
                </Form.Item>
              </div>
              <Form.Item>
                <Button
                  size="large"
                  className="w-full text-white bg-[#ED1C24] hover:bg-[#ED1C24]"
                  htmlType="submit"
                  loading={mutation.isPending}
                >
                  <FormattedMessage id="page.signInButton" />
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default middleware(Login, [LoggedUserCanNotOpen]);

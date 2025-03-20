import ErrorBoundaryProvider from "utlis/library/helpers/error-handler/ErrorBoundaryProvider";
import FallBackUI from "components/fallback-ui";
import { ConfigProvider, theme as antdTheme } from "antd";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "store/store";
import AppLocale from "utlis/config/translation";
import { IntlProvider } from "react-intl";
import { useEffect, useLayoutEffect } from "react";
import ToastProvider from "components/ToastProvider/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
//import axios from "axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import themeSwitcherActions from "store/themeSwitcher/actions";
import instance from "utlis/library/helpers/axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layout";
import Index from "./pages/page";
import Login from "./pages/login/page";
import DashboardLayout from "./pages/dashboard/(admin)/layout";
import Services from "./pages/dashboard/(admin)/Services/page";
import Vehicles from "./pages/dashboard/(admin)/Vehicles/page";
import Branches from "./pages/dashboard/(admin)/branches/page";
import Slider from "./pages/dashboard/(admin)/slider/page";
import ServiceForm from "./pages/dashboard/(admin)/serviceForm/page";
import ContactForm from "./pages/dashboard/(admin)/contactForm/page";
import Logo from "./pages/dashboard/(admin)/logo/page";
import Statistics from "./pages/dashboard/(admin)/statistics/page";

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Index />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "admin",
        element: <DashboardLayout />,
        children: [
          {
            path: "branches",
            element: <Branches />,
          },
          {
            path: "services",
            element: <Services />,
          },
          {
            path: "vehicles",
            element: <Vehicles />,
          },
          {
            path: "slider",
            element: <Slider />,
          },
          {
            path: "logo",
            element: <Logo />,
          },
          {
            path: "service-form",
            element: <ServiceForm />,
          },
          {
            path: "contact-form",
            element: <ContactForm />,
          },
          {
            path: "statistics",
            element: <Statistics />,
          },
        ],
      },
    ],
  },
]);

const { changeTheme } = themeSwitcherActions;
type Locale = keyof typeof AppLocale;
const queryClient = new QueryClient();

function AppProvider() {
  const dispatch = useDispatch();
  const { locale } = useSelector(
    ({ LanguageSwitcher }: { LanguageSwitcher: ILanguageSwitcher }) =>
      LanguageSwitcher.language
  );
  const { themeName, isDark } = useSelector(
    ({ ThemeSwitcher }: { ThemeSwitcher: ISelectedTheme }) => ThemeSwitcher
  );

  const reChangeTheme = () => {
    dispatch(changeTheme("system"));
  };

  const dir = locale === "ar" ? "rtl" : "ltr";
  const currentAppLocale = AppLocale[locale as Locale];
  useLayoutEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
    instance.defaults.headers.common["Accept-Language"] =
      locale === "ar" ? "ar-EG" : "en-US";
    instance.defaults.headers.common["X-Language"] =
      locale === "ar" ? "ar" : "en";
  }, [locale, dir]);
  useEffect(() => {
    const darkModePreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    if (themeName === "system") {
      darkModePreference.addEventListener("change", reChangeTheme);
    }
    return () => {
      if (themeName === "system") {
        darkModePreference.removeEventListener("change", reChangeTheme);
      }
    };
  }, [themeName]);

  useLayoutEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);
  useEffect(() => {
    instance.defaults.headers["Accept-Language"] = `${
      locale === "en" ? "en-US" : "ar-SA"
    }`;
    instance.defaults.headers["X-Language"] = `${
      locale === "en" ? "en-US" : "ar-SA"
    }`;
  }, [locale]);

  // useEffect(()=>{
  // instance.interceptors.request.use((config) => {
  //   config.headers['Accept-Language'] = `${locale === "en"?"en-US":"ar-SA"}`;
  //   console.log("Intercepted request config:",locale, config);
  //   return config;
  // });
  //  },[locale])

  return (
    <ErrorBoundaryProvider fallBackUIComponent={<FallBackUI />}>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <ConfigProvider
          locale={currentAppLocale.antd}
          direction={dir}
          theme={{
            algorithm: antdTheme[isDark ? "darkAlgorithm" : "defaultAlgorithm"],
            token: {
              colorPrimary: "#ed1c24",
              // colorPrimaryBg: "#3730a3",
              // colorBorder: "#3730a3",

              colorLink: "#ed1c24",
              colorInfo: "#ed1c24",
            },
          }}
        >
          {/* <RoutersProvider /> */}
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />

            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
          <ToastProvider />
        </ConfigProvider>
      </IntlProvider>
    </ErrorBoundaryProvider>
  );
}
function MainProvider() {
  return (
    <Provider store={store}>
      <AppProvider />
    </Provider>
  );
}

export default MainProvider;

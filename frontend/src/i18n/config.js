import deDE from "antd/lib/locale/de_DE";
import esES from "antd/lib/locale/es_ES";
import zhCN from "antd/lib/locale/zh_CN";
import "moment/locale/de";
import "moment/locale/es";
import "moment/locale/zh-cn";

export const DEFAULT_LOCALE = "en-US";
export const AVAILABLE_LOCALES = ["en-US", "zh-CN", "de-DE", "es-ES"];

export const localeMap = {
  "en-US": {
    antd: undefined,
    moment: "en",
  },
  "zh-CN": {
    antd: zhCN,
    moment: "zh-cn",
  },
  "de-DE": {
    antd: deDE,
    moment: "de",
  },
  "es-ES": {
    antd: esES,
    moment: "es",
  },
};

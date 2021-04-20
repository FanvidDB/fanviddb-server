import React, { useContext } from "react";
import { Radio } from "antd";
import { LocaleContext } from "./LocalizationProvider";

const LocaleSelector = () => {
  const { locale, setLocale } = useContext(LocaleContext);
  return (
    <div style={{float: "left"}}>
      <Radio.Group value={locale} onChange={(e) => setLocale(e.target.value)}>
        <Radio.Button key="en-US" value="en-US">
          English
        </Radio.Button>
        <Radio.Button key="zh-CN" value="zh-CN">
          中文
        </Radio.Button>
      </Radio.Group>
    </div>
  );
};

export default LocaleSelector;

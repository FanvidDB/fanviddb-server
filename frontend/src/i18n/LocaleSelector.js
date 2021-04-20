import React, { useContext } from "react";
import { Select } from "antd";
import { LocaleContext } from "./LocalizationProvider";

const { Option } = Select;

const LocaleSelector = () => {
  const { locale, setLocale } = useContext(LocaleContext);
  return (
    <Select
      style={{ width: 100 }}
      defaultValue={locale}
      onChange={(value) => setLocale(value)}
    >
      <Option value="en-US">English</Option>
      <Option value="zh-CN">中文</Option>
    </Select>
  );
};

export default LocaleSelector;

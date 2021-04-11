import React from "react";
import { Radio } from "antd";
import PropTypes from "prop-types";

const LocaleSelector = (props) => {
  return (
    <div>
      <Radio.Group value={props.locale} onChange={props.onChange}>
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

LocaleSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  locale: PropTypes.string,
};

export default LocaleSelector;

import React from "react";
import { Radio } from "antd";
import PropTypes from "prop-types";

const DEFAULT_LOCALE = "en-US";

class LocaleSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: DEFAULT_LOCALE,
    };
  }

  render() {
    return (
      <div>
        <Radio.Group value={this.props.locale} onChange={this.props.onChange}>
          <Radio.Button key="en-US" value="en-US">
            English
          </Radio.Button>
          <Radio.Button key="zh-CN" value="zh-CN">
            中文
          </Radio.Button>
        </Radio.Group>
      </div>
    );
  }
}

LocaleSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  locale: PropTypes.string,
};

export default LocaleSelector;

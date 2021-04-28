import React from "react";
import { DatePicker as AntdDatePicker } from "antd";
import PropTypes from "prop-types";
import moment from "moment";

const DatePicker = ({ value, id, onChange }) => {
  const handleChange = (newValue) => {
    // newValue is null if DatePicker was cleared.
    if (newValue === null) {
      onChange(null);
    } else {
      onChange(newValue.format("YYYY-MM-DD"));
    }
  };
  const childValue = value ? moment(value, "YYYY-MM-DD") : value;
  return <AntdDatePicker value={childValue} onChange={handleChange} id={id} />;
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export default DatePicker;

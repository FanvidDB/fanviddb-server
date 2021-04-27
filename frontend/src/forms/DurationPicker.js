import React from "react";
import { TimePicker } from "antd";
import PropTypes from "prop-types";
import moment from "moment";

const DurationPicker = ({ value = 0, id, onChange }) => {
  const handleChange = (newValue) => {
    const seconds = newValue.minutes() * 60 + newValue.seconds();
    onChange(seconds);
  };
  return (
    <TimePicker
      value={moment.utc(value * 1000)}
      onChange={handleChange}
      format={"mm:ss"}
      showNow={false}
      id={id}
    />
  );
};

DurationPicker.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export default DurationPicker;

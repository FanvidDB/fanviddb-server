import React from "react";
import { Input, Select } from "antd";
import PropTypes from "prop-types";

const { Option } = Select;

const UniqueIdentifierInput = ({ value = "", onChange }) => {
  const [type, id] = value.split(":");

  const onTypeChange = (newType) => {
    onChange([newType, id].join(":"));
  };
  const onIdChange = (e) => {
    onChange([type, e.target.value].join(":"));
  };

  return (
    <Input.Group compact style={{ display: "inline-block", width: "200%" }}>
      <Select value={type} onChange={onTypeChange}>
        <Option value="filename">filename</Option>
        <Option value="youtube">youtube ID</Option>
        <Option value="vimeo">vimeo ID</Option>
        <Option value="ao3">ao3 ID</Option>
      </Select>
      <Input value={id} style={{ width: "50%" }} onChange={onIdChange} />
    </Input.Group>
  );
};

UniqueIdentifierInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default UniqueIdentifierInput;

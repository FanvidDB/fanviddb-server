import React from "react";
import { Input, Select } from "antd";
import { Localized } from "@fluent/react";
import PropTypes from "prop-types";

const { Option } = Select;

const UniqueIdentifierInput = ({ value = {}, id, onChange }) => {
  const onKindChange = (kind) => {
    onChange({ identifier: value.identifier, kind });
  };
  const onIdentifierChange = (e) => {
    onChange({ kind: value.kind, identifier: e.target.value });
  };

  return (
    <Input.Group compact style={{ display: "inline-block" }}>
      <Select value={value.kind} onChange={onKindChange}>
        <Option value="filename">
          <Localized id="unique-identifier-filename" />
        </Option>
        <Option value="youtube">
          <Localized id="unique-identifier-youtube" />
        </Option>
        <Option value="vimeo">
          <Localized id="unique-identifier-vimeo" />
        </Option>
        <Option value="ao3">
          <Localized id="unique-identifier-ao3" />
        </Option>
        <Option value="bilibili">
          <Localized id="unique-identifier-bilibili" />
        </Option>
        <Option value="other">
          <Localized id="unique-identifier-other" />
        </Option>
      </Select>
      <Input
        value={value.identifier}
        style={{ width: "50%" }}
        id={id}
        onChange={onIdentifierChange}
      />
    </Input.Group>
  );
};

UniqueIdentifierInput.propTypes = {
  id: PropTypes.string,
  value: PropTypes.shape({
    kind: PropTypes.string,
    identifier: PropTypes.string,
  }),
  onChange: PropTypes.func,
};

export default UniqueIdentifierInput;

import React from "react";
import { Space, Button, Input, Form } from "antd";
import PropTypes from "prop-types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { List, Item, ErrorList } = Form;

const FormList = ({ label, name, defaultValue, inputComponent, ...props }) => {
  if (!inputComponent) {
    inputComponent = <Input style={{ width: "200%" }} />;
  }
  return (
    <>
      <label htmlFor={name + "_0"}>{label}</label>
      <List name={name} {...props}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field) => (
              <Item
                required={false}
                key={field.key}
                style={{ marginBottom: "2px" }}
              >
                <Space align="center" style={{ width: "100%" }}>
                  <MinusCircleOutlined onClick={() => remove(field.name)} />
                  <Item
                    {...field}
                    key={field.key}
                    noStyle
                    style={{ width: "100%" }}
                  >
                    {inputComponent}
                  </Item>
                </Space>
              </Item>
            ))}
            <Item>
              <Button onClick={() => add(defaultValue)} icon={<PlusOutlined />}>
                Add
              </Button>
              <ErrorList errors={errors} />
            </Item>
          </>
        )}
      </List>
    </>
  );
};

FormList.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  inputComponent: PropTypes.node,
  defaultValue: PropTypes.any,
};

export default FormList;

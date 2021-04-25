import React from "react";
import { Button, Input, Form } from "antd";
import PropTypes from "prop-types";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { List, Item, ErrorList } = Form;

const FormList = ({ label, name, ...props }) => {
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
                <Item {...field} key={field.key} noStyle>
                  <Input style={{ width: "60%", marginRight: "8px" }} />
                </Item>
                <MinusCircleOutlined onClick={() => remove(field.name)} />
              </Item>
            ))}
            <Item>
              <Button onClick={() => add()} icon={<PlusOutlined />}>
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
  label: PropTypes.string.isRequired,
};

export default FormList;

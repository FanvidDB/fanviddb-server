import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import { Form, Button } from "antd";
import { act } from 'react-dom/test-utils';

import DatePicker from "./DatePicker";

const TestForm = () => {
  const [date, setDate] = useState("2021-01-01");
  const handleFinish = ({ date }) => {
    setDate(date);
  };
  return (
    <Form onFinish={handleFinish}>
      <Form.Item label="Date" name="date" initialValue={"2021-01-01"}>
        <DatePicker />
      </Form.Item>
      <div data-testid="date">{date}</div>
      <Button type="submit">Submit</Button>
    </Form>
  );
};

describe("DatePicker", () => {
  test.each([
    ["2020-01-01", "2020-01-01"],
    ["1910-07-23", "1910-07-23"],
  ])("renders initial value %s as %s", (initialValue, expected) => {
    const { getByLabelText } = render(
      <Form>
        <Form.Item label="Date" name="date" initialValue={initialValue}>
          <DatePicker />
        </Form.Item>
      </Form>
    );
    const input = getByLabelText("Date");
    expect(input.value).toBe(expected);
  });

  test.each([
    ["2020-01-23", "2020-01-23"],
    ["1910-07-23", "1910-07-23"],
  ])("converts picker value %s to output %s", async (pickerValue, expected) => {
    const { getByRole, getByLabelText, getByText, findByTestId } = render(
      <TestForm />
    );
    const input = getByLabelText("Date");
    act(() => {
      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: pickerValue } });
    })

    const date = getByText("23");
    act(() => {
      fireEvent.click(date);
    })

    const submitButton = getByRole("button", { name: "Submit" });
    act(() => {
      fireEvent.submit(submitButton);
    })

    const output = await findByTestId("date");
    expect(output).toHaveTextContent(expected);
  });
});

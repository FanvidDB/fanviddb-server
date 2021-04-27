import React, { useState } from "react";
import { render, fireEvent } from "@testing-library/react";
import DurationPicker from "./DurationPicker";
import { Form, Button } from "antd";

describe("DurationPicker", () => {
  test.each([
    [0, "00:00"],
    [5, "00:05"],
    [63, "01:03"],
    [59 * 60 + 59, "59:59"],
    [61 * 60 + 1, "01:01"],
  ])("renders initial value %i as %s", (initialValue, expected) => {
    const { getByLabelText } = render(
      <Form>
        <Form.Item label="Label" name="length" initialValue={initialValue}>
          <DurationPicker />
        </Form.Item>
      </Form>
    );
    const input = getByLabelText("Label");
    expect(input.value).toBe(expected);
  });

  test.each([
    ["00:05", 5],
    ["01:03", 63],
    ["59:59", 59 * 60 + 59],
  ])(
    "converts picker value %s to %i seconds",
    async (pickerValue, expected) => {
      const TestForm = () => {
        const [length, setLength] = useState(0);
        const handleFinish = ({ length }) => {
          setLength(length);
        };
        return (
          <Form onFinish={handleFinish}>
            <Form.Item label="Label" name="length" initialValue={0}>
              <DurationPicker />
            </Form.Item>
            <div data-testid="length">{length}</div>
            <Button type="submit">Submit</Button>
          </Form>
        );
      };
      const { getByRole, getByLabelText, findByTestId } = render(<TestForm />);
      const input = getByLabelText("Label");
      fireEvent.mouseDown(input);
      fireEvent.change(input, { target: { value: pickerValue } });
      const button = getByRole("button", { name: "Ok" });
      fireEvent.click(button);

      const submitButton = getByRole("button", { name: "Submit" });
      fireEvent.submit(submitButton);

      const output = await findByTestId("length");
      expect(output).toHaveTextContent(expected);
    }
  );
});

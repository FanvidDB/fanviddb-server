import { callApi } from "./api";

beforeEach(() => {
  fetch.resetMocks();
});

describe("callApi", () => {
  it.each([
    { type: "JSON", content: { key: "value" }, status: 200 },
    { type: "JSON", content: { key: "value" }, status: 400 },
    { type: "JSON", content: { key: "value" }, status: 500 },
    { type: "text", content: "value", status: 200 },
    { type: "text", content: "value", status: 400 },
    { type: "text", content: "value", status: 500 },
    { type: "empty", content: "", status: 200 },
    { type: "empty", content: "", status: 400 },
    { type: "empty", content: "", status: 500 },
  ])(
    "handles GET request with $status $type response",
    async ({ type, content, status }) => {
      fetch.mockResponseOnce(
        type == "JSON" ? JSON.stringify(content) : content,
        { status: status }
      );

      const method = "GET";
      const url = "http://google.com";

      const response = await callApi(url, method);
      expect(fetch.mock.calls.length).toEqual(1);
      expect(fetch.mock.calls[0][0]).toEqual(url);
      expect(fetch.mock.calls[0][1]).toEqual({ method });
      expect(response.status).toBe(status);
      expect(response.ok).toBe(status == 200 ? true : false);
      if (type == "JSON") {
        expect(response.json).toEqual(content);
        expect(response.text).toBe(null);
      } else {
        expect(response.json).toBe(null);
        expect(response.text).toEqual(content);
      }
    }
  );
});

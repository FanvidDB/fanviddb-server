export async function callApi(
  url,
  method,
  bodyObject,
  contentType = "application/json"
) {
  const fetchOpts = { method };
  if (bodyObject) {
    if (contentType == "application/json") {
      fetchOpts.body = JSON.stringify(bodyObject);
    } else if (contentType == "application/x-www-form-urlencoded") {
      fetchOpts.body = new URLSearchParams(bodyObject);
    }
  }
  const response = await fetch(url, fetchOpts);
  const responseJson = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    json: responseJson,
  };
}

export async function callApi(url, method, bodyObject) {
  const fetchOpts = { method };
  if (bodyObject) {
    fetchOpts.body = JSON.stringify(bodyObject);
  }
  const response = await fetch(url, fetchOpts);
  const responseJson = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    json: responseJson,
  };
}

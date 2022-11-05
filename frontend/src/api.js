export async function callApi(
  url: string,
  method: string,
  bodyObject: {},
  contentType: string = "application/json"
): { status: string, ok: boolean, json: null | {}, text: null | string } {
  const fetchOpts = { method };
  if (bodyObject) {
    fetchOpts.headers = {
      "Content-Type": contentType,
    };
    if (contentType == "application/json") {
      fetchOpts.body = JSON.stringify(bodyObject);
    } else if (contentType == "application/x-www-form-urlencoded") {
      fetchOpts.body = new URLSearchParams(bodyObject);
    } else {
      fetchOpts.body = bodyObject;
    }
  }
  const response = await fetch(url, fetchOpts);
  let responseText = await response.text();
  let responseJson = null;
  try {
    responseJson = JSON.parse(responseText);
    responseText = null;
  } catch {
    // if it's not parseable, leave the response as text.
  }

  return {
    status: response.status,
    ok: response.ok,
    json: responseJson,
    text: responseText,
  };
}

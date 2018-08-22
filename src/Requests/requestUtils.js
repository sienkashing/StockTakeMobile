// @flow
import axios, { CancelToken } from "axios";

export async function fetchDataApi(endpoint: string) {
  const source = CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 5000);

  try {
    const response = await axios.get(endpoint, { cancelToken: source.token });

    return [null, response];
  } catch (e) {
    let errorMessage = e.toString();
    if (["Cancel", "Network Error"].includes(errorMessage)) {
      errorMessage = "Operation Timed Out";
    }
    return [errorMessage];
  }
}

export async function postDataApi(endpoint: string, data: any) {
  const source = CancelToken.source();
  setTimeout(() => {
    source.cancel();
  }, 5000);

  try {
    const response = await axios.post(endpoint, data, { cancelToken: source.token });
    return [null, response.data];
  } catch (e) {
    return `Error from requestUtils: ${e}`;
  }
}

import ROOT_URL from "./GlobalConfig";
import { DetailSchema } from "../models";
import { postDataApi } from "./requestUtils";
import { realmQueryObjects } from "../utils/RealmDBUtils";

export default async function uploadData(reckey: number) {
  try {
    const query = "iva2_reckey = $0";
    const [err, qryResults] = realmQueryObjects(DetailSchema, null, query, reckey);
    if (err) {
      throw new Error("Realm DB Error");
    }
    const [requestError, response] = await postDataApi(`${ROOT_URL}/updatedocs`, qryResults);
    if (requestError) {
      throw new Error("postDataApi error");
    }
    return [null, response];
  } catch (e) {
    return `Error from UploadData ${e}`;
  }
}

// @flow
import { realmQueryObjects } from "../utils/RealmDBUtils";
import DetailSchema from "../models/DetailSchema";

export default class DetailDAO {
  static getItemDetail(reckey: string, skuno: string, objMapper?: Object): [?Object, ?Object] {
    const [err, data] = realmQueryObjects(
      DetailSchema,
      objMapper,
      "iva2_reckey = $0 AND smas_skuno = $1",
      reckey,
      skuno
    );

    return [err, data[0]];
  }
}

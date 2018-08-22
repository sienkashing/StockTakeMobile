// @flow

import { realmQueryObjects } from "../utils/RealmDBUtils";
import { SnapshotSchema } from "../models";
import { DetailDAO } from ".";
import { mapToNewObjectFromValues } from "../utils/ObjectMapperUtil";

export default class SnapshotDAO {
  static getSnapshotList(
    reckey: number,
    filterText?: string,
    objMapping: ?Object
  ): [?Object, Array<Object>] {
    const query = "iva2_reckey = $0 AND "
      + "(smas_skuno CONTAINS[c] $1 OR smas_altno CONTAINS[c] $1 or "
      + "smas_sdesc CONTAINS[c] $1 or smas_ldesc CONTAINS[c] $1)";
    const [err, skuSearchList] = realmQueryObjects(
      SnapshotSchema,
      objMapping,
      query,
      reckey,
      filterText
    );
    return [err, skuSearchList];
  }

  static getItemSnapshot(reckey: number, skuno: string, objMapping: ?Object): [?Object, ?Object] {
    const [err, data] = realmQueryObjects(
      SnapshotSchema,
      objMapping,
      "iva2_reckey = $0 and (smas_skuno = $1 or smas_altno = $1)",
      reckey,
      skuno
    );

    return [err, data[0]];
  }

  static getItemSnapshotWithCount(
    reckey: number,
    skuno: string,
    objMapping: ?Object
  ): [?Object, ?Object] {
    const [errSnapshot, itemSnapShot] = this.getItemSnapshot(reckey, skuno, null);

    if (errSnapshot) {
      return [errSnapshot, null];
    }

    let data: { "Count Qty"?: number } = {};

    if (objMapping && itemSnapShot) {
      data = mapToNewObjectFromValues(objMapping, itemSnapShot);
    }

    if (data && itemSnapShot) {
      let countQty = 0;
      const [errDetail, detail] = DetailDAO.getItemDetail(
        itemSnapShot["iva2_reckey"],
        itemSnapShot["smas_skuno"]
      );
      if (errDetail) {
        return [errDetail, null];
      }

      if (detail) {
        countQty = detail["iva2_pcqty"];
      }

      data["Count Qty"] = countQty;
    }

    return [null, data];
  }
}

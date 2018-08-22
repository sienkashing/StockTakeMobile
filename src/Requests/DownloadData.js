import Realm from "realm";
import getServerAddress from "./GlobalConfig";
import { HeaderSchema, SnapshotSchema } from "../models";
import { fetchDataApi } from "./requestUtils";

export default async function downloadData() {
  try {
    const [errLoadSettings, serverAddress] = getServerAddress();

    if (errLoadSettings) {
      throw errLoadSettings;
    }
    const [err, response] = await fetchDataApi(`${serverAddress}/pscdocs`);

    if (err) {
      throw new Error(`Unable to connect to server ${serverAddress}. ${err}`);
    }

    const realm = new Realm({ schema: [HeaderSchema, SnapshotSchema] });
    realm.write(() => {
      realm.delete(realm.objects("Header"));
      realm.delete(realm.objects("Snapshot"));
      response.data.header.forEach((element) => {
        realm.create("Header", {
          iva1_reckey: element.iva1_reckey,
          iva1_docno: element.iva1_docno,
          iva1_date: element.iva1_date,
          stor_name: element.stor_name
        });
      });
      response.data.details.forEach((element) => {
        realm.create("Snapshot", {
          iva2_reckey: element.iva2_reckey,
          smas_pluno: element.smas_pluno,
          smas_skuno: element.smas_skuno,
          smas_altno: element.smas_altno,
          smas_sdesc: element.smas_sdesc,
          smas_ldesc: element.smas_ldesc,
          iva2_ohqty: element.iva2_ohqty,
          iva2_remark: element.iva2_remark
        });
      });
    });
    realm.close();
    return null;
  } catch (e) {
    return e.message;
  }
}

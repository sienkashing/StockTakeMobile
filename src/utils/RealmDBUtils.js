// @flow

import Realm from "realm";
import { mapToNewObjectFromValues } from "./ObjectMapperUtil";

export type queryResultType = [?Object, Array<Object>];
export function realmQueryObjects(
  schema: Object,
  mappingSchema: ?Object,
  query: ?string,
  ...params: Array<any>
): queryResultType {
  const realm = new Realm({ schema: [schema], deleteRealmIfMigrationNeeded: true });
  try {
    let res = realm.objects(schema["name"]);

    if (query) {
      res = res.filtered(query, ...params);
    }

    const data = [];
    const objMapping = {};

    if (!mappingSchema) {
      Object.keys(schema["properties"]).forEach((key) => {
        objMapping[key] = { from: key };
      });
    }

    res.forEach((element) => {
      data.push(mapToNewObjectFromValues(!mappingSchema ? objMapping : mappingSchema, element));
    });

    realm.close();
    return [null, data];
  } catch (e) {
    realm.close();
    return [e, []];
  }
}

export function realmWriteObject(schema: Object, properties: Object) {
  const realm = new Realm({ schema: [schema] });
  try {
    realm.write(() => {
      realm.create(schema["name"], properties, true);
    });
    realm.close();
    return null;
  } catch (e) {
    realm.close();
    return e;
  }
}

export function realmClearAndWriteObjects(schema: Object, properties: Array<Object>) {
  const realm = new Realm({ schema: [schema] });
  try {
    realm.write(() => {
      const allData = realm.objects(schema.name);
      realm.delete(allData);
      properties.forEach((entry) => {
        realm.create(schema.name, entry);
      });
    });
    realm.close();
    return null;
  } catch (e) {
    realm.close();
    return e;
  }
}

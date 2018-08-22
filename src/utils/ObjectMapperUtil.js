// @flow

/*
This utility library returns new object based on the method and mapping schema used.
Below is an example usage of both functions:

mappingSchema = {
    newKey: "oldKey"
}

Obj1 = {
    oldKey: "This should be mapped to a new key"
}

newObject = mapToNewObjectFromValues(mappingSchema, Obj1);

newObject = {
    newKey: "This should be mapped to a new key"
}

newObject2 = mapToNewObjectFromKeys(mappingSchema, newObject);

newObject2 = {
    oldKey = "This should be mapped to a new key"
}
*/

// This return a new object with new keys based but mapped to values of the fromObject
export function mapToNewObjectFromValues(mappingSchema: Object, fromObject: Object) {
  const newObject = {};
  Object.keys(mappingSchema).forEach((key) => {
    const fieldInfo = mappingSchema[key];
    newObject[key] = fieldInfo["func"]
      ? fieldInfo["func"](fromObject[fieldInfo["from"]])
      : fromObject[fieldInfo["from"]];
  });
  return newObject;
}

export function mapToNewObjectFromKeys(mappingSchema: Object, fromObject: Object) {
  const newObject = {};
  Object.keys(mappingSchema).forEach((key) => {
    const fieldInfo = mappingSchema[key];
    newObject[fieldInfo["from"]] = fromObject[key];
  });
  return newObject;
}

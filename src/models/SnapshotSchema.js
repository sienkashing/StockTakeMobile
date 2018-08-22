// @flow
const SnapshotSchema = {
  name: "Snapshot",
  properties: {
    iva2_reckey: "int",
    smas_pluno: { type: "string", indexed: true },
    smas_skuno: { type: "string", indexed: true },
    smas_altno: { type: "string", indexed: true },
    smas_sdesc: "string",
    smas_ldesc: "string",
    iva2_ohqty: "double",
    iva2_remark: "string?"
  }
};

export default SnapshotSchema;

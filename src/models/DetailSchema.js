const DetailSchema = {
  name: "Detail",
  primaryKey: "rec_skuno_key", // primary key necessary for when realm updates to database
  properties: {
    rec_skuno_key: "string",
    iva2_reckey: { type: "int", indexed: true },
    smas_skuno: { type: "string", indexed: true },
    smas_altno: { type: "string", indexed: true },
    smas_sdesc: { type: "string?", indexed: true },
    smas_ldesc: { type: "string?", indexed: true },
    iva2_ohqty: "double",
    iva2_pcqty: "double",
    iva2_remark: "string?"
  }
};

export default DetailSchema;

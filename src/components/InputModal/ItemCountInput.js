// @flow

import React, { Component } from "react";
import { DocumentInfo, ErrorToast } from "../index";
import { mapToNewObjectFromKeys } from "../../utils/ObjectMapperUtil";
import { realmWriteObject } from "../../utils/RealmDBUtils";
import { DetailSchema } from "../../models";
import ModalInputDlg from "./ModalInputDlg";

const mappingSchema = {
  Reckey: { from: "iva2_reckey" },
  "Plu No": { from: "smas_pluno" },
  "Sku No": { from: "smas_skuno" },
  "Alt No": { from: "smas_altno" },
  SDesc: { from: "smas_sdesc" },
  Description: { from: "smas_ldesc" },
  "Oh Qty": { from: "iva2_ohqty" }
};

type Prop = {
  item: Object,
  toggleModal: Function,
  visible: boolean,
  refreshCallback: Function,
  ignoreFields?: Array<string>,
  showStatusCallback?: Function
};
type State = {
  itemCount: string
};
export default class ItemCountInput extends Component<Prop, State> {
  state = { itemCount: "" };

  addFoundItem = () => {
    const {
      toggleModal, item, refreshCallback, showStatusCallback
    } = this.props;
    const { itemCount } = this.state;

    const countQty = !itemCount ? Number(item["Count Qty"]) : Number(itemCount);
    const properties = {
      ...mapToNewObjectFromKeys(mappingSchema, item),
      rec_skuno_key: `${item["Reckey"]}_${item["Sku No"]}`,
      iva2_pcqty: countQty
    };
    const err = realmWriteObject(DetailSchema, properties);

    if (err) {
      ErrorToast(err.message);
    } else {
      refreshCallback();
    }

    if (showStatusCallback) {
      showStatusCallback(true, `${countQty} of "${item["Description"]}" counted.`);
    }
    toggleModal(false);
  };

  handleCountInput = (itemCount: string) => {
    this.setState({ itemCount: !itemCount ? "0" : itemCount.replace(/^0+/, "") });
  };

  render() {
    const {
      item, toggleModal, visible, ignoreFields
    } = this.props;
    const { itemCount } = this.state;
    return (
      <ModalInputDlg
        visible={visible}
        toggleModal={toggleModal}
        confirmBtnProps={{ action: this.addFoundItem }}
      >
        <DocumentInfo
          data={item}
          editable
          editFields={[
            {
              name: "Count Qty",
              props: {
                keyboardType: "numeric",
                onChangeText: this.handleCountInput
              },
              value: !itemCount ? String(item["Count Qty"]) : itemCount
            }
          ]}
          containerStyle={{ borderWidth: 0 }}
          ignoreFields={ignoreFields}
        />
      </ModalInputDlg>
    );
  }
}

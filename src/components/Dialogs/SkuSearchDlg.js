import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import { SearchDlg, ErrorToast, ItemCountInput } from "../index";
import SnapshotDAO from "../../DAO/SnapshotDAO";

type Props = {
  reckey: number,
  hideModal: Function,
  refreshCallback: Function
};
type State = {
  inputModalShow: boolean,
  selectedItem: Object,
  skuSearchList: Array<Object>,
  ignoreFields: Array<string>,
  showAddedStatus: boolean,
  statusMessage: string
};

export default class SkuSearchDlg extends PureComponent<Props, State> {
  state = {
    inputModalShow: false,
    selectedItem: {},
    skuSearchList: [],
    ignoreFields: ["Reckey", "Plu No", "SDesc"],
    showAddedStatus: false,
    statusMessage: ""
  };

  componentWillUnmount() {
    if (this.timerHandle) {
      clearTimeout(this.timerHandle);
      this.timerHandle = 0;
    }
  }

  onSKUSearch = (filterText?: string) => {
    const { reckey } = this.props;

    const mappingSchema = {
      reckey: { from: "iva2_reckey" },
      Skuno: { from: "smas_skuno" },
      Altno: { from: "smas_altno" },
      Description: { from: "smas_ldesc" }
    };

    const [err, skuSearchList] = SnapshotDAO.getSnapshotList(reckey, filterText, mappingSchema);

    if (err) {
      ErrorToast(`Cannot load snapshot: ${err.message}`);
    }

    this.setState({ skuSearchList });
  };

  loadSelectedItem = (item: Object) => {
    const mappingSchema = {
      Reckey: { from: "iva2_reckey" },
      "Plu No": { from: "smas_pluno" },
      "Sku No": { from: "smas_skuno" },
      "Alt No": { from: "smas_altno" },
      SDesc: { from: "smas_sdesc" },
      Description: { from: "smas_ldesc" },
      "Oh Qty": { from: "iva2_ohqty" }
    };

    const [err, selectedItem] = SnapshotDAO.getItemSnapshotWithCount(
      item["reckey"],
      item["Skuno"],
      mappingSchema
    );

    if (err) {
      ErrorToast(err.message);
    }
    this.setState({ inputModalShow: true, selectedItem });
  };

  toggleModal = (inputModalShow: boolean) => {
    this.setState({ inputModalShow });
  };

  toggleAddedStatus = (showAddedStatus: boolean, statusMessage = "") => {
    this.setState({ showAddedStatus, statusMessage });

    this.timerHandle = setTimeout(() => {
      this.setState({ showAddedStatus: false });
      this.timerHandle = 0;
    }, 3000);
  };

  renderSearchView() {
    const { hideModal } = this.props;
    const { skuSearchList, ignoreFields } = this.state;
    return (
      <SearchDlg
        hideModal={hideModal}
        data={skuSearchList}
        onChangeText={this.onSKUSearch}
        ignoreFields={ignoreFields}
        onSelectItem={this.loadSelectedItem}
      />
    );
  }

  renderInputModalShow = () => {
    const { refreshCallback } = this.props;
    const { inputModalShow, selectedItem, ignoreFields } = this.state;
    return (
      <ItemCountInput
        visible={inputModalShow}
        item={selectedItem}
        toggleModal={this.toggleModal}
        refreshCallback={refreshCallback}
        ignoreFields={ignoreFields}
        showStatusCallback={this.toggleAddedStatus}
      />
    );
  };

  renderAddedStatus = () => {
    const { showAddedStatus, statusMessage } = this.state;

    if (showAddedStatus) {
      return (
        <View style={{ padding: 5, backgroundColor: "green" }}>
          <Text style={{ color: "white", fontSize: 16 }}>
            {statusMessage}
          </Text>
        </View>
      );
    }
    return null;
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderAddedStatus()}
        {this.renderSearchView()}
        {this.renderInputModalShow()}
      </View>
    );
  }
}

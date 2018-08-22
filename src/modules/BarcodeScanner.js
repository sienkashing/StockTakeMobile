// @flow
import React, { Component } from "react";
import {
  View, StyleSheet, Alert, Modal
} from "react-native";
import { Card, Button } from "react-native-elements";
import { Toast } from "native-base";
import { RNCamera } from "react-native-camera";
import type { NavigationScreenProp, NavigationStateRoute } from "react-navigation";
import { mapToNewObjectFromKeys } from "../utils/ObjectMapperUtil";
import { realmWriteObject } from "../utils/RealmDBUtils";
import { DocumentInfo, ErrorToast, IconLabel } from "../components";
import { SnapshotDAO } from "../DAO";
import { DetailSchema } from "../models";

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: "space-between"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

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
  navigation: NavigationScreenProp<NavigationStateRoute>
};
type State = {
  scannedItem: Object,
  scanning: boolean,
  modalVisible: boolean,
  statusMessage?: string
};
export default class BarcodeScan extends Component<Prop, State> {
  state = {
    scannedItem: {},
    scanning: true,
    modalVisible: false
  };

  onBarCodeRead = (e: Object) => {
    const { scanning } = this.state;

    this.setState({ scanning: false });
    if (scanning) {
      const item = this.getItemSnapshot(e.data);
      if (item) {
        this.setState({
          scannedItem: item,
          modalVisible: true
        });
      } else {
        Alert.alert("Whoops!", "This item cannot be found.");
      }
    }
  };

  getItemSnapshot(scannedCode: string) {
    const { navigation } = this.props;
    const reckey = navigation.getParam("reckey", "");

    const [errSnapshot, itemSnapShot] = SnapshotDAO.getItemSnapshotWithCount(
      reckey,
      scannedCode,
      mappingSchema
    );

    if (errSnapshot) {
      ErrorToast(errSnapshot.message);
      return null;
    }

    return itemSnapShot;
  }

  toggleScan = () => {
    const { scanning } = this.state;
    this.setState({
      scanning: !scanning
    });
  };

  hideModal = () => {
    this.setState({ modalVisible: false });
  };

  addFoundItem = () => {
    const { navigation } = this.props;
    const { scannedItem } = this.state;

    const properties = {
      ...mapToNewObjectFromKeys(mappingSchema, scannedItem),
      rec_skuno_key: `${scannedItem["Reckey"]}_${scannedItem["Sku No"]}`,
      iva2_pcqty: Number(scannedItem["Count Qty"])
    };
    const err = realmWriteObject(DetailSchema, properties);

    if (err) {
      ErrorToast(err.message);
    } else {
      navigation.getParam("refreshDetail")();
      Toast.show({
        text: `${scannedItem["Count Qty"]} of "${scannedItem["Description"]}" counted.`,
        buttonText: "Okay",
        duration: 5000,
        position: "top",
        type: "success"
      });
    }
    this.hideModal();
  };

  handleCountInput = (text: string) => {
    const { scannedItem } = this.state;
    scannedItem["Count Qty"] = Number(text);
    this.setState({ scannedItem });
  };

  renderHeader() {
    const { navigation } = this.props;
    return (
      <IconLabel
        iconName="arrow-back"
        icon={{ color: "white" }}
        labelText="Back"
        labelStyle={{ color: "white" }}
        containerStyle={{
          backgroundColor: "#00000000",
          padding: 10
        }}
        onPress={() => navigation.goBack()}
      />
    );
  }

  renderModal() {
    const { modalVisible, scannedItem } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => {
          this.hideModal();
        }}
      >
        <View style={styles.modalContainer}>
          <Card containerStyle={{ borderRadius: 5, padding: 0, width: 325 }}>
            <DocumentInfo
              data={scannedItem}
              ignoreFields={["Reckey", "Plu No", "SDesc"]}
              editable
              editFields={[
                {
                  name: "Count Qty",
                  props: {
                    keyboardType: "numeric",
                    onChangeText: this.handleCountInput
                  },
                  value: String(scannedItem["Count Qty"])
                }
              ]}
              containerStyle={{ borderWidth: 0 }}
            />
            <View
              style={{
                justifyContent: "flex-end",
                flexDirection: "row",
                marginBottom: 10
              }}
            >
              <Button
                title="Cancel"
                onPress={() => {
                  this.hideModal();
                }}
                borderRadius={5}
                containerViewStyle={{ width: 100, marginRight: 10, marginLeft: 0 }}
              />
              <Button
                title="Add Item"
                onPress={() => {
                  this.addFoundItem();
                }}
                borderRadius={5}
                backgroundColor="green"
                containerViewStyle={{ width: 100, marginRight: 15, marginLeft: 0 }}
              />
            </View>
          </Card>
        </View>
      </Modal>
    );
  }

  renderBarcodeScanner() {
    const { scanning } = this.state;

    return (
      <RNCamera style={styles.preview} onBarCodeRead={this.onBarCodeRead}>
        {this.renderHeader()}
        <Button
          onPress={this.toggleScan}
          borderRadius={5}
          containerViewStyle={{ borderWidth: 1, borderColor: "white", marginBottom: 30 }}
          backgroundColor={scanning ? "green" : "grey"}
          title={scanning ? "Scanning" : "Not Scanning"}
        />
      </RNCamera>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderBarcodeScanner()}
        {this.renderModal()}
      </View>
    );
  }
}

// @flow

import React, { Component } from "react";
import {
  FlatList, ScrollView, View, Text, Modal, Alert
} from "react-native";
import { Header, Card, SearchBar } from "react-native-elements";
import type { NavigationScreenProp, NavigationStateRoute } from "react-navigation";
import { Transition } from "react-navigation-fluid-transitions";
import { realmQueryObjects } from "../utils/RealmDBUtils";
import { DetailSchema, SnapshotSchema } from "../models";
import { DocumentInfo, IconLabel, SkuSearchDlg } from "../components";
import uploadData from "../Requests/UploadData";
import colors from "../components/Colors";

type Props = {
  navigation: NavigationScreenProp<NavigationStateRoute>
};
type State = {
  headerData: Object,
  error: string,
  details: Array<Object>,
  showSearchDlg: boolean,
  skuSearchList: Array<Object>
};
export default class DocumentDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { navigation } = this.props;
    this.state = {
      headerData: navigation.getParam("data"),
      error: "",
      details: [],
      showSearchDlg: false,
      skuSearchList: []
    };
  }

  componentDidMount() {
    this.loadDetails();
  }

  toggleSearchDlg = (bShow: boolean) => {
    this.setState({ showSearchDlg: bShow });
  };

  loadDetails = (filterText?: string) => {
    const { navigation } = this.props;
    const data = navigation.getParam("data", {});

    const mappingSchema = {
      Skuno: { from: "smas_skuno" },
      Description: { from: "smas_ldesc" },
      "On Hand Qty": { from: "iva2_ohqty" },
      "Count Qty": { from: "iva2_pcqty" }
    };

    let query = "iva2_reckey = $0";
    if (filterText) {
      query = `${query} AND (smas_skuno CONTAINS[c] $1 `
        + `OR smas_altno CONTAINS[c] $1 `
        + `OR smas_sdesc CONTAINS[c] $1 `
        + `OR smas_ldesc CONTAINS[c] $1)`;
    }

    const [err, details] = realmQueryObjects(
      DetailSchema,
      mappingSchema,
      query,
      data["Rec No"],
      filterText
    );

    if (err) {
      this.setState({ error: err.message });
    } else {
      this.setState({ error: "", details });
    }
  };

  loadSnapshot = () => {
    const mappingSchema = {
      Skuno: { from: "smas_skuno" },
      Altno: { from: "smas_altno" },
      Description: { from: "smas_ldesc" }
    };

    const [err, snapshot] = realmQueryObjects(SnapshotSchema, mappingSchema);

    if (err) {
      this.setState({ error: `Cannot load snapshot: ${err.message}` });
      return [];
    }

    return snapshot;
  };

  uploadDocument = () => {
    const { headerData } = this.state;
    uploadData(headerData["Rec No"]).then(([err]) => {
      if (err) {
        Alert.alert("Error", JSON.stringify(err));
      }
    });
  };

  renderNavHeader() {
    const { navigation } = this.props;
    return (
      <Header
        leftComponent={{
          icon: "arrow-left",
          type: "material-community",
          color: "white",
          onPress: () => navigation.goBack()
        }}
        centerComponent={{
          text: "Document Details",
          style: {
            color: "white",
            fontSize: 18,
            fontWeight: "bold"
          }
        }}
        outerContainerStyles={{ height: 55 }}
      />
    );
  }

  renderHeaderInfo = () => {
    const { headerData } = this.state;
    return (
      <Transition shared={headerData["Rec No"]}>
        <DocumentInfo
          data={headerData}
          containerStyle={{ borderBottomWidth: 0 }}
          icon={{
            name: "upload",
            type: "Feather",
            onPress: this.uploadDocument,
            style: {
              color: colors.green
            }
          }}
        />
      </Transition>
    );
  };

  renderSearchOptions() {
    const { navigation } = this.props;
    const data = navigation.getParam("data", {});

    return (
      <Card
        containerStyle={{
          height: 50,
          borderWidth: 0,
          elevation: 0,
          margin: 0,
          marginTop: 5,
          paddingTop: 5,
          paddingBottom: 5
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <SearchBar
            onChangeText={text => this.loadDetails(text)}
            containerStyle={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
              backgroundColor: "rgba(0,0,0,0)",
              width: 225
            }}
            inputStyle={{
              margin: 0,
              color: "black",
              backgroundColor: "white",
              borderWidth: 2,
              borderRadius: 30,
              paddingLeft: 30,
              borderColor: colors.primary
            }}
            icon={{ style: { top: 11, left: 10, color: colors.primary } }}
          />
          <IconLabel
            labelText="Add Manually"
            labelStyle={{ color: colors.primary }}
            icon={{
              name: "add",
              type: "MaterialIcons"
            }}
            iconStyle={{ color: colors.primary }}
            onPress={() => this.toggleSearchDlg(true)}
          />
          <IconLabel
            labelText="Barcode Add"
            labelStyle={{ color: colors.primary }}
            icon={{
              name: "barcode-scan",
              type: "MaterialCommunityIcons"
            }}
            iconStyle={{ color: colors.primary }}
            onPress={() => navigation.navigate("BarcodeScanner", {
              reckey: data["Rec No"],
              refreshDetail: this.loadDetails
            })
            }
          />
        </ScrollView>
      </Card>
    );
  }

  renderDetails() {
    const { error, details } = this.state;

    if (error) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text
            style={{
              textAlign: "center"
            }}
          >
            {`There was an error: ${error}`}
          </Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        {details.length !== 0 ? (
          <FlatList
            style={{ marginTop: 5 }}
            data={details}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item }) => (
              <DocumentInfo
                data={item}
                containerStyle={{
                  paddingTop: 5,
                  paddingBottom: 5
                }}
                fieldStyle={{ fontSize: 12 }}
                valueStyle={{ fontSize: 12 }}
                targetStyle={{
                  "Count Qty": {
                    fontSize: 16,
                    color: colors.green
                  },
                  "Count Qty_value": {
                    fontWeight: "bold",
                    fontSize: 16,
                    color: colors.green
                  }
                }}
              />
            )}
          />
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                textAlign: "center"
              }}
            >
              {"No items have been added to this physical count document yet."}
            </Text>
          </View>
        )}
      </View>
    );
  }

  renderSearchDlg = () => {
    const { navigation } = this.props;
    const { showSearchDlg, skuSearchList } = this.state;
    const reckey = navigation.getParam("data")["Rec No"];
    return (
      <Modal
        animationType="fade"
        visible={showSearchDlg}
        onRequestClose={() => this.toggleSearchDlg(false)}
      >
        <SkuSearchDlg
          reckey={reckey}
          hideModal={this.toggleSearchDlg}
          data={skuSearchList}
          refreshCallback={this.loadDetails}
        />
      </Modal>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderNavHeader()}
        {this.renderHeaderInfo()}
        {this.renderSearchOptions()}
        {this.renderDetails()}
        {this.renderSearchDlg()}
      </View>
    );
  }
}

// @flow

import React, { PureComponent } from "react";
import {
  Text, TouchableOpacity, FlatList, View
} from "react-native";
import { Header } from "react-native-elements";
import type { NavigationScreenProp, NavigationStateRoute } from "react-navigation";
import { Transition } from "react-navigation-fluid-transitions";
import moment from "moment";
import { Icon } from "native-base";
import { HeaderSchema } from "../models";
import downloadData from "../Requests/DownloadData";
import { realmQueryObjects } from "../utils/RealmDBUtils";
import { DocumentInfo, ErrorToast, SettingsInput } from "../components";

type Props = {
  navigation: NavigationScreenProp<NavigationStateRoute>
};
type State = {
  refreshing: boolean,
  records: Array<Object>,
  settingsModalShow: boolean
};
export default class DocumentList extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      records: [],
      settingsModalShow: false
    };
  }

  componentDidMount() {
    this.getListData();
  }

  getListData = async () => {
    const mappingSchema = {
      "Rec No": {
        from: "iva1_reckey"
      },
      "Doc No": { from: "iva1_docno" },
      Date: {
        from: "iva1_date",
        func: value => moment(value).format("DD-MM-YYYY")
      },
      Location: { from: "stor_name" }
    };

    const [err, records] = await realmQueryObjects(HeaderSchema, mappingSchema);

    if (err) {
      ErrorToast(err.message);
    } else {
      this.setState({ refreshing: false, records });
    }
  };

  viewDetails = (data: Object) => () => {
    const { navigation } = this.props;
    navigation.navigate("DocumentDetails", { data });
  };

  handleRefresh = () => {
    this.setState({ refreshing: true }, () => {
      downloadData().then((err) => {
        this.setState({ refreshing: false });
        if (!err) {
          this.getListData();
        } else {
          ErrorToast(err);
        }
      });
    });
  };

  toggleModal = (settingsModalShow: boolean) => {
    this.setState({ settingsModalShow });
  };

  renderSettingsInputModal = () => {
    const { settingsModalShow } = this.state;
    return <SettingsInput visible={settingsModalShow} toggleModal={this.toggleModal} />;
  };

  renderListItem = (listItemObject: Object) => {
    const { item } = listItemObject;
    return (
      <Transition shared={item["Rec No"]}>
        <TouchableOpacity onPress={this.viewDetails(item)}>
          <View>
            <DocumentInfo key={item["Rec No"]} data={item} icon={{}} />
          </View>
        </TouchableOpacity>
      </Transition>
    );
  };

  renderEmptyListComponent = () => (
    <View style={{ paddingTop: 100, justifyContent: "center", alignItems: "center" }}>
      <Text>
No documents yet.
      </Text>
      <Icon type="FontAwesome" name="hand-o-up" style={{ paddingTop: 10, paddingBottom: 10 }} />
      <Text style={{ textAlign: "center" }}>
        {"Pull to refresh to download more documents."}
      </Text>
    </View>
  );

  renderHeader = () => (
    <Header
      centerComponent={{
        text: "Document List",
        style: {
          color: "white",
          fontSize: 18,
          fontWeight: "bold"
        }
      }}
      rightComponent={(
        <TouchableOpacity onPress={() => this.toggleModal(true)}>
          <Icon name="md-settings" style={{ color: "white" }} />
        </TouchableOpacity>
)}
      outerContainerStyles={{ height: 55 }}
    />
  );

  renderDocumentList = () => {
    const { refreshing, records } = this.state;
    return (
      <FlatList
        refreshing={refreshing}
        onRefresh={this.handleRefresh}
        data={records}
        keyExtractor={(item, index) => index.toString()}
        renderItem={this.renderListItem}
        ListEmptyComponent={this.renderEmptyListComponent}
      />
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader()}
        {this.renderDocumentList()}
        {this.renderSettingsInputModal()}
      </View>
    );
  }
}

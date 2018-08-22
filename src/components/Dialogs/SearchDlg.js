// @flow

import React, { PureComponent } from "react";
import {
  TextInput, View, Text, FlatList, TouchableOpacity
} from "react-native";
import { Icon } from "react-native-elements";
import { DocumentInfo } from "../index";

type Props = {
  data: Array<Object>,
  hideModal: Function,
  onChangeText: Function,
  onSelectItem: Function,
  ignoreFields?: Array<string>
};
type State = {
  textSearch: string
};
export default class SearchDlg extends PureComponent<Props, State> {
  state = { textSearch: "" };

  loadSelectedItem = (selectedItem: Object) => {
    const { onSelectItem } = this.props;

    onSelectItem(selectedItem);
  };

  renderItem = (listItemObject: Object) => {
    const { onSelectItem, ignoreFields } = this.props;
    const { item } = listItemObject;
    return <SearchListItem item={item} onSelectItem={onSelectItem} ignoreFields={ignoreFields} />;
  };

  render() {
    const { data, onChangeText, hideModal } = this.props;
    const { textSearch } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textAlign: "center",
            margin: 10
          }}
        >
          {"Item Search"}
        </Text>
        <View
          style={{
            height: 50,
            flexDirection: "row",
            elevation: 1,
            margin: 15,
            marginTop: 0,
            borderWidth: 1
          }}
        >
          <Icon
            containerStyle={{ paddingLeft: 10, paddingRight: 10 }}
            name="md-arrow-back"
            type="ionicon"
            onPress={() => hideModal(false)}
          />
          <TextInput
            value={textSearch}
            style={{ flex: 1 }}
            placeholder="Type search here"
            onChangeText={(text) => {
              this.setState({ textSearch: text });
              onChangeText(text);
            }}
          />
          <Icon
            containerStyle={{ paddingRight: 10 }}
            name="close"
            onPress={() => this.setState({ textSearch: "" })}
          />
        </View>
        <View style={{ flex: 1 }}>
          {data.length !== 0 ? (
            <FlatList
              style={{ marginTop: 5 }}
              data={data}
              keyExtractor={(item, index) => String(index)}
              renderItem={this.renderItem}
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
                {textSearch
                  ? "No items matched the search"
                  : "Enter a search term above\nand matching items will be displayed"}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

type ListItemProp = {
  onSelectItem: Function,
  item: Object,
  ignoreFields?: Array<string>
};
class SearchListItem extends PureComponent<ListItemProp> {
  handlePress = () => {
    const { item, onSelectItem } = this.props;
    onSelectItem(item);
  };

  render() {
    const { item, ignoreFields } = this.props;
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <DocumentInfo
          data={item}
          ignoreFields={ignoreFields}
          containerStyle={{
            paddingTop: 5,
            paddingBottom: 5
          }}
          fieldStyle={{ fontSize: 12 }}
          valueStyle={{ fontSize: 12 }}
          targetStyle={{
            "Count Qty": {
              fontSize: 16,
              color: "green"
            },
            "Count Qty_value": {
              fontWeight: "bold",
              fontSize: 16,
              color: "green"
            }
          }}
        />
      </TouchableOpacity>
    );
  }
}

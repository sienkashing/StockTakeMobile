// @flow
import React, { PureComponent } from "react";
import { TouchableOpacity, View, TextInput } from "react-native";
import { Card, Text } from "react-native-elements";
import { Icon } from "native-base";
import StyleSheetPropType from "react-native/Libraries/StyleSheet/StyleSheetPropType";
import _ from "lodash";

const defContainerStyle = {
  margin: 0,
  borderTopWidth: 0,
  elevation: 0
};

type keyboardPropType = {
  onChangeText: Function
};

type EditFieldPropType = {
  name: string,
  value: string,
  props?: keyboardPropType,
  style?: StyleSheetPropType
};

type Props = {
  data: Object,
  icon?: Object,
  containerStyle?: StyleSheetPropType,
  rowStyle?: StyleSheetPropType,
  targetRowStyle?: Object,
  fieldStyle?: StyleSheetPropType,
  valueStyle?: StyleSheetPropType,
  targetStyle?: StyleSheetPropType,
  ignoreFields?: Array<string>,
  editable?: boolean,
  editFields?: Array<EditFieldPropType>
};

export default class DocumentInfo extends PureComponent<Props> {
  renderDataRows() {
    const {
      data,
      rowStyle,
      targetRowStyle,
      fieldStyle,
      valueStyle,
      targetStyle,
      ignoreFields,
      editFields,
      editable
    } = this.props;

    return Object.keys(data).map((key) => {
      const show = !ignoreFields || (ignoreFields && !ignoreFields.includes(key));
      const editField = _.find(editFields, { name: key });

      if (show) {
        return (
          <View
            key={key}
            style={[
              { flexDirection: "row", alignItems: "center" },
              rowStyle,
              targetRowStyle && targetRowStyle[key]
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[{ fontWeight: "bold" }, fieldStyle, targetStyle && targetStyle[key]]}>
                {key}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              {editable && editField ? (
                <TextInput
                  {...editField.props}
                  value={editField.value}
                  style={[
                    {
                      borderWidth: 1,
                      height: 30,
                      paddingLeft: 10,
                      padding: 0,
                      borderRadius: 5,
                      borderColor: "darkgray"
                    },
                    editField.style
                  ]}
                  underlineColorAndroid="white"
                />
              ) : (
                <Text selectable style={[valueStyle, targetStyle && targetStyle[`${key}_value`]]}>
                  {data[key]}
                </Text>
              )}
            </View>
          </View>
        );
      }
      return null;
    });
  }

  renderIcon() {
    const { icon } = this.props;

    if (icon) {
      return <Icon {...icon} />;
    }

    return null;
  }

  render() {
    const { icon, containerStyle } = this.props;

    return (
      <Card containerStyle={[defContainerStyle, containerStyle]}>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            {this.renderDataRows()}
          </View>
          {icon ? (
            <TouchableOpacity onPress={icon.onPress}>
              <View
                style={{
                  flex: 1,
                  width: 30,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {this.renderIcon()}
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </Card>
    );
  }
}

// @flow
import React, { PureComponent } from "react";
import {
  StyleSheet, TouchableOpacity, View, Text
} from "react-native";
import { Icon } from "native-base";
import StyleSheetPropType from "react-native/Libraries/StyleSheet/StyleSheetPropType";

const styles = StyleSheet.create({
  defContainerStyle: {
    flexDirection: "row",
    margin: 5
  },
  defTextStyle: {
    fontSize: 16,
    marginTop: 2
  },
  defIconStyle: {
    paddingRight: 5
  }
});

type Props = {
  labelText: string,
  labelStyle?: StyleSheetPropType,
  icon: Object,
  iconStyle: Object,
  onPress?: Function,
  containerStyle?: StyleSheetPropType
};

export default class IconLabel extends PureComponent<Props> {
  static defaultProps = {
    iconType: "material"
  };

  render() {
    const {
      containerStyle, onPress, icon, iconStyle, labelStyle, labelText
    } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.defContainerStyle, containerStyle]}>
          <Icon {...icon} style={[styles.defIconStyle, iconStyle]} />
          <Text style={[styles.defTextStyle, labelStyle]}>
            {labelText}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

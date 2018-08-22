// @flow

import React, { PureComponent } from "react";
import { Modal, View } from "react-native";
import { Card, Button } from "react-native-elements";
import colors from "../Colors";

export type confirmBtnPropType = {
  action: Function,
  title?: string,
  buttonStyle?: Object,
  containerStyle?: Object
};
type Prop = {
  toggleModal: Function,
  visible: boolean,
  confirmBtnProps: confirmBtnPropType,
  children?: any,
  darkBackground?: boolean,
  title?: string
};
export default class ItemCountInput extends PureComponent<Prop> {
  closeModal = () => {
    const { toggleModal } = this.props;
    toggleModal(false);
  };

  renderActionButtons = () => {
    const { confirmBtnProps } = this.props;
    const {
      title, action, buttonStyle, containerStyle
    } = confirmBtnProps;

    return (
      <View
        style={{
          justifyContent: "flex-end",
          flexDirection: "row",
          marginBottom: 5,
          marginTop: 5
        }}
      >
        <Button
          title="Cancel"
          onPress={this.closeModal}
          borderRadius={5}
          containerViewStyle={{ width: 100, marginRight: 10, marginLeft: 0 }}
        />
        <Button
          title={!title ? "Confirm" : title}
          onPress={action}
          containerViewStyle={[
            {
              width: 100,
              marginRight: 15,
              marginLeft: 0
            },
            containerStyle
          ]}
          buttonStyle={[
            {
              borderRadius: 5,
              backgroundColor: colors.green
            },
            buttonStyle
          ]}
        />
      </View>
    );
  };

  render() {
    const {
      title, darkBackground, visible, children
    } = this.props;

    return (
      <Modal animationType="fade" transparent visible={visible} onRequestClose={this.closeModal}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: darkBackground ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0)"
          }}
        >
          <Card
            title={title}
            titleStyle={{ marginTop: 10, marginBottom: 10, fontSize: 18 }}
            dividerStyle={{ marginBottom: 0 }}
            containerStyle={{
              borderRadius: 5,
              padding: 0,
              width: 325
            }}
          >
            {children}
            {this.renderActionButtons()}
          </Card>
        </View>
      </Modal>
    );
  }
}

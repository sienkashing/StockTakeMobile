// @flow

import React, { PureComponent } from "react";
import {
  Text, TouchableWithoutFeedback, View, Animated, StyleSheet
} from "react-native";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    flexDirection: "column"
  },
  animatedContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  }
});

type Props = {
  value: boolean,
  onChangeValue: Function,
  activeText: string,
  inactiveText: string,
  fontSize: number,
  activeTextColor: string,
  inactiveTextColor: string,
  activeBackgroundColor: string,
  inactiveBackgroundColor: string,
  activeButtonBackgroundColor: string,
  inactiveButtonBackgroundColor: string,
  switchWidth: number,
  switchHeight: number,
  switchBorderRadius: number,
  switchBorderColor: string,
  switchBorderWidth: number,
  buttonWidth: number,
  buttonHeight: number,
  buttonBorderRadius: number,
  buttonBorderColor: string,
  buttonBorderWidth: number,
  animationTime: number,
  padding: number,
  shadowColor: string,
  shadowOffset: Object,
  shadowRadius: number,
  shadowOpacity: number
};

type State = {
  transformValue: Animated.Value,
  backgroundColor: Animated.Value,
  buttonBackgroundColor: Animated.Value
};
export default class Switch extends PureComponent<Props, State> {
  static defaultProps = {
    value: false,
    onChangeValue: () => null,
    activeText: "",
    inactiveText: "",
    fontSize: 16,
    activeTextColor: "rgba(255, 255, 255, 1)",
    inactiveTextColor: "rgba(255, 255, 255, 1)",
    activeBackgroundColor: "rgba(50, 163, 50, 1)",
    inactiveBackgroundColor: "rgba(137, 137, 137, 1)",
    activeButtonBackgroundColor: "rgba(255, 255, 255, 1)",
    inactiveButtonBackgroundColor: "rgba(255, 255, 255, 1)",
    switchWidth: 70,
    switchHeight: 30,
    switchBorderRadius: 15,
    switchBorderColor: "rgba(0, 0, 0, 1)",
    switchBorderWidth: 0,
    buttonWidth: 25,
    buttonHeight: 25,
    buttonBorderRadius: 15,
    buttonBorderColor: "rgba(0, 0, 0, 1)",
    buttonBorderWidth: 0,
    animationTime: 150,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
    shadowOpacity: 1
  };

  constructor(props: Props) {
    super(props);
    // Backwards compatibility: `padding` used to be bool, where `true = 5`
    this.state = {
      transformValue: new Animated.Value(props.value ? this.transformTo() : props.padding),
      backgroundColor: new Animated.Value(props.value ? 90 : -90),
      buttonBackgroundColor: new Animated.Value(props.value ? 90 : -90)
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { value } = this.props;
    if (value !== prevProps.value) this.startGroupAnimations();
  }

  startGroupAnimations = () => {
    const { animationTime, value, padding } = this.props;
    const { transformValue, backgroundColor, buttonBackgroundColor } = this.state;

    Animated.parallel([
      Animated.spring(transformValue, {
        toValue: value ? this.transformTo() : padding,
        duration: animationTime
      }),
      Animated.timing(backgroundColor, {
        toValue: value ? 75 : -75,
        duration: animationTime
      }),
      Animated.timing(buttonBackgroundColor, {
        toValue: value ? 75 : -75,
        duration: animationTime
      })
    ]).start();
  };

  transformTo() {
    const { switchWidth, buttonWidth, padding } = this.props;
    return switchWidth - buttonWidth - padding;
  }

  render() {
    const { transformValue, backgroundColor, buttonBackgroundColor } = this.state;

    const {
      value,
      onChangeValue,
      activeText,
      inactiveText,
      fontSize,
      activeTextColor,
      inactiveTextColor,
      activeBackgroundColor,
      inactiveBackgroundColor,
      activeButtonBackgroundColor,
      inactiveButtonBackgroundColor,
      switchWidth,
      switchHeight,
      switchBorderRadius,
      switchBorderColor,
      switchBorderWidth,
      buttonWidth,
      buttonHeight,
      buttonBorderRadius,
      buttonBorderColor,
      buttonBorderWidth,
      shadowColor,
      shadowOffset,
      shadowRadius,
      shadowOpacity
    } = this.props;

    const backgroundColorValue = backgroundColor.interpolate({
      inputRange: [-90, 90],
      outputRange: [inactiveBackgroundColor, activeBackgroundColor]
    });

    const buttonBackgroundColorValue = buttonBackgroundColor.interpolate({
      inputRange: [-90, 90],
      outputRange: [inactiveButtonBackgroundColor, activeButtonBackgroundColor]
    });

    const containerHeight = switchHeight > buttonHeight ? switchHeight : buttonHeight;
    const containerWidth = switchWidth > buttonWidth ? switchWidth : buttonWidth;

    return (
      <TouchableWithoutFeedback onPress={onChangeValue}>
        <View
          style={[
            styles.container,
            {
              height: containerHeight,
              width: containerWidth
            }
          ]}
        >
          <Animated.View
            style={{
              backgroundColor: backgroundColorValue,
              height: switchHeight,
              width: switchWidth,
              borderRadius: switchBorderRadius,
              borderWidth: switchBorderWidth,
              borderColor: switchBorderColor,
              zIndex: 1,
              position: "absolute",
              top: (containerHeight - switchHeight) / 2,
              left: (containerWidth - switchWidth) / 2
            }}
          >
            <View style={styles.animatedContainer}>
              <View style={styles.textContainer}>
                <Text style={{ color: activeTextColor, fontSize }}>
                  {value ? activeText : ""}
                </Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={{ color: inactiveTextColor, fontSize }}>
                  {value ? "" : inactiveText}
                </Text>
              </View>
            </View>
          </Animated.View>
          <Animated.View
            style={{
              backgroundColor: buttonBackgroundColorValue,
              borderRadius: buttonBorderRadius,
              borderWidth: buttonBorderWidth,
              borderColor: buttonBorderColor,
              width: buttonWidth,
              height: buttonHeight,
              zIndex: 3,
              position: "absolute",
              top: (containerHeight - buttonHeight) / 2,
              left: transformValue,
              shadowColor,
              shadowOpacity,
              shadowOffset,
              shadowRadius
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

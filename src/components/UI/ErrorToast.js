// @flow
import { Toast } from "native-base";

const ErrorToast = (errorText: string) => {
  Toast.show({
    text: errorText,
    buttonText: "Okay",
    duration: 5000,
    position: "top",
    type: "danger",
    textStyle: {
      fontSize: 12
    }
  });
};

export default ErrorToast;

// @flow
import React, { PureComponent } from "react";
import { View, Text } from "react-native";
import DeviceInfo from "react-native-device-info";
import { DocumentInfo, ModalInputDlg } from "../index";
import { realmQueryObjects, realmClearAndWriteObjects } from "../../utils/RealmDBUtils";
import { SettingSchema, HOST_ADDRESS } from "../../models/SettingsSchema";
import colors from "../Colors";

type Props = {
  toggleModal: Function,
  visible: boolean
};
type State = {
  deviceUID: string,
  deviceName: string,
  hostAddress: string,
  error: ?Object
};
export default class SettingsInput extends PureComponent<Props, State> {
  state = {
    error: null,
    deviceUID: "",
    deviceName: "",
    hostAddress: ""
  };

  componentDidUpdate(prevProps: Props) {
    const prevVisible = prevProps.visible;
    const { visible } = this.props;

    if (prevVisible !== visible && visible) {
      this.loadSettings();
    }
  }

  loadSettings = () => {
    const { hostAddress } = this.state;
    const [error, [currSettings]] = realmQueryObjects(SettingSchema, null);
    if (error) {
      this.setState({ error });
    } else {
      const deviceUID = DeviceInfo.getUniqueID();
      const deviceName = DeviceInfo.getDeviceName();

      if (!hostAddress && currSettings) {
        this.setState({ deviceUID, deviceName, hostAddress: currSettings[HOST_ADDRESS] });
      } else {
        this.setState({ deviceUID, deviceName, hostAddress });
      }
    }
  };

  handleSettingsChange = (hostAddress: string) => {
    this.setState({ hostAddress });
  };

  confirmSettings = () => {
    const { toggleModal } = this.props;
    const { hostAddress } = this.state;
    const settingsObj = { hostAddress };
    const error = realmClearAndWriteObjects(SettingSchema, [settingsObj]);
    if (error) {
      this.setState({ error });
    }
    toggleModal(false);
  };

  renderForm = () => {
    const {
      error, deviceUID, deviceName, hostAddress
    } = this.state;
    const data = {
      "Device UID": deviceUID,
      "Device Name": deviceName,
      "Host Address": hostAddress
    };
    return (
      <View>
        {error ? (
          <View style={{ padding: 5 }}>
            <Text>
              {`There was an error loading settings data: ${error.message}`}
            </Text>
          </View>
        ) : (
          <View>
            <DocumentInfo
              data={data}
              rowStyle={{
                paddingTop: 5,
                paddingBottom: 5
              }}
              containerStyle={{ borderWidth: 0, paddingBottom: 0 }}
              editable
              editFields={[
                {
                  name: "Host Address",
                  value: hostAddress,
                  props: {
                    onChangeText: this.handleSettingsChange
                  }
                }
              ]}
            />
            <View
              style={{
                paddingLeft: 15,
                paddingTop: 0,
                height: 50,
                borderBottomWidth: 1,
                borderBottomColor: colors.borderGrey
              }}
            >
              <Text style={{ fontSize: 12 }}>
                {
                  "* Close and open the application to refresh the device name if it doesn't update."
                }
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };

  render() {
    const { visible, toggleModal } = this.props;
    const confirmBtnProps = {
      action: this.confirmSettings
    };
    return (
      <ModalInputDlg
        title="Settings"
        visible={visible}
        toggleModal={toggleModal}
        confirmBtnProps={confirmBtnProps}
      >
        {this.renderForm()}
      </ModalInputDlg>
    );
  }
}

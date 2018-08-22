import { realmQueryObjects } from "../utils/RealmDBUtils";
import { SettingSchema, HOST_ADDRESS } from "../models/SettingsSchema";

export default function getServerAddress() {
  const [err, [settings]] = realmQueryObjects(SettingSchema, null);
  if (err) {
    return [err, null];
  }
  if (!settings || !settings[HOST_ADDRESS]) {
    return [new Error("Server has not been setup yet. Click on settings to setup."), null];
  }
  return [null, settings[HOST_ADDRESS]];
}

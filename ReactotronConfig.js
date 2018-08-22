import Reactotron from "reactotron-react-native";

Reactotron.configure({
  host: "192.168.0.15"
}) // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .connect(); // let's connect!

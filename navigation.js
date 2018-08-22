// @flow
import { FluidNavigator } from "react-navigation-fluid-transitions";
import DocumentList from "./src/modules/DocumentList";
import DocumentDetails from "./src/modules/DocumentDetails";
import BarcodeScanner from "./src/modules/BarcodeScanner";

const RootNav = FluidNavigator(
  {
    //  Home: App,
    DocumentList: { screen: DocumentList },
    DocumentDetails: { screen: DocumentDetails },
    BarcodeScanner: { screen: BarcodeScanner }
  },
  {
    initialRouteName: "DocumentList",
    transitionConfig: { duration: 350 }
  }
);

export default RootNav;

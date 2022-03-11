import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ListeleScreen from  "./src/screens/ListeleScreen";
import ConvertScreen from "./src/screens/ConvertScreen";
const navigator = createStackNavigator(
  {
    HomeScreen: HomeScreen,
    ListeleScreen:ListeleScreen,
    ConvertScreen:ConvertScreen,
  },
  {
    initialRouteName: "HomeScreen",
    defaultNavigationOptions: {
      title: "Borsa Uygulaması",
    },
  }
);

export default createAppContainer(navigator);

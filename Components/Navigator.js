import {createAppContainer, createStackNavigator} from "react-navigation";
import LoginContainer from "../src/Screens/Login/LoginContainer"
import HomeContainer from "../src/Screens/Home/HomeContainer"
const Navigator = createStackNavigator(
    {
        LoginContainer: LoginContainer,
        HomeContainer : HomeContainer
    }
);
let AppContainer;
export default AppContainer = createAppContainer(Navigator);

import {createAppContainer, createStackNavigator} from "react-navigation";
import LoginContainer from "../src/Screens/Login/LoginContainer"

const Navigator = createStackNavigator(
    {
        LoginContainer: LoginContainer
    }
);
let AppContainer;
export default AppContainer = createAppContainer(Navigator);

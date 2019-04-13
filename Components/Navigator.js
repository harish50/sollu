import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeContainer from '../src/Screens/HomePage/HomeContainer'
import LoginContainer from '../src/Screens/LoginPage/LoginContainer'

const Navigator = createStackNavigator(
    {
        LoginContainer: LoginContainer,
        HomeContainer: HomeContainer
    }
);
var AppContainer;
export default AppContainer = createAppContainer(Navigator);
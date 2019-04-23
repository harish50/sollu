import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeContainer from '../src/Screens/HomePage/HomeContainer'
import LoginContainer from '../src/Screens/LoginPage/LoginContainer'
import VideoCallerContainer from "../src/Screens/VideoCallerPage/VideoCallerContainer";
import ChatContainer from "../src/Screens/ChatPage/ChatContainer";
import ProfileIconContainer from "../src/Screens/Profile/ProfileIconContainer";
import ProfileContainer from "../src/Screens/Profile/ProfileContainer";

const Navigator = createStackNavigator(
    {
        LoginContainer: LoginContainer,
        HomeContainer: HomeContainer,
        ChatContainer:ChatContainer,
        VideoCallerContainer : VideoCallerContainer,
        ProfileIconContainer :ProfileIconContainer,
        ProfileContainer: ProfileContainer
    }
);
var AppContainer;
export default AppContainer = createAppContainer(Navigator);
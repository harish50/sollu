import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeContainer from './Screens/HomePage/HomeContainer'
import LoginContainer from './Screens/LoginPage/LoginContainer'
import VideoCallerContainer from "./Screens/VideoCallerPage/VideoCallerContainer";
import ChatContainer from "./Screens/ChatPage/ChatContainer";
import ProfileIconContainer from "./Screens/Profile/ProfileIconContainer";
import ProfileContainer from "./Screens/Profile/ProfileContainer";
import AnswerVideoCall from "../Components/AnswerVideoCall";

const Navigator = createStackNavigator(
    {
        LoginContainer: LoginContainer,
        HomeContainer: HomeContainer,
        ChatContainer:ChatContainer,
        VideoCallerContainer : VideoCallerContainer,
        ProfileIconContainer :ProfileIconContainer,
        ProfileContainer: ProfileContainer,
        AnswerVideoCall : AnswerVideoCall
    }
);
var AppContainer;
export default AppContainer = createAppContainer(Navigator);
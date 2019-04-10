import {createStackNavigator, createAppContainer} from "react-navigation";
import HomeScreen from "./HomeScreen";
import ChatScreen from "./ChatScreen";
import LoginScreen from './LoginScreen';
import ProfilePage from './ProfilePage';
import VideoCall from './VideoCall'
import AnswerVideoCall from "./AnswerVideoCall";
import LoginContainer from "../src/Screens/Login/LoginContainer"

const isRegistered = false;
const initialScreen = LoginContainer
const Navigator = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        HomeScreen: HomeScreen,
        ChatScreen: ChatScreen,
        ProfilePage: ProfilePage,
        VideoCall: VideoCall,
        AnswerVideoCall: AnswerVideoCall
    },
    {
        initialRouteName: LoginContainer,
    }
);
let AppContainer;
export default AppContainer = createAppContainer(Navigator);

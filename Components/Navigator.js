import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./HomeScreen";
import ChatScreen from "./ChatScreen";
import LoginScreen from './LoginScreen';
import ProfilePage from './ProfilePage';
import VideoCall from './VideoCall'
import AnswerVideoCall from "./AnswerVideoCall";

const isRegistered = false;
const initialScreen = isRegistered ? "HomeScreen" : "LoginScreen";
const Navigator = createStackNavigator(
    {
        LoginScreen: LoginScreen,
        HomeScreen: HomeScreen,
        ChatScreen: ChatScreen,
        ProfilePage: ProfilePage,
        VideoCall:VideoCall,
        AnswerVideoCall: AnswerVideoCall
    },
    {
        initialRouteName: initialScreen,
    }
);
var AppContainer;
export default AppContainer = createAppContainer(Navigator);

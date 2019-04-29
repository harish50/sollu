import React, {Component} from 'react';
import {getChatFromDB} from "./ChatService";
import {ActivityIndicator, View} from 'react-native';
import {dayWiseFilteredMessages, isColorDiffers} from "./ChatFunctions";
import ChatView from "./ChatView";
import Profile from "../../../Components/Profile";
import {HeaderBackButton} from "react-navigation";
import styles from "./ChatStyles";
import {Header} from "../Header/HeaderView";
import VideoCallIconContainer from "../VideoCallIcon/VideoCallIconContainer";
import {resetCurrentUser} from "./CurrentUser";

let participants = null;

export default class ChatContainer extends Component {

    state = {
        messages: [],
        isGettingChat: true
    };

    componentDidMount() {
        this.getUpdatedChat(participants);
    }

    getUpdatedChat = (participants) => {
        getChatFromDB(participants.sender, participants.receiver).then((result) => {
            if (result.length > 0) {
                this.setState({
                    messages: dayWiseFilteredMessages(result),
                    isGettingChat: false
                })
            }
            else {
                this.setState({
                    messages: [],
                    isGettingChat: false
                })
            }
        }).catch((error) => {
            (error);
        });
    };

    updateComponent = () => {
        this.getUpdatedChat(participants);
    };

    static navigationOptions = ({navigation}) => {
        const headerRight = [<VideoCallIconContainer participants={navigation.getParam("participants")}
                                                     contactName={navigation.getParam("contactName")}
                                                     navigation={navigation}/>,
            <Profile sender={navigation.getParam("participants").receiver}/>];
        const headerLeft = <HeaderBackButton tintColor="white" onPress={() => {
            resetCurrentUser();
            navigation.goBack();
        }}/>;
        return (Header(navigation.getParam("contactName"), headerLeft, headerRight))
    };

    render() {
        participants = this.props.navigation.getParam("participants");
        if (this.state.isGettingChat) {
            return (
                <View style={styles.loadingIcon}>
                    <ActivityIndicator size="large" color="#cc504e"/>
                </View>)
        }
        else {
            let props = {
                participants: participants,
                messages: this.state.messages,
                colourDifference: isColorDiffers(participants),
                updateComponent: this.updateComponent
            };
            return (
                <ChatView {...props}/>
            )
        }
    }
}
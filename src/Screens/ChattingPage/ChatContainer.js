import React, {Component} from 'react';
import {getChatFromDB} from "./ChatService";
import {ActivityIndicator, View} from 'react-native';
import {dayWiseFilteredMessages, isColorDiffers} from "./ChatFunctions";
import ChatView from "./ChatView";
import VideoIconComponent from "../../../Components/VideoIconComponent";
import Profile from "../../../Components/Profile";
import {HeaderBackButton} from "react-navigation";
import styles from "./ChatStyles";
import {Header} from "../Header/HeaderView";

let participants = null;

export default class ChatContainer extends Component {

    state = {
        messages: []
    };

    componentDidMount() {
        this.getUpdatedChat(participants);
    }

    getUpdatedChat = (participants) => {
        getChatFromDB(participants.sender, participants.receiver).then((result) => {
            this.setState({
                messages: dayWiseFilteredMessages(result)
            })
        }).catch((error) => {
            console.log(error);
        });
    };

    updateComponent = () => {
        this.getUpdatedChat(participants);
    };

    static navigationOptions = ({navigation}) => {
        const headerRight = [<VideoIconComponent participants={navigation.getParam("participants")}
                                                 contactName={navigation.getParam("contactName")}
                                                 navigation={navigation}/>,
            <Profile sender={navigation.getParam("participants").receiver}/>];
        const headerLeft = <HeaderBackButton tintColor="white" onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack();
        }}/>;
        return (Header(navigation.getParam("contactName"), headerLeft, headerRight))
    };

    render() {
        participants = this.props.navigation.getParam("participants");
        if (this.state.messages.length) {
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
        return (<View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#cc504e"/>
        </View>)
    }
}
import React, {Component} from 'react';
import {getChat} from "../../Utilities/Firebase";
import {ActivityIndicator, Text, View} from 'react-native';
import {filterMessagesDayWise, isColorDiffers} from "./ChatFunctions";
import ChatView from "./ChatView";
import VideoIconComponent from "../../../Components/VideoIconComponent";
import Profile from "../../../Components/Profile";
import {HeaderBackButton} from "react-navigation";
import styles from "../../../Stylesheet/styleSheet";
import {Header} from "../Header/HeaderView";

let participants = null;
export default class ChatContainer extends Component {

    state = {
        typing: '',
        messages: [],
        chatRef: null
    };

    getMessages=(participants)=>{
        getChat(participants.sender, participants.receiver).then((result)=>{
            console.log("in component did mount getchat",result);
            this.setState({
                messages: filterMessagesDayWise(result)
            })
        }).catch((error)=>{
            console.log(error);
        });
    };

    componentDidMount() {
        participants = this.props.navigation.getParam('participants');
        this.getMessages(participants);
    }

    updateComponent=()=>{
        console.log("inside updatecomponenet");
        this.setState({
            typing: ""
        });
        this.getMessages(participants);
        console.log("in updatecomponent:", this.state.typing);
    };

    static navigationOptions = ({navigation}) => {

        const headerRight = [<VideoIconComponent participants={navigation.getParam("participants")} contactName={navigation.getParam("contactName")} navigation={navigation}/>, <Profile sender={navigation.getParam("participants").receiver}/>];
        const headerLeft = <HeaderBackButton tintColor="white" onPress={() => { navigation.state.params.onGoBack(); navigation.goBack();}}/>
        return (Header(navigation.getParam("contactName"),headerLeft,headerRight))
    };

    static navigationOptions = ({navigation}) => {
        return (
            {
                headerTitle: navigation.getParam("contactName"),
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e',
                    height: 60,
                },
                headerRight: ([<VideoIconComponent participants={navigation.getParam("participants")}
                                                   contactName={navigation.getParam("contactName")}
                                                   navigation={navigation}/>,
                    <Profile sender={navigation.getParam("participants").receiver}/>]),
                headerLeft: (
                    <HeaderBackButton tintColor="white"
                                      onPress={() => {
                                          navigation.state.params.onGoBack();
                                          navigation.goBack();
                                      }}/>)
            }
        );
    };

    render() {
        participants = this.props.navigation.getParam("participants");
        if(this.state.messages.length){
            console.log("in render",this.state.messages);
            let props={participants: participants, messages: this.state.messages, colourDifference: isColorDiffers(participants), updateComponent: this.updateComponent};
            return (
                <ChatView {...props}/>
            )
        }
        return (<View style={styles.loadingIcon}>
            <ActivityIndicator size="large" color="#cc504e"/>
        </View>)
    }
}
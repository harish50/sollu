import React from "react";
import {
    Platform,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import {SafeAreaView, Header, HeaderBackButton} from 'react-navigation';
import styles from "../Stylesheet/styleSheet";
import firebase from "../firebase/firebase";
import Profile from "./Profile";
import DateComponent from './DateComponent';
import VideoIconComponent from "./VideoIconComponent";

let navigation = null;
let participants;
let CONVERSATIONS_REF = firebase.database().ref("conversations");
let REGISTERED_USERS_REF = firebase.database().ref("registeredUsers");
let REGISTERED_USER_PROFILE_INFO_REF = firebase.database().ref("registeredUserProfileInfo");

export default class ChatScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            typing: "",
            messages: [],
            dayMessages: [],
            colourDifference: false,
            chatRef: null,
        };
    }

    componentWillReceiveProps(props) {
        this.isColorDiffers();
        participants = props.navigation.getParam("participants");
        this.state.chatRef.off();
        this.getChat(participants.sender, participants.receiver);
    }

    componentDidMount() {
        navigation = this.props;
        participants = this.props.navigation.getParam('participants');
        this.isColorDiffers();
        CONVERSATIONS_REF.once('value', (conversations) => {
            if (!conversations.hasChild(this.getPairID()))
                this.setLastActiveTime(0);
        });
        this.getChat(participants.sender, participants.receiver);
    }

    getPairID = () => {
        let key = '';
        if (participants.sender === participants.receiver) {
            key = participants.sender;
        }
        else if (participants.sender > participants.receiver) {
            key = participants.receiver + participants.sender;
        }
        else {
            key = participants.sender + participants.receiver;
        }
        return key;
    };

    setLastActiveTime = (time) => {
        let key = this.getPairID();
        CONVERSATIONS_REF.child(key).set({'lastActiveTime': time});
    };

    isColorDiffers = () => {
        let colorDifference = false;
        const senderInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.sender);
        const receiverInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.receiver);
        senderInfoRef.once('value', (senderSnap) => {
            let sender = senderSnap.val();
            receiverInfoRef.on('value', (receiverSnap) => {
                let receiver = receiverSnap.val();
                if (receiver === null) {
                    return;
                }
                if ((sender.imageURL === undefined && receiver.imageURL === undefined)) {
                    if ((sender.Gender === undefined && receiver.Gender === undefined) || (sender.Gender === receiver.Gender)) {
                        colorDifference = true;
                    }
                } else if (sender.imageURL === receiver.imageURL) {
                    colorDifference = true;
                }
            })
        });
        this.setState({
            colourDifference: colorDifference
        });
    };

    getChat = (sender, receiver) => {
        const chatRef = REGISTERED_USERS_REF.child(sender).child("chat").child(receiver);
        chatRef.on('value', (data) => {
            let chatData = data.val();
            let Chat = [];
            for (let chatID in chatData) {
                const message = {
                    _id: chatData[chatID]._id,
                    text: chatData[chatID].text,
                    createdAt: new Date(chatData[chatID].createdAt),
                };
                Chat.push(message);
            }
            let messages = this.separateMessages(Chat);
            this.setState({
                messages: messages,
                chatRef: chatRef,
            });
        });
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

    sendMessage = () => {
        if (this.state.typing.trim() === '') {
            return;
        }
        let msg = {
            _id: 2,
            text: this.state.typing.trim(),
            createdAt: new Date().getTime(),
        };
        if (participants.sender === participants.receiver) {
            msg._id = 0;
            REGISTERED_USERS_REF.child(participants.sender).child("chat").child(participants.receiver).push(msg);
        }
        else {
            REGISTERED_USERS_REF.child(participants.sender).child("chat").child(participants.receiver).push(msg);
            msg._id = 1;
            REGISTERED_USERS_REF.child(participants.receiver).child("chat").child(participants.sender).push(msg);
        }
        this.setLastActiveTime(msg.createdAt);
        this.setState({typing: ''});
    };

    renderItem({item}) {
        if (item.header) {
            return (
                <DateComponent item={item}/>
            );
        }
        let messageboxstyle;
        let messagetextstyle;
        let phoneNo = participants.sender;
        if (item._id === 0) {
            messageboxstyle = styles.selfMessageContainer;
            messagetextstyle = styles.selfTextContainer;
        }
        else if (item._id === 2) {
            messageboxstyle = [styles.senderMessageContainer, styles.chatBox];
            messagetextstyle = styles.senderMessage;
        } else {
            messageboxstyle = [styles.receiverMessageContainer, styles.chatBox];
            messagetextstyle = styles.receiverMessage;
            phoneNo = participants.receiver;
        }
        let minutes = '' + item.createdAt.getMinutes();
        if (minutes.length < 2) minutes = '0' + minutes;
        let hours = '' + item.createdAt.getHours();
        if (hours.length < 2) hours = '0' + hours;
        const time = hours + ":" + minutes;
        if (this.state.colourDifference) {
            let Icon;
            if (item._id === 2) {
                Icon = require('../Icon/plane-blue-background.jpg')
            }
            else {
                Icon = require('../Icon/red_color.png')
            }
            return (
                <View style={messageboxstyle}>
                    <View>
                        <ImageBackground source={Icon} style={styles.chatIcon} imageStyle={{borderRadius: 100}}>
                            <Profile sender={phoneNo}/>
                        </ImageBackground>
                    </View>
                    <View style={messagetextstyle}>
                        <Text style={styles.messageStyle}>{item.text}</Text>
                        <Text style={styles.timeStyle}>{time}</Text>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={messageboxstyle}>
                    <Profile sender={phoneNo}/>
                    <View style={messagetextstyle}>
                        <Text style={styles.messageStyle}>{item.text}</Text>
                        <Text style={styles.timeStyle}>{time}</Text>
                    </View>
                </View>
            );
        }
    };

    separateMessages = (messages) => {
        if (messages.length === 0) {
            return [];
        }
        let messagesLength = messages.length;
        let daywiseMessages = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let lastDate = monthNames[messages[0].createdAt.getMonth()] + " " + messages[0].createdAt.getDate() + " " + messages[0].createdAt.getFullYear();
        daywiseMessages.push({
            text: lastDate,
            header: true
        });
        for (let counter = 0; counter < messagesLength; counter++) {
            let day = monthNames[messages[counter].createdAt.getMonth()] + " " + messages[counter].createdAt.getDate() + " " + messages[counter].createdAt.getFullYear();
            if (day !== lastDate) {
                daywiseMessages.push({
                    text: day,
                    header: true
                });
                lastDate = day;
            }
            daywiseMessages.push(messages[counter]);
        }
        ;
        return daywiseMessages;
    }

    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? Header.HEIGHT + 35 : 0;
        const padding = Platform.OS === 'ios' ? "padding" : '';
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.messages}
                            extraData={this.state.messages}
                            renderItem={(item) => this.renderItem(item)}
                            keyExtractor={(item, index) => index.toString()}
                            ref={ref => this.flatList = ref}
                            onContentSizeChange={() => {
                                this.flatList.scrollToEnd({animated: false})
                            }}
                        />
                    </View>

                    <KeyboardAvoidingView
                        keyboardVerticalOffset={keyboardVerticalOffset}
                        behavior={padding}
                    >
                        <View style={styles.footer}>
                            <TextInput
                                value={this.state.typing}
                                onChangeText={text => this.setState({typing: text})}
                                style={styles.input}
                                underlineColorAndroid="transparent"
                                placeholder="Type something nice"
                            />
                            <TouchableOpacity onPress={this.sendMessage}>
                                <Text style={styles.send}>Send</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaView>
        );
    }
}

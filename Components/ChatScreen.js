import React from "react";
import { Platform, View, Text, TextInput, KeyboardAvoidingView, FlatList, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import { SafeAreaView, Header, HeaderBackButton } from 'react-navigation';
import styles from "../Stylesheet/styleSheet";
import firebase from "../firebase/firebase";
import Profile from "./Profile";
import DateComponent from './DateComponent';
import VideoIconComponent from "./VideoIconComponent";


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
        this.setLastActiveTime = this.setLastActiveTime.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.isColorDiffers = this.isColorDiffers.bind(this);
    }

    getConvoPairID() {
        let key = '';
        let { navigation } = this.props;
        let info = navigation.getParam('info');
        if (info.sender === info.receiver) {
            key = info.sender;
        }
        else if (info.sender > info.receiver) {
            key = info.receiver + info.sender;
        }
        else {
            key = info.sender + info.receiver;
        }
        return key;
    }
    setLastActiveTime(time) {
        let key = this.getConvoPairID();
        firebase.database().ref('conversations').child(key).set({ 'lastActiveTime': time });
    }
    isColorDiffers() {
        let colorDifference = false;
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        const senderInfoRef = firebase.database().ref('registeredUserProfileInfo').child(info.sender);
        const receiverInfoRef = firebase.database().ref('registeredUserProfileInfo').child(info.receiver);
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
        })
        this.setState({
            colourDifference: colorDifference
        });

    }
    getChat = (sender, receiver) => {
        const db = firebase.database();
        const chatRef = db.ref('registeredUsers').child(sender).child("chat").child(receiver);
        chatRef.on('value', (data) => {
            let chatData = data.val();
            let Chat = []
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
    }
    componentWillReceiveProps(props) {
        this.isColorDiffers();
        const info = props.navigation.getParam("info");
        this.state.chatRef.off();
        this.getChat(info.sender, info.receiver);
    }
    componentDidMount() {
        this.isColorDiffers();
        const info = this.props.navigation.getParam("info")
        firebase.database().ref('conversations').once('value', (conversations) => {
            if (!conversations.hasChild(this.getConvoPairID()))
                this.setLastActiveTime(0);
        });
        this.getChat(info.sender, info.receiver);
    }

    static navigationOptions = ({ navigation }) => {
        let props = navigation
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
                headerRight: ([<VideoIconComponent info={navigation.getParam("info")} contactName={navigation.getParam("contactName")} navigation={props} />, <Profile sender={navigation.getParam("info").receiver} />]),
                headerLeft: (
                    <HeaderBackButton tintColor="white"
                                      onPress={() => { navigation.state.params.onGoBack(); navigation.goBack(); }} />)
            }
        );
    };

    sendMessage() {
        if (this.state.typing.trim() === '') {
            return;
        }
        let { navigation } = this.props;
        let db = firebase.database();
        const info = navigation.getParam('info');
        let msg = {
            _id: 2,
            text: this.state.typing.trim(),
            createdAt: new Date().getTime(),
        };
        if (info.sender === info.receiver) {
            msg._id = 0;
            db.ref('registeredUsers').child(info.sender).child("chat").child(info.receiver).push(msg);

        }
        else {
            db.ref('registeredUsers').child(info.sender).child("chat").child(info.receiver).push(msg);
            msg._id = 1;
            db.ref('registeredUsers').child(info.receiver).child("chat").child(info.sender).push(msg);
        }
        this.setLastActiveTime(msg.createdAt);
        this.setState({ typing: '' });
    }

    renderItem({ item }) {
        if (item.header) {
            return (
                <DateComponent item={item} />
            );
        }
        let messageboxstyle;
        let messagetextstyle;
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        let phoneNo = info.sender;
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
            phoneNo = info.receiver;
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
                        <ImageBackground source={Icon} style={styles.chatIcon} imageStyle={{ borderRadius: 100 }}>
                            <Profile sender={phoneNo} />
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
                    <Profile sender={phoneNo} />
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
            day = monthNames[messages[counter].createdAt.getMonth()] + " " + messages[counter].createdAt.getDate() + " " + messages[counter].createdAt.getFullYear();
            if (day !== lastDate) {
                daywiseMessages.push({
                    text: day,
                    header: true
                });
                lastDate = day;
            }
            daywiseMessages.push(messages[counter]);
        };
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
                            onContentSizeChange={() => { this.flatList.scrollToEnd({ animated: false }) }}
                        />
                    </View>

                    <KeyboardAvoidingView
                        keyboardVerticalOffset={keyboardVerticalOffset}
                        behavior={padding}
                    >
                        <View style={styles.footer}>
                            <TextInput
                                value={this.state.typing}
                                onChangeText={text => this.setState({ typing: text })}
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
import React from "react";
import { Platform, View, Text, TextInput, KeyboardAvoidingView, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView, Header } from 'react-navigation';
import styles from "../Stylesheet/styleSheet";
import firebase from "../firebase/firebase";
import Profile from "./Profile";


export default class ChatScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typing: "",
            messages: [],
            chatRef: null,
        };
        this.sendMessage = this.sendMessage.bind(this);
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
            this.setState({
                messages: Chat,
                chatRef: chatRef,
            });
        });
    }
    componentWillReceiveProps(props) {
        const info = props.navigation.getParam("info");
        this.state.chatRef.off();
        this.getChat(info.sender, info.receiver);
    }
    componentDidMount() {
        const info = this.props.navigation.getParam("info")
        this.getChat(info.sender, info.receiver);
    }
    static navigationOptions = ({ navigation }) => {
        return (
            {
                headerTitle: navigation.getParam("contactName"),
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e'
                },
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
        if (info.sender === info.receiver.item.key) {
            msg._id = 0;
            db.ref('registeredUsers').child(info.sender).child("chat").child(info.receiver.item.key).push(msg);
        }
        else {
            db.ref('registeredUsers').child(info.sender).child("chat").child(info.receiver.item.key).push(msg);
            msg._id = 1;
            db.ref('registeredUsers').child(info.receiver.item.key).child("chat").child(info.sender).push(msg);
        }
        this.setState({ typing: '' });
    }

    renderItem({ item }) {
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
        return (
            <View style={messageboxstyle}>
                {/*<Image style={styles.iconContainer} source={require('../Icon/userIcon1.png')} />*/}
                <Profile sender={phoneNo} />
                <Text style={messagetextstyle}>{item.text + " " + time}</Text>
            </View>
        );
    };

    renderDayMessages = (dayMessages, day) => {
        let date = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let today = monthNames[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
        let YesterdayDate = date.getDate() - 1;
        let yesterday = monthNames[date.getMonth()] + " " + YesterdayDate + " " + date.getFullYear()
        if (day === today) {
            day = 'Today'
        }
        if (day === yesterday) {
            day = 'Yesterday'
        }
        return (
            <View>
                <View style={styles.dayAlignment}>
                    <Text style={styles.DayTextStyle}>{day}</Text>
                </View>
                <FlatList
                    data={dayMessages}
                    renderItem={(item) => this.renderItem(item)}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEnabled="false"
                />
            </View>
        )
    }

    renderMessages = (messages) => {
        let preMsgDate;
        const messageLen = messages.length;
        console.log(messageLen);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if (messages[0]) {
            preMsgDate = monthNames[messages[0].createdAt.getMonth()] + " " + messages[0].createdAt.getDate() + " " + messages[0].createdAt.getFullYear();
        }
        let dayMessages = [];
        return messages.map((message, i) => {
            console.log(i);
            let fullDate = monthNames[message.createdAt.getMonth()] + " " + message.createdAt.getDate() + " " + message.createdAt.getFullYear();
            if (fullDate === preMsgDate) {
                dayMessages.push(message);
                if (messageLen == (i + 1)) {
                    return this.renderDayMessages(dayMessages, preMsgDate);
                }
            }
            else {
                let result = this.renderDayMessages(dayMessages, preMsgDate);
                dayMessages = [];
                preMsgDate = fullDate;
                dayMessages.push(message);
                if (messageLen == (i + 1)) {
                    return this.renderDayMessages(dayMessages, preMsgDate);
                }
                return result;
            }
        });
    }

    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? Header.HEIGHT + 20 : 0;
        const padding = Platform.OS === 'ios' ? "padding" : '';
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <ScrollView>
                            {this.renderMessages(this.state.messages)}
                        </ScrollView>

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

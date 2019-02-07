import React from "react";
import {
    Platform,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    FlatList,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
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
            colourDifference:false
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.isColorDiffers=this.isColorDiffers.bind(this);
    }

    isColorDiffers(){
        let colorDifference = false;
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        const senderInfoRef = firebase.database().ref('registeredUserProfileInfo').child(info.sender);
        const receiverInfoRef = firebase.database().ref('registeredUserProfileInfo').child(info.receiver.item.key);
        senderInfoRef.on('value', (senderSnap) => {
            let sender = senderSnap.val();
            receiverInfoRef.on('value',(receiverSnap)=>{
                let receiver = receiverSnap.val()
                if((sender.imageURL === undefined && receiver.imageURL === undefined)){
                    if((sender.Gender === undefined && receiver.Gender === undefined) || (sender.Gender === receiver.Gender)){
                        colorDifference = true;
                    }
                }else if(sender.imageURL === receiver.imageURL){
                    colorDifference = true;
                }
            })
        })
        this.setState({
            colourDifference:colorDifference
        });

    }

    componentDidMount() {
        this.isColorDiffers();
        const db = firebase.database();
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        const taskRef = db.ref('registeredUsers').child(info.sender).child("chat").child(info.receiver.item.key);
        taskRef.on('value', (data) => {
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
                messages: Chat
            });
        });
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
    renderItem({ item }) {
        let messageboxstyle;
        let messagetextstyle;
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        let phoneNo=info.sender;
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
            phoneNo=info.receiver.item.key;
        }
        let minutes = '' + item.createdAt.getMinutes();
        if (minutes.length < 2) minutes = '0' + minutes;
        let hours = '' + item.createdAt.getHours();
        if (hours.length < 2) hours = '0' + hours;
        const time = hours + ":" + minutes;
        if(this.state.colourDifference){
            let Icon;
            if(item._id === 2){
                Icon = require('../Icon/blue_colour.jpg')
            }
            else{
                Icon= require('../Icon/red_color.png')
            }
            return (
                <View style={messageboxstyle}>
                    <View>
                        <ImageBackground source={Icon}  style={styles.chatIcon} imageStyle={{borderRadius:100}}>
                        <Profile sender={phoneNo}/>
                        </ImageBackground>
                    </View>
                    <Text style={messagetextstyle}>{item.text + " " + time}</Text>
                </View>
            );
        }
        else{
            return (
                <View style={messageboxstyle}>
                    <Profile sender={phoneNo} />
                    <Text style={messagetextstyle}>{item.text + " " + time}</Text>
                </View>
            );
        }
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
    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? Header.HEIGHT + 20 : 0;
        const padding = Platform.OS === 'ios' ? "padding" : '';
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.messages}
                        renderItem={this.renderItem.bind(this)}
                        extraData={this.state}
                        keyExtractor={(item, index) => index.toString()}
                        ref={ref => this.flatList = ref}
                        onContentSizeChange={() => this.flatList.scrollToEnd({ animated: false })}
                        onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    />
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

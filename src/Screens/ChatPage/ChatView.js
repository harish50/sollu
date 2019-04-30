import React from 'react';
import styles from "./ChatStyles";
import {SafeAreaView} from 'react-navigation';
import {FlatList, ImageBackground, Text, View} from 'react-native';
import {getMessageRenderingStyles, getTime, sendMessageAndSetLastActiveTime} from "./ChatFunctions";
import Profile from "../../../Components/Profile";
import DateComponent from "../../../Components/DateComponent";
import ChatPageFooter from "./ChatPageFooter";
import ChatPageBody from "./ChatPageBody";

export default class ChatView extends React.Component {

    state = {
        textInputValue: "",
    };

    sendMessage = () => {
        sendMessageAndSetLastActiveTime(this.props.participants, this.state.textInputValue);
        this.props.updateComponent();
        this.setState({textInputValue: ''})
    };

    updateInputValue = (value) => {
        this.setState({
            textInputValue: value
        })
    };

    renderMessage = (item) => {
        if (item.header) {
            return (
                <DateComponent item={item}/>
            );
        }
        const time = getTime(item);
        const stylesAndNum = getMessageRenderingStyles(this.props.participants, item);
        let messageboxstyle = stylesAndNum[0], messagetextstyle = stylesAndNum[1], phoneNo = stylesAndNum[2];
        if (this.props.colourDifference) {
            let Icon;
            if (item._id === 2) {
                Icon = require('../../../Icon/plane-blue-background.jpg')
            }
            else {
                Icon = require('../../../Icon/red_color.png')
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

    render() {
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <ChatPageBody messages = {this.props.messages} renderMessage = {this.renderMessage}/>
                    <ChatPageFooter textInputValue={this.state.textInputValue} updateInputValue={this.updateInputValue}
                                    sendMessage={this.sendMessage}/>
                </View>
            </SafeAreaView>
        );
    }
}
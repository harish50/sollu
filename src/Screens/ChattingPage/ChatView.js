import React from 'react';
import styles from "../../../Stylesheet/styleSheet";
import {SafeAreaView, Header} from 'react-navigation';
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
import {getTime, getMessageRenderingStyles, sendMessageAndSetLastActiveTime} from "./ChatFunctions";
import Profile from "../../../Components/Profile";
import DateComponent from "../../../Components/DateComponent";

export default class ChatView extends React.Component{

    constructor(props){
        super(props);
    }
    state = {
        typing: "",
    };

    renderItem=(item)=> {
        if (item.header) {
            return (
                <DateComponent item={item}/>
            );
        }
        const time = getTime(item);
        const stylesAndNum = getMessageRenderingStyles(this.props.participants, item);
        let messageboxstyle = stylesAndNum[0], messagetextstyle = stylesAndNum[1], phoneNo= stylesAndNum[2];
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

    sendMessage=()=>{
        sendMessageAndSetLastActiveTime(this.props.participants, this.state.typing);
        this.props.updateComponent();
        this.setState({typing:''})
    };

    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? Header.HEIGHT + 35 : 0;
        const padding = Platform.OS === 'ios' ? "padding" : '';
        return (
            <SafeAreaView style={styles.safeAreaView}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <FlatList
                            data={this.props.messages}
                            extraData={this.props.messages}
                            renderItem={(item) => this.renderItem(item.item)}
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
import {KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View} from "react-native";
import styles from "./ChatStyles";
import React from "react";
import {Header} from "react-navigation";

export default class ChatPageFooter extends React.Component {
    render() {
        const keyboardVerticalOffset = Platform.OS === 'ios' ? Header.HEIGHT + 35 : 0;
        const padding = Platform.OS === 'ios' ? "padding" : '';
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={keyboardVerticalOffset}
                behavior={padding}
            >
                <View style={styles.footer}>
                    <TextInput
                        value={this.props.textInputValue}
                        onChangeText={text => this.props.updateInputValue(text)}
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Type something nice"
                    />
                    <TouchableOpacity onPress={this.props.sendMessage}>
                        <Text style={styles.send}>Send</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
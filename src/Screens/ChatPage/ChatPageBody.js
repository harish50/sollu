import React, {Component} from 'react'
import {FlatList, Text, View} from "react-native";
import styles from "./ChatStyles";

export default class ChatPageBody extends Component {
    render() {
        if (this.props.messages.length > 0) {
            return (
                <View style={styles.container}>
                    <FlatList
                        data={this.props.messages}
                        extraData={this.props.messages}
                        renderItem={(item) => this.props.renderMessage(item.item)}
                        keyExtractor={(item, index) => index.toString()}
                        ref={ref => this.flatList = ref}
                        onContentSizeChange={() => {
                            this.flatList.scrollToEnd({animated: false})
                        }}
                    />
                </View>)
        }
        else {
            return (
                <View style={styles.noChatContainer}>
                    <Text style={styles.noChatText}>No conversation</Text>
                </View>)
        }
    }
}
import React, {Component} from 'react'
import styles from "../../../Stylesheet/styleSheet";
import {ActivityIndicator, View} from "react-native";

export default class LoadingIndicator extends Component {
    render() {
        return (
            <View style={styles.loadingIcon}>
                <ActivityIndicator size="large" color="#cc504e"/>
            </View>
        )
    }
}
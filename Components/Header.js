import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styles from "../Stylesheet/styleSheet";

export default class Header extends Component {
    render() {
        return (
            <View style={styles.headerContainer}>
                <View style={styles.leftHeaderContainer}>
                    <Text style={styles.logoText}>{this.props.title}</Text>
                </View>
            </View>
        );
    }
}
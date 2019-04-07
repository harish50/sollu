import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styles from "../Stylesheet/styleSheet";

export default class Header extends Component {

    render() {
        let day = this.props.item.text;
        let date = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let today = monthNames[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear();
        let YesterdayDate = date.getDate() - 1;
        let yesterday = monthNames[date.getMonth()] + " " + YesterdayDate + " " + date.getFullYear();
        if (day === today) {
            day = 'Today'
        }
        if (day === yesterday) {
            day = 'Yesterday'
        }
        return (
            <View style={styles.dayAlignment}>
                <Text style={styles.DayTextStyle}>{day}</Text>
            </View>
        );
    }
}
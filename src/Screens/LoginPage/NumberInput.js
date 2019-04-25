import React, {Component} from 'react'
import {Image, TextInput, View} from "react-native";
import styles from "./LoginStyles";

export default class NumberInput extends Component{
    render(){
        return(
            <View style={styles.contentContainer}>
                <Image source={require('../../../Icon/callerIcon3.png')}
                       style={styles.phoneIconContainer}/>
                <TextInput
                    style={styles.phoneNumberContainer}
                    placeholder="Enter phone number"
                    maxLength={10}
                    keyboardType='numeric'
                    value={this.props.phoneNumber}
                    onChangeText={this.props.setNumber}
                />
            </View>
        )
    }
}
import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from "react-native";
import styles from "./LoginStyles";

export default class LoginButton extends Component{
    render(){
        return(
            <View>
                <TouchableOpacity
                    style={[styles.loginButton, {backgroundColor: this.props.phoneNumber ? '#cc504e' : '#f49f8e'}]}
                    activeOpacity={.5}
                    disabled={!this.props.phoneNumber}
                    onPress={() => {
                        this.props.onLogin(this.props.phoneNumber)
                    }}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
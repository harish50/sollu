import React, {Component} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './LoginStyles';


export default class LoginView extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        phoneNumber: "",
    };
    setNumber=(number)=> {
        this.setState({
            phoneNumber: number.toString()
        });
    };



    render() {
        let {phoneNumber} = this.state;
        console.log("Login view render")
        return (
            <View style={styles.mainBox}>
                <View style={styles.contentContainer}>
                    <Image source={require('../../../Icon/callerIcon3.png')}
                           style={styles.phoneIconContainer}/>
                    <TextInput
                        style={styles.phoneNumberContainer}
                        placeholder="Enter phone number"
                        maxLength={10}
                        keyboardType='numeric'
                        value={phoneNumber}
                        onChangeText={this.setNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.loginButton, {backgroundColor: phoneNumber ? '#cc504e' : '#f49f8e'}]}
                        activeOpacity={.5}
                        disabled={!phoneNumber}
                        onPress={() => {
                            this.props.onLogin(phoneNumber)
                        }}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
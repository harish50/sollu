import React, {Component} from 'react';
import {View} from 'react-native';
import styles from './LoginStyles';
import NumberInput from "./NumberInput";
import LoginButton from "./LoginButton";


export default class LoginView extends Component {

    render() {
        return (
            <View style={styles.mainBox}>
                <NumberInput phoneNumber={this.props.phoneNumber} setNumber={this.props.setNumber}/>
                <LoginButton phoneNumber={this.props.phoneNumber} onLogin={this.props.onLogin}/>
            </View>
        );
    }
}
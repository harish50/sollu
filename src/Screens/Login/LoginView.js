import React, {Component} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from '../../../Stylesheet/LoginScreen';


class LoginView extends Component {

    state = {
        phoneNumber: "",
    };
    setNumber = (number) => {
        this.setState({
            phoneNumber: number
        });
    };

    render() {
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
                        value={this.state.phoneNumber}
                        onChangeText={this.setNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.loginButton, {backgroundColor: this.state.phoneNumber ? '#cc504e' : '#f49f8e'}]}
                        activeOpacity={.5}
                        disabled={!this.state.phoneNumber}
                        onPress={() => {
                            this.props.onLogin(this.state.phoneNumber)
                        }}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

export default LoginView;
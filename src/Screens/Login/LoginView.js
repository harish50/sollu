import React, {Component} from 'react';
import {Image, Text, TextInput, TouchableOpacity, View} from 'react-native';
import styles from './LoginStyles';


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
        let phNo = this.state.phoneNumber;
        let props = this.props;
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
                        value={phNo}
                        onChangeText={this.setNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.loginButton, {backgroundColor: phNo ? '#cc504e' : '#f49f8e'}]}
                        activeOpacity={.5}
                        disabled={!phNo}
                        onPress={() => {
                            props.onLogin(phNo)
                        }}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>

        );
    }
}

export default LoginView;
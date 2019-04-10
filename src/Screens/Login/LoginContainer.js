import React, {Component} from 'react';
import {View} from 'react-native';
import LoginView from "./LoginView"

class LoginContainer extends Component {

    constructor(props) {
        super(props)
    }

    handlePress = (phno) => {
     console.log("Hello Muruga")
    };
    render() {
            return (
                <View>
                <LoginView onLogin={this.handlePress} msg="hi"/>
                </View>
            );
    }
}

export default LoginContainer;
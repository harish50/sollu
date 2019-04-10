import React, {Component} from 'react';
import LoginView from "./LoginView"
import HeaderView from "../Header/HeaderView"
import {View} from "react-native";


class LoginContainer extends Component {

    constructor(props) {
        super(props)
    }

    handlePress = (phno) => {
        console.log(phno);
    };

    render() {
        return (
            <View>
                 <HeaderView/>
                <LoginView onLogin={this.handlePress}/>
            </View>
        );
    }
}

export default LoginContainer;
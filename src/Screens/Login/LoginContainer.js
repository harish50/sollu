import React, {Component} from 'react';
import LoginView from "./LoginView"
import {getUser, registerUser} from './LoginService'
import {setToAsync} from '../../Utility/AsyncUtility'

const ErrorMessage = {
    INVALID: "Invalid Phone Number"
};

class LoginContainer extends Component {

    constructor(props) {
        super(props)
    }

    onLogin = (phNo) => {
        if (this.isValidNumber(phNo)) {
            registerUser(phNo);
            setToAsync(phNo)
        }
        else {
            alert(ErrorMessage.INVALID)
        }

    };

    isValidNumber = (phNo) => {
        return phNo.length === 10;
    };

    render() {
        return (
            <LoginView onLogin={this.onLogin}/>
        );
    }
}

export default LoginContainer;
import React, {Component} from 'react';
import LoginView from "./LoginView"

class LoginContainer extends Component {

    constructor(props) {
        super(props)
    }

    handlePress = (phno) => {
        console.log(phno);
    };

    render() {
        return (
            <LoginView onLogin={this.handlePress}/>
        );
    }
}

export default LoginContainer;
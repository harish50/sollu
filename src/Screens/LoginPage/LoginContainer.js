import React, {Component} from 'react';
import LoginView from './LoginView';
import {Header} from "../Header/HeaderView";
import {NavigationActions, StackActions} from "react-navigation";
import {getFromLocalStorage, setToLocalStorage} from '../../Utilities/LocalStorage'
import {registerUser} from './LoginService'
import {CONSTANTS} from "../../Utilities/Constants";
import {isValid} from "./PhoneNumber";
import {Loading} from "../../Generics/Components/LoadingIndicator";

export default class LoginContainer extends Component {
    state = {
        isLoggingIn: true,
        phoneNumber: "",
    };
    navigateToHomePage = () => {
        this.props.navigation.dispatch(
            StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({
                    routeName: "HomeContainer"
                })]
            })
        )
    };
    setNumber = (phoneNumber) => {
        this.setState({
            phoneNumber: phoneNumber
        });
    };
    onLogin = (phoneNumber) => {
        if (isValid(phoneNumber)) {
            registerUser(phoneNumber).then((response) => {
                if (response) {
                    setToLocalStorage(CONSTANTS.PHONENUMBER, phoneNumber);
                    this.navigateToHomePage()
                }
                else {
                    alert(CONSTANTS.FAILED)
                }
            });
        }
        else {
            alert(CONSTANTS.INVALID)
        }
    };
    isLoggedIn = () => {
        return new Promise(async function (resolve, reject) {
            try {
                await getFromLocalStorage('PhoneNumber').then((phoneNumber) => {
                    phoneNumber ? resolve(true) : resolve(false)
                });
            } catch (e) {
                reject(e)
            }
        })
    };

    componentDidMount() {
        this.isLoggedIn().then((response) => {
            if (response) {
                this.navigateToHomePage()
            }
            else {
                this.setState({
                    isLoggingIn: false
                })
            }
        });
    }

    static navigationOptions = ({navigation}) => {
        return (Header("Sollu"))
    };

    render() {
        if (this.state.isLoggingIn) {
            return (
                <Loading message={"Please wait"}/>
            );
        }
        return (
            <LoginView
                onLogin={this.onLogin}
                setNumber={this.setNumber}
                phoneNumber={this.state.phoneNumber}/>
        );
    }

}
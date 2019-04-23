import React, {Component} from 'react';
import LoginView from './LoginView';
import {Header} from "../Header/HeaderView";
import {NavigationActions, StackActions} from "react-navigation";
import {getFromLocalStorage, setToLocalStorage} from '../../Utilities/LocalStorage'
import {registerUser} from './LoginService'
import {STRINGS} from "../../Utilities/StringsStore";
import {isValid} from "./PhoneNumber";
import LoadingIndicator from "./LoadingIndicator";

export default class LoginContainer extends Component {
    state = {
        isLoggedIn: true,
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
        console.log(phoneNumber);
        this.setState({
            phoneNumber: phoneNumber
        });
    };
    onLogin = (phoneNumber) => {
        if (isValid(phoneNumber)) {
            registerUser(phoneNumber);
            setToLocalStorage(STRINGS.PHONENUMBER, phoneNumber);
            this.navigateToHomePage()

        }
        else {
            alert(STRINGS.INVALID)
        }

    };
    isLoggedIn = async () => {
        await getFromLocalStorage('PhoneNumber').then((phoneNumber) => {
            if (phoneNumber) {
                this.navigateToHomePage()
            }
            else {
                this.setState({
                    isLoggedIn: false
                })
            }
        });
    };

    componentDidMount() {
        this.isLoggedIn();
    }

    static navigationOptions = ({navigation}) => {
        return (Header("Sollu"))
    };

    render() {
        if (this.state.isLoggedIn) {
            return (
                <LoadingIndicator/>
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
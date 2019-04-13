import React, {Component} from 'react';
import LoginView from './LoginView';
import {ActivityIndicator, View} from "react-native";
import styles from "../../../Stylesheet/styleSheet";
import {Header} from "../Header/HeaderView";
import {NavigationActions, StackActions} from "react-navigation";
import {getFromLocalStorage, setToLocalStorage} from '../../Utilities/LocalStorage'
import {registerUser} from '../../Utilities/Firebase'
import {STRINGS} from "../../Utilities/StringsStore";
import {isValid} from "../../Utilities/PhoneNumber";

class LoginContainer extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        isLoggedIn: true
    }
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
                <View style={styles.loadingIcon}>
                    <ActivityIndicator size="large" color="#cc504e"/>
                </View>
            );
        }
        return (
            <LoginView onLogin={this.onLogin}/>
        );
    }

}

export default LoginContainer;
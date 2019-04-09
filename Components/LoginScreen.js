import React, {Component} from 'react';
import {View, TextInput, TouchableOpacity, Text, Image, AsyncStorage, StatusBar} from 'react-native';
import styles from "../Stylesheet/LoginScreen";
import firebase from '../firebase/firebase';
import {NavigationActions, StackActions} from 'react-navigation';

class LoginScreen extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        phoneNumber: "",
    };

    componentDidMount() {
        //Differentiation between users taking phone number as primary key
        AsyncStorage.getItem('phoneNumber').then((value) => {
            this.setState({phoneNumber: value, is_fetching_done: true});
            if (value.length > 1) {
                this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: "HomeScreen",
                            params: {sender: this.state.phoneNumber}
                        })]
                    })
                );
            }
        });
    }

    validNumber = (number) => {
        this.setState({
            phoneNumber: number
        });
    };

    handlePress = () => {
        if(this.state.phoneNumber.length === 10){
            AsyncStorage.setItem('phoneNumber', this.state.phoneNumber).then(
                this.props.navigation.dispatch(
                    StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({
                            routeName: "HomeScreen",
                            params: {sender: this.state.phoneNumber}
                        })]
                    })
                )
            );
            //Storing into firebase as a registered user
            let db = firebase.database();
            let taskRef = db.ref('registeredUsers');
            taskRef.once('value', (registeredUsers) => {
                if (!registeredUsers.hasChild(this.state.phoneNumber)) {
                    taskRef.child(this.state.phoneNumber).set('done');
                }
            });
            let userInfoRef = db.ref('registeredUserProfileInfo');
            userInfoRef.once('value', (userInfo) => {
                if (!userInfo.hasChild(this.state.phoneNumber)) {
                    userInfoRef.child(this.state.phoneNumber).set('done');
                }
            });
            this.props.navigation.navigate("HomeScreen", {sender: this.state.phoneNumber});
        }
        else{
            console.log("less digits")
            alert("Invalid Phone Number")
        }
    };
    static navigationOptions = ({navigation}) => {
        return (
            {
                headerTitle: "Sollu",
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e',
                },
                headerTitleStyle: {
                    textAlign: "left",
                    flex: 1
                }
            }
        );
    };

    render() {
        if (!this.state.is_fetching_done) {
            return (
                <StatusBar
                    backgroundColor="blue"
                    barStyle="light-content"
                />
            );
        }
        return (
            <View style={styles.mainBox}>
                <View style={styles.contentContainer}>
                    <Image source={require('../Icon/callerIcon3.png')}
                           style={styles.phoneIconContainer}/>
                    <TextInput
                        style={styles.phoneNumberContainer}
                        placeholder="Enter phone number"
                        maxLength={10}
                        keyboardType='numeric'
                        value={this.state.phoneNumber}
                        onChangeText={this.validNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.loginButton, {backgroundColor: this.state.phoneNumber ? '#cc504e' : '#f49f8e'}]}
                        activeOpacity={.5}
                        disabled={!this.state.phoneNumber}
                        onPress={this.handlePress}>
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default LoginScreen;
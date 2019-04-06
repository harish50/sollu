import React, {Component} from 'react';
import {View, TextInput, TouchableOpacity, Text, Image, AsyncStorage, StatusBar} from 'react-native';
import styles from "../Stylesheet/styleSheet";
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
        //Differentiation between users is depending on phoneNumber and Primary key is phoneNumber
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
        //AsyncStorage used as local storage for app
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
        //Storing user into firebase as a registered user
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
        //navigating to home screen once loging is done
        this.props.navigation.navigate("HomeScreen", {sender: this.state.phoneNumber});
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
                <View style={styles.SectionStyle}>
                    <Image source={require('../Icon/callerIcon3.png')}
                           style={[styles.imageStyle]}/>
                    <TextInput
                        style={styles.TextContainer}
                        placeholder="Enter phone number"
                        maxLength={10}
                        keyboardType='numeric'
                        value={this.state.phoneNumber}
                        // onChangeText={this.validNumber}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: this.state.phoneNumber ? '#cc504e' : '#f49f8e'}]}
                        activeOpacity={.5}
                        disabled={!this.state.phoneNumber}
                        onPress={this.handlePress}>
                        <Text style={styles.text}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default LoginScreen;
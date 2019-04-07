import React, { Component } from 'react';
import { View, TouchableOpacity,ActivityIndicator } from 'react-native';
import firebase from '../firebase/firebase';
import FastImage from 'react-native-fast-image';
import styles from "../Stylesheet/ProfileScreen";


let REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
export default class Profile extends Component {

    state = {
        isProfilePicSet: false,
        profilePic: "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3",
    }
    onClickProfilePic = () => {
        if (typeof this.props.navigation !== 'undefined') {
            this.props.navigation.navigate('ProfilePage', { phoneNum: this.props.sender });
        }
    }
    async componentDidMount() {
        let phoneNum = this.props.sender;
        let user;
        let user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3";
        REGISTERED_USER_PROFILE_INFO.child(phoneNum).on('value', (registeredUserProfileInfo) => {
            user = registeredUserProfileInfo.val();
            if (user) {
                if ((typeof user.imageURL === 'undefined' && typeof user.Gender === 'undefined')) {
                    user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3"
                } else if (user.imageURL) {
                    user_pic = user.imageURL
                } else if (user.Gender) {
                    if (user.Gender === "Male") {
                        user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FMale-profile-icon-red.png?alt=media&token=3e48646e-25ae-43a4-8e2e-f7e2255e18cf";
                    }
                    else if (user.Gender === "Female") {
                        user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FFemale-profile-icon-.png?alt=media&token=c553bc7c-4bc7-48b9-9026-a50591356bfd";
                    }
                    else if (user.Gender === "Select Gender") {
                        user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3"
                    }
                }
            };
            this.setState({
                isProfilePicSet: true,
                profilePic: user_pic
            });
        });
    }
    render() {
        if (!this.state.isProfilePicSet) {
            return (<View style={styles.loadingIcon}>
                <ActivityIndicator size="large" color='#cc504e' />
            </View>
            );
        } else {
            return (
                <View>
                    <TouchableOpacity onPress={this.onClickProfilePic}>
                        <FastImage style={styles.profileIconContainer} source={{ uri: this.state.profilePic }} />
                    </TouchableOpacity>
                </View>
            )
        }
    }
}
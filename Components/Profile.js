import React, { Component } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import firebase from '../firebase/firebase';


export default class Profile extends Component {
    state = {
        isProfilePicSet: false,
        profilePic: "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3",
    }
    handleProfilePress = () => {
        this.props.navigation.navigate('ProfilePage', { phoneNo: this.props.sender });
    }
    async componentDidMount() {
        let imageRef = firebase.database().ref('registeredUserProfileInfo');
        let phoneNo = this.props.sender;
        let user;
        let user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3";
        imageRef.child(phoneNo).on('value', (registeredUserProfileInfo) => {
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
        return (
            <View>
                <TouchableOpacity onPress={this.handleProfilePress}>
                    <Image style={styles.profileIcon} source={{ uri: this.state.profilePic }} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        profileIcon: {
            alignSelf: 'center',
            borderColor: "black",
            backgroundColor: "#eee",
            borderRadius: 25,
            width: 50,
            height: 50,
            marginRight: 10
        }
    }
)
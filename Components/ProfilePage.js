import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import ImagePicker from "react-native-image-picker";
import FastImage from 'react-native-fast-image'
import firebase from "../firebase/firebase";
import RNFetchBlob from 'react-native-fetch-blob';
import { Picker } from 'react-native-picker-dropdown'
import styles from "../Stylesheet/ProfileScreen";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

let phoneNum = null;
let user_pic = '';
let REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
let options = {
    title: "Profile Photo  ",
    maxWidth: 800,
    maxHeight: 600,
    storageOptions: {
        path: 'sourceImages',
    },
};


export default class ProfilePage extends Component {

    state = {
        image_uri: "",
        gender: "Select Gender",
        isProfileSet: false
    };

    static navigationOptions = () => {
        return (
            {
                headerTitle: 'Profile',
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e'
                }
            }
        );
    };

    componentWillMount() {
        phoneNum = this.props.navigation.getParam("phoneNum");
        REGISTERED_USER_PROFILE_INFO.child(phoneNum).on('value', (snapshot) => {
            let user = snapshot.val();
            let gender = user !== null ? user.Gender : "Select Gender";
            gender = typeof gender !== 'undefined' ? gender : "Select Gender";
            if (user !== null) {
                if ((typeof user.imageURL === 'undefined' && typeof user.Gender === 'undefined')) {
                    user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3"
                } else if (user.imageURL) {
                    user_pic = user.imageURL
                } else if (typeof user.Gender !== 'undefined') {
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
            }
            this.setState({
                gender: gender,
                image_uri: user_pic,
                isProfileSet: true
            });
        })
    }

    uploadImage(imageURI, fileName, mime = 'image/jpeg') {
        return new Promise((resolve, reject) => {
            let uploadBlob = null;
            const uploadUri = Platform.OS === 'ios' ? imageURI.replace('file://', '') : imageURI;
            const imageRef = firebase.storage().ref('images').child(fileName);
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64` })
                })
                .then((blob) => {
                    uploadBlob = blob;
                    this.setState({
                        isProfileSet: false
                    });
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close();
                    imageRef.getDownloadURL().then((url) => {
                        REGISTERED_USER_PROFILE_INFO.child(phoneNum).child('imageURL').set(url);
                    });
                })
                .catch((error) => {
                    console.log(" reject error occured")
                })
        })

    }

    pickImageHandler() {
        ImagePicker.showImagePicker(options, (responce) => {
            if (responce.didCancel) {
                console.log("User cancelled!");
            } else if (responce.error) {
                console.log("Error");
            } else {
                this.uploadImage(responce.uri, responce.fileName)
                    .catch(error => console.log("Replace error from pickImage Handler"));
            }
        });
    }

    genderChange = (itemValue) => {
        REGISTERED_USER_PROFILE_INFO.child(phoneNum).child('Gender').set(itemValue);
    };

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.imageContainer}>
                        {(!this.state.isProfileSet) ? <View style={styles.iconPlaceholder}>
                            <ActivityIndicator size="large" color='#cc504e' style={styles.loadingPosition} />
                        </View> :
                            <TouchableOpacity onPress={this.pickImageHandler.bind(this)}>
                                <FastImage style={styles.iconPlaceholder} source={{ uri: this.state.image_uri }} />
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={this.state.gender}
                            onValueChange={this.genderChange}
                            style={styles.pickerContainer}
                            textStyle={styles.pickerContainerText}>
                            <Picker.Item label="Select Gender" value="Select Gender" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>
            </View>
        );
    }
}
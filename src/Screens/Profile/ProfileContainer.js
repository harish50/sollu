import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {getFromLocalStorage} from "../../Utilities/LocalStorage";
import {ProfileIcons} from "../../Utilities/ProfileDefaultIconsStore";
import {Platform} from "react-native";
import firebase from "../../../firebase/firebase";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender} from "./ProfileService";

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
let options = {
    title: "Profile Photo  ",
    maxWidth: 800,
    maxHeight: 600,
    storageOptions: {
        path: 'sourceImages',
    },
};
const REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
export default class ProfileContainer extends Component{
    state = {
        image_uri:ProfileIcons.GENERALICON,
        isProfilePicSet : false,
        gender:''
    }
    componentDidMount(){

        this.setState({
            isProfilePicSet:true,
            image_uri:ProfileIcons.GENERALICON,
        });
    }
    setGender = (gender) => {
        changeGender(gender)
        this.setState({
            gender:gender
        })
    }

    uploadImage = (imageURI, fileName, mime = 'image/jpeg') => {
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
                    // this.setState({
                    //     isProfileSet: false
                    // });
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close();
                    // imageRef.getDownloadURL().then((url) => {
                    //     REGISTERED_USER_PROFILE_INFO.child(phoneNum).child('imageURL').set(url);
                    // });
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
                console.log("After catch")
            }
        });
    }
    render() {
        return (
            <ProfileView image_uri={this.state.image_uri} isProfilePicSet={this.state.isProfilePicSet} setGender={this.setGender} gender={this.state.gender} pickImageHandler={this.pickImageHandler}/>
        )
    }
}
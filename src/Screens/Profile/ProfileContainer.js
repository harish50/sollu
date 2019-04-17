import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {getFromLocalStorage} from "../../Utilities/LocalStorage";
import {PROFILEICONS} from "./ProfileStore";
import {Platform} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender, setProfileURL, storeImage} from "./ProfileService";

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
export default class ProfileContainer extends Component{
    state = {
        image_uri:'',
        isProfilePicSet : false,
        gender:'',
    }
    componentDidMount(){
        this.setState({
            isProfilePicSet:true,
            image_uri:PROFILEICONS.GENERALICON,
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
            let imageRef =  storeImage(fileName);
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
                    imageRef.getDownloadURL().then((url) => {
                    setProfileURL(url)
                    });
                })
                .catch((error) => {
                    console.log(" reject error occured")
                })
        })

    }

    pickImageHandler = ()  => {
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
    render() {
        return (
            <ProfileView image_uri={this.state.image_uri} setGender={this.setGender} gender={this.state.gender} pickImageHandler={this.pickImageHandler}/>
        )
    }
}
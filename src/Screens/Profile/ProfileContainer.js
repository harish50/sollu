import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {PROFILEICONS} from "./ProfileStore";
import {Platform} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender, ProfileInfo, setProfileURL, storeImage} from "./ProfileService";
import _ from 'lodash'

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
        profile_pic:'',
        isProfilePicSet : false,
        userGender:'',
    }
    componentDidMount() {
        this.setProfilePic()
    }
    setProfilePic = () => {
        let profile_pic = ''
        ProfileInfo().then((profileInfo) => {
            let userGender = profileInfo !== null ? profileInfo.userGender : "Select Gender"
            userGender = _.isUndefined(userGender) ? "Select Gender" : userGender
            if(_.isUndefined(profileInfo.imageURLdb)){
                switch (userGender) {
                    case 'Female':
                        profile_pic = PROFILEICONS.FEMALEICON
                        break;
                    case 'Male':
                        profile_pic = PROFILEICONS.MALEICON
                        break;
                }
            }else
                profile_pic = profileInfo.imageURLdb
            this.setState({
                isProfilePicSet:true,
                profile_pic:profile_pic,
                userGender:userGender
            });
            })
    }
    setGender = (gender) => {
        changeGender(gender)
        this.setProfilePic()
        this.setState({
            userGender:gender
        })
    }

    uploadImage = (imageURI, fileName, mime = 'image/jpeg') => {
        return new Promise((resolve, reject) => {
            let uploadBlob = null;
            const uploadUri = Platform.OS === 'ios' ? imageURI.replace('file://', '') : imageURI;
            let imageRef =  storeImage(fileName);
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, { type: `${mime};BASE64`})
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
                        this.setState({
                            profile_pic:url
                        })
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
            <ProfileView profile_pic={this.state.profile_pic} setGender={this.setGender} gender={this.state.userGender} pickImageHandler={this.pickImageHandler}/>
        )
    }
}
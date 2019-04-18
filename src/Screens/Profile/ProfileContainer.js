import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {GENDER, PROFILEICONS} from "./ProfileStore";
import {Platform} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender, ProfileInfo, setProfileURL, storeImage} from "./ProfileService";
import _ from 'lodash'
import {Header} from "../Header/HeaderView";

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
        ProfileInfo().then((profileInfo) => {
            let profile_pic = ''
           let userGender = _.isUndefined(profileInfo.userGender) ? "Select Gender" : profileInfo.userGender
            if(_.isUndefined(profileInfo.imageURLdb)){
                switch (userGender) {
                    case GENDER.FEMALE:
                        profile_pic = PROFILEICONS.FEMALEICON
                        break;
                    case GENDER.MALE:
                        profile_pic = PROFILEICONS.MALEICON
                        break;
                    case GENDER.SELECTGENDER:
                        profile_pic = PROFILEICONS.GENERALICON
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
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;
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
                    this.setState({
                        isProfilePicSet: false
                    });
                    return imageRef.put(blob, { contentType: mime })
                })
                .then(() => {
                    uploadBlob.close();
                    imageRef.getDownloadURL().then((url) => {
                    setProfileURL(url)
                        this.setState({
                            profile_pic:url,
                            isProfilePicSet: true
                        })
                    });
                })
                .catch((error) => {
                    console.log(" reject error occured")
                })
        })

    }

    pickImageHandler = ()  => {
        let options = {title: "Profile Photo", maxWidth: 800, maxHeight: 600, storageOptions: { path: 'sourceImages'}};
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

    static navigationOptions = ({navigation}) => {
        return (
            Header("Sollu")
        )
    };

    render() {
        let props = {setGender:this.setGender, gender:this.state.userGender, profile_pic:this.state.profile_pic, isProfilePicSet:this.state.isProfilePicSet}
        return (
            <ProfileView {...props} pickImageHandler={this.pickImageHandler}/>
        )
    }
}
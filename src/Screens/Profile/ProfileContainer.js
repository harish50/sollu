import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {Platform} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender,setProfileURL, storeImage} from "./ProfileService";
import {Header} from "../Header/HeaderView";
import {HeaderBackButton} from "react-navigation";
import {ProfilePicFetch} from "./ProfilePicFetch";


export default class ProfileContainer extends Component{

    state = {
        profile_pic:'',
        isProfilePicSet : false,
        userGender:'',
    }

    componentDidMount() {
        this.setProfilePic()
    }

    setProfilePic = async () => {
        await ProfilePicFetch().then((props) => {
            this.setState({
                isProfilePicSet: true,
                profile_pic: props.profile_pic,
                userGender:props.userGender
            });
        })
    }

    changeGenderandsetProfile = (gender) => {
        changeGender(gender)
        this.setProfilePic()
        this.setState({
            userGender:gender
        })
    }

    updateImage = (imageURI, fileName, mime = 'image/jpeg') => {
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
    changeProfilePic = ()  => {
        let options = {title: "Profile Photo", maxWidth: 800, maxHeight: 600, storageOptions: { path: 'sourceImages'}};
        ImagePicker.showImagePicker(options, (responce) => {
            if (!responce.didCancel && !responce.error) {
                this.updateImage(responce.uri, responce.fileName)
                    .catch(error => console.log("Replace error from pickImage Handler"));
            }
        });
    }


    static navigationOptions = ({navigation}) => {
        const headerLeft = <HeaderBackButton tintColor="white" onPress={() => {
            navigation.state.params.onGoBack();
            navigation.goBack();
        }}/>;
        return (Header("Sollu",headerLeft,null))
    };

    render() {
        let props = {setGender:this.changeGenderandsetProfile, gender:this.state.userGender, profile_pic:this.state.profile_pic, isProfilePicSet:this.state.isProfilePicSet}
        return (
            <ProfileView {...props} changeProfilePic={this.changeProfilePic}/>
        )
    }
}
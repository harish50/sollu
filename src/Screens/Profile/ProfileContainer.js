import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {Platform, AsyncStorage} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "react-native-fetch-blob";
import {changeGender,setProfileURL, storeImage} from "./ProfileService";
import {Header} from "../Header/HeaderView";
import {HeaderBackButton} from "react-navigation";
import {ProfilePicFetch} from "./ProfilePicFetch";


export default class ProfileContainer extends Component{

    state = {
        profilePic:'',
        isProfilePicSet : false,
        userGender:'',
    }

    componentDidMount() {
        this.setProfilePic()
    }

    setProfilePic = async () => {
        let user = await AsyncStorage.getItem('PhoneNumber')
        await ProfilePicFetch(user).then((props) => {
            this.setState({
                isProfilePicSet: true,
                profilePic: props.profilePic,
                userGender:props.userGender
            });
        })
    }

    changeGenderandSetProfile = (gender) => {
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
            storeImage(fileName).then((response) => {
                if(response){
                    fs.readFile(uploadUri, 'base64')
                    .then((data) => {
                        return Blob.build(data, { type: `${mime};BASE64`})
                    })
                    .then((blob) => {
                        uploadBlob = blob;
                        this.setState({
                            isProfilePicSet: false
                        });
                        return response.put(blob, { contentType: mime })
                    })
                    .then(() => {
                        uploadBlob.close();
                        response.getDownloadURL().then((url) => {
                            setProfileURL(url)
                            this.setState({
                                profilePic:url,
                                isProfilePicSet: true
                            })
                        });
                    })
                    .catch((error) => {
                        error;
                    })}
            })
        })
    }
    changeProfilePic = ()  => {
        let options = {title: "Profile Photo", maxWidth: 800, maxHeight: 600, storageOptions: { path: 'sourceImages'}};
        ImagePicker.showImagePicker(options, (responce) => {
            if (!responce.didCancel && !responce.error) {
                this.updateImage(responce.uri, responce.fileName)
                    .catch(error => error);
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
        let props = {setGender:this.changeGenderandSetProfile, gender:this.state.userGender, profilePic:this.state.profilePic, isProfilePicSet:this.state.isProfilePicSet}
        return (
            <ProfileView {...props} changeProfilePic={this.changeProfilePic}/>
        )
    }
}
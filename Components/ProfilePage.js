import React, { Component } from 'react';
import {Text, View, Image, TouchableOpacity,Platform} from 'react-native';
import ImagePicker from "react-native-image-picker";
import firebase from "../firebase/firebase";
import RNFetchBlob from 'react-native-fetch-blob';
import { Picker } from 'react-native-picker-dropdown'
import styles from "../Stylesheet/profilePageStyle";

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
var options = {
    title : "Profile Photo  ",
    maxWidth: 800,
    maxHeight: 600,
    storageOptions: {
        path: 'sourceImages',
    },
};
export default class Profile extends Component {
    state = {
        image_uri: null,
        gender : '',
        isProfileSet : false
    };
    componentDidMount() {
        let user_pic = '';
        let db = firebase.database();
        let phoneNo = this.props.navigation.getParam("phoneNo")
        console.log(phoneNo)
        let profileimageRef = db.ref('registeredUserProfileInfo').child(phoneNo)
        profileimageRef.on('value', (snapshot) => {
            let user = snapshot.val();
            let newGender = '';
            if(user){
                if((typeof user.imageURL==='undefined' && typeof user.Gender === 'undefined')){
                    alert("It seems like you didn't set your profile yet, Please set it.");
                    user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3"
                }else if(user.imageURL){
                    user_pic = user.imageURL
                }else if(user.Gender){
                    if(user.Gender === "Male") {
                        user_pic= "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FMale-profile-icon-red.png?alt=media&token=3e48646e-25ae-43a4-8e2e-f7e2255e18cf";
                    }
                    else if( user.Gender === "Female"){
                        user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FFemale-profile-icon-.png?alt=media&token=c553bc7c-4bc7-48b9-9026-a50591356bfd";
                    }
                    else if(user.Gender === "Select Gender"){
                        user_pic = "https://firebasestorage.googleapis.com/v0/b/chatbox-992a8.appspot.com/o/images%2FgeneralUserIcon.png?alt=media&token=5aca0ddf-29f1-48f8-aa7d-78996b5a81a3"
                    }
                }
            }
            this.setState({
                gender: user.Gender,
                image_uri: user_pic,
                isProfileSet : true
            });
            }
        )
    }
        uploadImage(uri, fileName,mime = 'image/jpeg')
        {
            return new Promise((resolve, reject) => {
                let imageURI = uri;
                let uploadBlob = null;
                const uploadUri = Platform.OS === 'ios' ? imageURI.replace('file://', '') : imageURI
                const imageRef = firebase.storage().ref('images').child(fileName);
                fs.readFile(uploadUri, 'base64')
                    .then((data) => {
                        return Blob.build(data, {type: `${mime};BASE64`})
                    })
                    .then((blob) => {
                        uploadBlob = blob
                        return imageRef.put(blob, {contentType: mime})
                    })
                    .then(() => {
                        uploadBlob.close();
                        imageRef.getDownloadURL().then((url) => {
                            let db = firebase.database();
                            let profileimageRef = db.ref('registeredUserProfileInfo')
                            let phoneNo = this.props.navigation.getParam("phoneNo")
                            profileimageRef.child(phoneNo).child('imageURL').set(url);
                            console.log("sd : " +url)
                        });
                    })
                    .catch((error) => {
                        reject(error)
                    })
                    })

        }
        pickImageHandler(){
            ImagePicker.showImagePicker(options, (responce) => {
                if (responce.didCancel) {
                    console.log("User cancelled!");
                } else if (responce.error) {
                    console.log("Error", responce.error);
                } else {
                    this.uploadImage(responce.uri,responce.fileName)
                        .then(url => {
                            this.setState({
                                image_uri: responce.uri
                            })
                        })
                        .catch(error => console.log(error))
                }
            });
        }
    genderChange = (itemValue) => {
        let phoneNo = this.props.navigation.getParam("phoneNo");
        let db = firebase.database();
        const  selectedImage = db.ref('registeredUserProfileInfo').child(phoneNo).child('Gender');
        selectedImage.set(itemValue);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.leftHeaderContainer}>
                        <Text style={styles.logoText}>{"Profile"}</Text>
                    </View>
                </View>
                <View>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity  onPress={this.pickImageHandler.bind(this)}>
                                <Image style={styles.placeholder} source={{uri : this.state.image_uri}}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dropdowncontainer}>
                        <Picker
                            selectedValue={this.state.gender}
                            onValueChange={this.genderChange}
                            style={styles.picker}
                            textStyle={styles.pickerText}>
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
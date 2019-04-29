import firebase from '../../../Firebase/firebase';
import {getNameFromLocalStorage} from "../../Utilities/LocalStorage";
import _ from 'lodash'
import {AsyncStorage} from 'react-native'

const REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
export const changeGender = async (gender) => {
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO.child(phoneNumber).child('Gender').set(gender);
}

export const storeImage = (fileName) => {
    return new Promise(function(resolve,reject){
        try{
            const storageRef = firebase.storage().ref('profilePics').child(fileName)
            resolve(storageRef)
        }catch (e) {
          reject(e)
        }
    })
}

export const setProfileURL = async (url) =>{
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO.child(phoneNumber).child('imageURL').set(url);
}

export const ProfileInfo = (user) => {
    return new Promise(async function (resolve, reject) {
        try {
            REGISTERED_USER_PROFILE_INFO.child(user).on('value', (snap) => {
                if (_.isUndefined(snap.val())) {
                    resolve(null)
                }
                else {
                    resolve(snap.val())
                }
            })
        } catch (e) {
            reject(e)
        }
    })

};


import firebase from '../../../firebase/firebase';
import {getNameFromLocalStorage} from "../../Utilities/LocalStorage";
import _ from 'lodash'
import {AsyncStorage} from 'react-native'

const REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
export const changeGender = async (gender) => {
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO.child(phoneNumber).child('Gender').set(gender);
}

export const storeImage = (fileName) => {
    return firebase.storage().ref('profilePics').child(fileName);
}

export const setProfileURL = async (url) =>{
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO.child(phoneNumber).child('imageURL').set(url);
}

export const ProfileInfo = () => {
    return new Promise(async function (resolve, reject) {
        try {
            let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
            REGISTERED_USER_PROFILE_INFO.child(phoneNumber).on('value', (snap) => {
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


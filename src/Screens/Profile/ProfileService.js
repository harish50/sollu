import firebase from '../../../firebase/firebase';
import {getNameFromLocalStorage} from "../../Utilities/LocalStorage";
import _ from 'lodash'

const REGISTERED_USER_PROFILE_INFO = firebase.database().ref("registeredUserProfileInfo");
export const changeGender = (gender) => {
    // let phoneNumber = getNameFromLocalStorage('PhoneNumber'); //during refactor do this
    REGISTERED_USER_PROFILE_INFO.child('9505517958').child('userGender').set(gender);
}

export const storeImage = (fileName) => {
    return firebase.storage().ref('profilePics').child(fileName);
}

export const setProfileURL = (url) =>{
    REGISTERED_USER_PROFILE_INFO.child('9505517958').child('imageURLdb').set(url);
}

export const ProfileInfo = () => {
    return new Promise(function(resolve,reject){
        try{
            REGISTERED_USER_PROFILE_INFO.child('9505517958').on('value', (snap) =>{
                if (_.isUndefined(snap.val())) {
                    resolve(null)
                }
                else {
                    resolve(snap.val())
                }
        })
        }catch (e) {
            reject(e)
        }
    })
};
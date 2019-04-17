import firebase from '../../../firebase/firebase';
import {getNameFromLocalStorage} from "../../Utilities/LocalStorage";

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
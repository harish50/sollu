import firebase from '../../../firebase/firebase';
import {getNameFromLocalStorage} from "../../Utilities/LocalStorage";

export const changeGender = (gender) => {
    // let phoneNumber = getNameFromLocalStorage('PhoneNumber'); //during refactor do this
    firebase.database().ref("registeredUserProfileInfo").child('9505517958').child('userGender').set(gender);
}
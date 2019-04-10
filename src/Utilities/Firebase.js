import firebase from '../../firebase/firebase';
import {STRINGS} from "./StringsStore";

const usersRef = firebase.database().ref('Users');
export const registerUser = async (phoneNumber) => {
    usersRef.once('value', (registeredUsers) => {
        if (!registeredUsers.hasChild(phoneNumber)) {
            usersRef.child(phoneNumber).set(STRINGS.REGISTERED)
                .catch((error) => {
                    return error
                });
        }
    }).catch((error) => {
        return error
    });
};

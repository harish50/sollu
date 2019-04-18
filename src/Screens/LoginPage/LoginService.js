import firebase from '../../../firebase/firebase';
import {STRINGS} from "../../Utilities/StringsStore";

const dbRef = firebase.database();
const usersRef = dbRef.ref('registeredUsers');
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

import firebase from '../../../firebase/firebase';
import {STRINGS} from "../../Utilities/StringsStore";

const dbRef = firebase.database();
const usersRef = dbRef.ref('registeredUsers');
export const registerUser = async (phoneNumber) => {
    console.log("register User")
    usersRef.once('value', (registeredUsers) => {
        if (!registeredUsers.hasChild(phoneNumber)) {
            usersRef.child(phoneNumber).set(STRINGS.REGISTERED)
                .catch((error) => {
                    console.log("Catching inside")
                    return error
                });
        }
    }).catch((error) => {
        console.log("Catching outisde")
        return error
    });
};

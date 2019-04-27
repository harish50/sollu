import firebase from '../../../firebase/firebase';
import {CONSTANTS} from "../../Utilities/Constants";

const dbRef = firebase.database();
const usersRef = dbRef.ref('registeredUsers');
export const registerUser = async (phoneNumber) => {
    return new Promise(function (resolve, reject) {
        try {
            usersRef.once('value', (registeredUsers) => {
                if (!registeredUsers.hasChild(phoneNumber)) {
                    usersRef.child(phoneNumber).set(CONSTANTS.REGISTERED);
                    resolve(true)
                }
                else{
                    resolve(true)
                }
            })
        } catch (e) {
            reject(e)
        }
    })

};

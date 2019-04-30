import firebase from "../../../Firebase/firebase";
import _ from 'lodash'
import {AsyncStorage} from 'react-native'

const dbRef = firebase.database();
let REGISTERED_USER_PROFILE_INFO_REF = dbRef.ref("registeredUserProfileInfo");
export const getData = (path) => {
    return new Promise(function (resolve, reject) {
        try {
            dbRef.ref(path).once('value', (data) => {
                if (_.isUndefined(data)) {
                    resolve(null)
                }
                else {
                    resolve(data)
                }
            })
        } catch (e) {
            reject(e)
        }
    })
};

export const saveLocalContactNamesInDB = async (localContacts) => {
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO_REF.child(phoneNumber).child("LocalContacts").child(phoneNumber).set("You");
    let localContactsRef = REGISTERED_USER_PROFILE_INFO_REF.child(phoneNumber).child("LocalContacts");
    localContactsRef.once("value", (contactsFromDb) => {
        _.each(localContacts, function (contact) {
            if (!contactsFromDb.hasChild(contact.key)) {
                localContactsRef.child(contact.key).set(contact.name);
            }
        })
    })
};
import React from 'react'
import Contacts from "react-native-contacts";
import {PermissionsAndroid} from "react-native";
import {getData} from "./HomeService";
import _ from 'lodash'

export const requestContactsPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
        return false;
    }
};

export const getSolluContacts = () => {
    return new Promise(function (resolve, reject) {
        try {
            console.log("getSolluContacts")
            let solluContacts = [];
            Contacts.getAll( (err, contacts) => {
                if (!err) {
                    // let selfNumber = getFromLocalStorage("PhoneNumber")
                    // solluContacts.push({
                    //     key: selfNumber,
                    //     name: "You",
                    // });
                    // console.log("check self num");
                    // console.log(solluContacts)
                    getData("registeredUsers").then((registeredUsers) => {
                        console.log("Registedred users : ");
                        console.log(registeredUsers)
                        _.each(contacts, function (contact) {
                            let phoneNumber = trim(contact);
                            if (phoneNumber && registeredUsers.hasChild(phoneNumber)) {
                                solluContacts.push({
                                    key: phoneNumber,
                                    name: contact.givenName
                                });
                            }
                        });
                        console.log("Unique");
                        solluContacts = _.uniqBy(solluContacts, 'key');
                        resolve(solluContacts)
                    });
                }
                else {
                    console.log("Error here");
                    console.log(err)
                    throw err;
                }
            })
        } catch (e) {
            console.log("Catch here")
            reject(e)
        }
    })
};

const trim = (contact) => {
    if (contact.phoneNumbers.length !== 0) {
        let trimmedPhoneNumber = contact.phoneNumbers[0].number.replace(/\D/g, "");
        if (trimmedPhoneNumber.length === 12) {
            trimmedPhoneNumber = trimmedPhoneNumber.substring(2);
        }
        return trimmedPhoneNumber;
    }
    return false
};
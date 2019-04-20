import React from 'react'
import Contacts from "react-native-contacts";
import {AsyncStorage, PermissionsAndroid} from "react-native";
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
            let solluContacts = [];
            Contacts.getAll(async (err, contacts) => {
                if (!err) {
                    let selfNumber = await AsyncStorage.getItem("PhoneNumber")
                    solluContacts.push({
                        key: selfNumber,
                        name: "You",
                    });
                    getData("registeredUsers").then((registeredUsers) => {
                        _.each(contacts, function (contact) {
                            let phoneNumber = trim(contact);
                            if (phoneNumber && registeredUsers.hasChild(phoneNumber)) {
                                solluContacts.push({
                                    key: phoneNumber,
                                    name: contact.givenName
                                });
                            }
                        });
                        resolve(_.uniqBy(solluContacts, 'key'))
                    });
                }
            })
        } catch (e) {
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

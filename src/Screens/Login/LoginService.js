import React from "react";
import firebase from '../../../firebase/firebase';

const USERS = firebase.database().ref('Users');
export const registerUser = (phnum) => {

    USERS.once('value', (registeredUsers) => {
        if (!registeredUsers.hasChild(phnum)) {
            USERS.child(phnum).set('Registered Successfully')
                .catch((error) => {
                    return error
                });
        }
    }).catch((error) => {
        return error
    });
};

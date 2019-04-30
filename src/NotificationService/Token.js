import React from 'react'
import {AsyncStorage} from "react-native";
import Firebase from "react-native-firebase";
import firebase from "../../Firebase/firebase";

let REGISTERED_USER_PROFILE_INFO_REF = firebase.database().ref("registeredUserProfileInfo");
export const getToken = () => {
    return new Promise(async function (resolve, reject) {
        try {
            let fcmToken = await AsyncStorage.getItem("fcmToken");
            if (!fcmToken) {
                fcmToken = await Firebase.messaging().getToken();
                if (fcmToken) {
                    await AsyncStorage.setItem("fcmToken", fcmToken);
                }
            }
            resolve(fcmToken)
        } catch (e) {
            reject(e)
        }
    })

};

export const setToken = async (fcmToken) => {
    let user = await AsyncStorage.getItem('PhoneNumber');
    REGISTERED_USER_PROFILE_INFO_REF.child(user).child("pushToken").set(fcmToken);
}
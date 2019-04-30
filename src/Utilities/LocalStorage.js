import React from "react";
import {AsyncStorage} from "react-native";

export const setToLocalStorage =  (key, value) => {
    return new Promise(async function (resolve, reject) {
        try {
            await AsyncStorage.setItem(key, value)
            resolve(true)
        }catch (e) {
            reject(e)
        }
    })

};

export const getFromLocalStorage = (key) => {
    return new Promise(async function (resolve, reject) {
        try {
            let value = await AsyncStorage.getItem(key);
            resolve(value)
        }
        catch (e) {
            reject(e)
        }
    })
};

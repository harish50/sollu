import React from "react";
import {AsyncStorage} from "react-native";

export const setToLocalStorage = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    }
    catch (e) {
        console.log("error", e);
    }
};

export const getFromLocalStorage = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    }
    catch (e) {
        console.log(e);
        return null;
    }
};

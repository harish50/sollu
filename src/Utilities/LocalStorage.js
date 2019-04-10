import React from "react";
import {AsyncStorage} from "react-native";

export const setToLocalStorage = (key , value) => {
    AsyncStorage.setItem(key, value)
};

export const getNameFromLocalStorage = async (key) => {
    return await AsyncStorage.getItem(key);
};

import React from "react";
import {AsyncStorage} from "react-native";

export const setToLocalStorage = (key , value) => {
    AsyncStorage.setItem(key, JSON.stringify(value))
};

export const getFromLocalStorage = async (key) => {
    return await AsyncStorage.getItem(key);
};

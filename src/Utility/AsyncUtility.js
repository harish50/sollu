import React from "react";
import {AsyncStorage} from "react-native";

export const setToAsync = (phNo) => {
    AsyncStorage.setItem('userPhoneNumber', phNo)
};

export const getFromAsync = async (phNo) => {
    return await AsyncStorage.getItem(phNo);
};

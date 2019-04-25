import React from 'react'

let user = null;
export const setCurrentUser = (phoneNumber) => {
    user = phoneNumber
};
export const getCurrentUser = () => {
    return user;
}
export const resetCurrentUser = () => {
    user = null;
}
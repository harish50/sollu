import React from 'react'

export const getPairID = (sender, receiver) => {
    let key = '';
    if (sender === receiver) {
        key = sender;
    } else if (sender > receiver) {
        key = receiver + sender;
    } else {
        key = sender + receiver;
    }
    return key;
};
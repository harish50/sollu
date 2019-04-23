import React from 'react'
import {checkPermissionToNotification} from "./Permission";


export const createNotificationListeners = async () => {
    checkPermissionToNotification().then(() => {console.log()});
};


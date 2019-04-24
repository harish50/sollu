import React from 'react'
import {checkPermissionToNotification} from "./Permission";
import {foregroundListener} from "./ForegroundListener";
import {onNotifOpenHandler} from "./onNotifOpenHandler";

export const createNotificationListeners = async (navigation) => {
    console.log("Creating listeners")
    checkPermissionToNotification();
    foregroundListener();
    onNotifOpenHandler(navigation);
};


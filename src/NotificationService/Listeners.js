import React from 'react'
import {checkPermissionToNotification} from "./Permission";
import {foregroundListener} from "./ForegroundListener";
import {onNotifOpenHandler} from "./onNotifOpenHandler";
import {backgroundListener} from "./BackgroundListener";

export const createNotificationListeners = async (navigation) => {
    console.log("Creating listeners")
    checkPermissionToNotification();
    foregroundListener();
    backgroundListener(navigation);
    onNotifOpenHandler(navigation);
};


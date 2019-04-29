import React from 'react'
import {checkPermissionToNotification} from "./Permission";
import {foregroundListener} from "./ForegroundListener";
import {onNotifOpenHandler} from "./OnNotifOpenHandler";
import {backgroundListener} from "./BackgroundListener";

export const createNotificationListeners = async (navigation) => {
    checkPermissionToNotification();
    foregroundListener();
    backgroundListener(navigation);
    onNotifOpenHandler(navigation);
};


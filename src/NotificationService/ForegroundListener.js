import Firebase from "react-native-firebase";
import {Platform} from "react-native";

export const foregroundListener = () => {
    Firebase.notifications().android.createChannel(channel);
    const notificationListener = Firebase.notifications().onNotification(async notification => {
        let localNotification = createLocalNotification(notification);
        Firebase.notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
    });
};
const channel = new Firebase.notifications.Android.Channel(
    "001", "Name",
    Firebase.notifications.Android.Importance.Max
).setDescription("Channel");

const createLocalNotification = (notification) => {
    const contactName = "Example"
    const data = {
        sender: notification.data.receiver,
        receiver: notification.data.sender
    };
    const localNotification = new Firebase.notifications.Notification({
        show_in_foreground: true
    })
        .setNotificationId(notification.notificationId)
        .setTitle(contactName)
        .setBody(notification.body)
        .setData(data)
        .setSound("default");
    if (Platform.OS === "android") {
        localNotification.android
            .setAutoCancel(true)
            .android.setChannelId(channel.channelId)
            .android.setPriority(Firebase.notifications.Android.Priority.High);
    } else if (Platform.OS === "ios") {
        localNotification.ios.setBadge(notification.ios.badge);
    }
    return localNotification
};
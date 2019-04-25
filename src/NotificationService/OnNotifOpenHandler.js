import Firebase from "react-native-firebase";

export const onNotifOpenHandler = (navigation) => {
    this.notificationOpenedListener = Firebase.notifications().onNotificationOpened(
        async notificationOpen => {
            let notification = notificationOpen.notification;
            let participants = {
                receiver: notification.data.receiver,
                sender: notification.data.sender
            };
            navigation.navigate(
                "ChatContainer",
                {participants: participants, contactName: notification.title});
        }
    );
}
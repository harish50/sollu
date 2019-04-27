import Firebase from "react-native-firebase";
import {setCurrentUser} from "../Screens/ChatPage/CurrentUser";

export const onNotifOpenHandler = (navigation) => {
    this.notificationOpenedListener = Firebase.notifications().onNotificationOpened(
        async notificationOpen => {
            let notification = notificationOpen.notification;
            setCurrentUser(notification.data.receiver);
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
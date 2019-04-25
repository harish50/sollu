import Firebase from "react-native-firebase";
import {AsyncStorage} from "react-native";

export const backgroundListener = async (navigation) => {

    const notificationOpen = await Firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        let notification = notificationOpen.notification;
        let data = notification.data;
        let contactName = "Example";
        AsyncStorage.getItem(data.sender);
        let participants = {
            receiver: data.sender,
            sender: data.receiver
        };
        navigation.navigate(
            "ChatContainer",
            {participants: participants, contactName: contactName});
    }
}
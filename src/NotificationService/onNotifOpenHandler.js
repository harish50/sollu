import Firebase from "react-native-firebase";

export const onNotifOpenHandler = (navigation) =>{
    console.log("open hanlder huhu")
    this.notificationOpenedListener = Firebase.notifications().onNotificationOpened(
        async notificationOpen => {
            let notification = notificationOpen.notification;
            let data = notification.data;
           let  contactName = "Example";
            let participants = {
                receiver: data.receiver,
                sender: data.sender
            };
            console.log("Navigating to chat screen")
            navigation.navigate(
                "ChatContainer",
                {participants: participants, contactName: contactName});
        }
    );
}
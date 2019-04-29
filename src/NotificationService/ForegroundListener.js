import Firebase from "react-native-firebase";
import {AsyncStorage, Platform} from "react-native";
import firebase from "../../firebase/firebase";

export const foregroundListener = () => {
    incomingVideoCallListener();
    incomingMessageListener();
};
const incomingVideoCallListener = async () => {
    let phoneNumber = await AsyncStorage.getItem('PhoneNumber');
    let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
    VIDEO_CALL_REF.child(phoneNumber).child("flag").set(true);
    VIDEO_CALL_REF.child(phoneNumber).on("value", (snapshot) => {
        let videoCallInfo = snapshot.val();
        let caller = videoCallInfo !== null ? videoCallInfo.caller : null;
        if (caller && videoCallInfo != null) {
            this.props.navigation.navigate("AnswerVideoCall", {
                callee: phoneNumber,
                caller: caller
            });
        }
    });
};
const incomingMessageListener = () => {
    Firebase.notifications().android.createChannel(channel);
    const notificationListener = Firebase.notifications().onNotification(async notification => {
        let self = await AsyncStorage.getItem('PhoneNumber');
        if (notification.data.sender !== self && notification.data.sender !== currentUser) {
            let localNotification = createLocalNotification(notification);
            Firebase.notifications()
                .displayNotification(localNotification)
                .catch(err =>(err));
        }
    });
};
const channel = new Firebase.notifications.Android.Channel(
    "001", "Name",
    Firebase.notifications.Android.Importance.Max
).setDescription("Channel");

const createLocalNotification = (notification) => {
    const contactName = notification.title;
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
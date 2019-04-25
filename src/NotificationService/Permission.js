import Firebase from "react-native-firebase";
import {getToken, setToken} from "./Token";

export const checkPermissionToNotification = async () => {
    const enabled = await Firebase.messaging().hasPermission();
    if (enabled) {
        await getAndSetToken();
    }
    else {
        await requestPermission().then(() => {
            console.log()
        });
    }
};

const requestPermission = async () => {
    try {
        await Firebase.messaging().requestPermission();
        await getAndSetToken();
    } catch (error) {
        return error
    }
};

const getAndSetToken = () => {
    getToken().then((fcmToken) => {
        setToken(fcmToken).then(() => console.log())
    });
};
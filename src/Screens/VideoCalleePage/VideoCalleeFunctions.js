import InCallManager from "react-native-incall-manager";

export const navigateToHomeScreen = (navigation, callee) => {
    console.log("navigate to homescreen");
    console.log(navigation, callee);
    navigation.navigate("HomeContainer", {sender: callee});
};

export const handleCallAnswer = ()=>{
    InCallManager.stopRingtone();
    InCallManager.start();
};
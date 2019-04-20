import InCallManager from "react-native-incall-manager";
import firebase from "../../../firebase/firebase";

const VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");

export const handleCallHangUp = (pc, participants) => {
    if (pc !== null) {
        console.log(pc.close());
    }
    InCallManager.stopRingback();
    InCallManager.stop();
    VIDEO_CALL_REF.child(participants.sender).remove();
    VIDEO_CALL_REF.child(participants.sender).child('VideoCallEnd').set(true);
};

export const navigateToChatScreen=(navigation, participants, contactName)=>{
    navigation.navigate("ChatScreen", {
        participants: participants,
        contactName: contactName
    });
};
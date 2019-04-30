import firebase from "../../../firebase/firebase";
import RTCPeerConnection from "react-native-webrtc/RTCPeerConnection";
import {getLocalStream, setRemoteDescription} from "./VideoCallerFunctions";
import mediaDevices from "react-native-webrtc/MediaDevices";
import InCallManager from "react-native-incall-manager";
import RTCSessionDescription from "react-native-webrtc/RTCSessionDescription";
import RTCIceCandidate from "react-native-webrtc/RTCIceCandidate";

const VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");

export const removeDataFromDB = (participants) => {
    console.log(participants);
    VIDEO_CALL_REF.child(participants.sender).remove();
    VIDEO_CALL_REF.child(participants.sender).child('VideoCallEnd').set(true);
};

export const pushNumberToMakeAnOffer=(pc,participants)=>{
    console.log("inside pushNumberToMakeAnOffer");
    console.log(participants);
    VIDEO_CALL_REF.child(participants.receiver).set({caller: participants.sender}).then(()=>{});
    InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
    console.log("incallmanager started ringback");

    VIDEO_CALL_REF.child(participants.sender).child('videoSDP').set(pc.localDescription).then(()=>{});
};

export const pushICEToDB=(participants, senderICEList)=>{
    VIDEO_CALL_REF.child(participants.sender).child('ICE').set(senderICEList);
    console.log("pushed ICE to DB");
};

export const listenForAnswer=(pc,participants, updateReadyToStreamVideo, updateCallStatus)=>{
    VIDEO_CALL_REF.child(participants.receiver).on('child_added', async (snap) => {
        if (snap.key === 'VideoCallEnd') {
            updateReadyToStreamVideo(false);
            // this.setState({
            //     readyToStreamVideo: false
            // });
            InCallManager.stopRingback();
            InCallManager.stop();
            console.log("incallmanager stopringback call declined");
            pc.close();
            VIDEO_CALL_REF.child(participants.sender).remove();
            VIDEO_CALL_REF.child(participants.receiver).remove();
            this.props.navigation.navigate("ChatScreen", {
                participants: participants,
                contactName: this.props.navigation.getParam("contactName")
            });
        }
        if (snap.key === 'videoSDP') {
            console.log("Getting SDP");
            updateCallStatus("Answered the Call");
            // this.setState({
            //     callStatus: this.props.navigation.getParam("contactName") + " Answered the Call"
            // });
            InCallManager.stopRingback();
            console.log("incallmanager stopringback");

            pc.setRemoteDescription(new RTCSessionDescription(snap.val())).then(()=>{
                console.log("remotedescription set done");
            }).catch((err)=>{
                console.log(err)
            })
            updateCallStatus("Connecting to video call");
            // setRemoteDescription(pc,snap.val());
            // this.setState({
            //     callStatus: "Connecting to video call"
            // });
            console.log("Done setting SDP")
        } else if (snap.key === 'ICE') {
            let receiverICEList;
            receiverICEList = snap.val();
            console.log("got receivers ICE list");
            let flag = false;
            console.log("flag before addRemoteICE:", flag);
            flag = await addRemoteICE(pc,receiverICEList);
            console.log("flag from addRemoteICE:", flag);
            if (flag) {
                console.log("addRemoteICE done");
                updateReadyToStreamVideo(true);
                // this.setState({
                //     readyToStreamVideo: true
                // })

            }
        }
    });
};

const addRemoteICE=async (pc,receiverICEList)=> {
    let temp = -1;
    let index = 0;
    for (; index < receiverICEList.length && temp !== index;) {
        temp = index;
        await pc.addIceCandidate(new RTCIceCandidate(receiverICEList[index])).then(
            () => {
                console.log("add ice succeeded");
                index++;
            },
            error => {
                console.log(error);
            }
        )
    }
    if (index === receiverICEList.length) {
        console.log("out from addICE");
        return true;
    }
};

export const checkForReceivedVideoCall=(participants, updateCallStatus)=>{
    VIDEO_CALL_REF.child(participants.receiver).on('child_added', async (callerSnap) => {
        if (callerSnap.key === 'VideoCallReceived') {
            updateCallStatus("Answered the Call");
            // this.setState({
            //     callStatus: this.props.navigation.getParam("contactName") + " Answered the Call"
            // });
            InCallManager.stopRingback();
            InCallManager.start();
            console.log("videocallreceived");
        }
    });
};


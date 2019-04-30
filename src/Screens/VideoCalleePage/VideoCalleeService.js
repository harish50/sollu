import firebase from "../../../firebase/firebase";
import RTCPeerConnection from "react-native-webrtc/RTCPeerConnection";
import InCallManager from "react-native-incall-manager";
import RTCSessionDescription from "react-native-webrtc/RTCSessionDescription";
import {getLocalStream} from "../VideoCallerPage/VideoCallerFunctions";
import RTCIceCandidate from "react-native-webrtc/RTCIceCandidate";

const VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");

export const addReceivedCallFlagToDB = (callee) => {
    VIDEO_CALL_REF.child(callee).child('VideoCallReceived').set(true);
};

export const listenOnCaller = (pc, senderIceList, receiverIceList, caller, callee, updateFlagToStreamVideo, updateStreamVideo) => {
    let servers = {
        'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
            'urls': 'turn:numb.viagenie.ca',
            'credential': 'webrtc',
            'username': 'websitebeaver@mail.com'
        }]
    };
    pc = new RTCPeerConnection(servers);
    VIDEO_CALL_REF.child(caller).on('child_added', async (callerSnap) => {
        if (callerSnap.key === 'VideoCallEnd') {
            InCallManager.stopRingtone();
            InCallManager.stop();
            VIDEO_CALL_REF.child(callee).remove();
            VIDEO_CALL_REF.child(caller).remove();
            pc.close();
            this.props.navigation.navigate("HomeScreen", {sender: callee});
        }
        if (callerSnap.key === 'videoSDP') {
            let flag = false;
            flag = await getLocalStream(pc);
            if (flag) {
                await pc.setRemoteDescription(new RTCSessionDescription(callerSnap.val())).then(() => {
                }, error => {
                });
            }
        }
        else if (callerSnap.key === 'ICE') {
            if (senderIceList.length !== 0) {
                senderIceList = [];
            }
            senderIceList = callerSnap.val();
            let flag;
            flag = await addRemoteICE(pc, senderIceList);
            if (flag) {
                answerTheCall(pc, callee);
            }
        }
    });
    pc.onicecandidate = (event => {
            if (event.candidate != null) {
                receiverIceList.push(event.candidate);
            }
            else {
                VIDEO_CALL_REF.child(callee).child('ICE').set(receiverIceList);
                updateFlagToStreamVideo();
            }
        }
    );
    pc.onaddstream = ((event) => {
        updateStreamVideo(event.stream);
    });
};

const addRemoteICE = async (pc, senderIceList) => {
    let temp = -1;
    let index = 0;
    for (; index < senderIceList.length && temp !== index;) {
        temp = index;
        await pc.addIceCandidate(new RTCIceCandidate(senderIceList[index])).then(
            () => {
                index++;
            },
            error => {
            }
        )
    }
    if (index === senderIceList.length) {
        return true;
    }
};

const answerTheCall = (pc, callee) => {
    pc.createAnswer().then(async (sdp) => {
        pc.setLocalDescription(sdp).then(() => {
            VIDEO_CALL_REF.child(callee).child('videoSDP').set(pc.localDescription);
        })
    });
};
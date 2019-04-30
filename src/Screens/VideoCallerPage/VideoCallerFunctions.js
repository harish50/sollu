import InCallManager from "react-native-incall-manager";
import {listenForAnswer, pushICEToDB, pushNumberToMakeAnOffer, removeDataFromDB} from "./VideoCallerService";
import mediaDevices from "react-native-webrtc/MediaDevices";
import RTCPeerConnection from "react-native-webrtc/RTCPeerConnection";
import RTCSessionDescription from "react-native-webrtc/RTCSessionDescription";

import VideoCallerContainer from "./VideoCallerContainer"


export const handleCallHangUp = (pc, participants) => {
    if (pc !== null) {
        pc.close()
    }
    InCallManager.stopRingback();
    InCallManager.stop();
    removeDataFromDB(participants);
};

export const navigateToChatScreen = (navigation, participants, contactName) => {
    navigation.navigate("ChatContainer", {
        participants: participants,
        contactName: contactName
    });
};

export const handleMuteVideo = (pc) => {
    let localStream = pc.getLocalStreams()[0];
    localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
    console.log("video track removed");
};

export const getLocalStream = async (pc) => {
    await mediaDevices.getUserMedia({
        audio: true,
        video: {
            mandatory: {
                minWidth: 320, // Provide your own width, height and frame rate here
                minHeight: 240,
                minFrameRate: 30
            },
            facingMode: "user"
        }
    }).then(async stream => {
        await pc.addStream(stream);
    });
    return true;
};

export const startVideoCall = async (pc, participants, updateReadyToStreamVideo, updateCallStatus, updateRemoteVideo) => {
    let servers = {
        'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
            'urls': 'turn:numb.viagenie.ca',
            'credential': 'webrtc',
            'username': 'websitebeaver@mail.com'
        }]
    };
    pc = new RTCPeerConnection(servers);
    let flag;
    flag = await getLocalStream(pc);
    if (flag === true) {
        makeOffer(pc, participants);
        collectAndSendICEs(pc, participants);
        listenForAnswer(pc, participants, updateReadyToStreamVideo, updateCallStatus);
        pc.onaddstream = ((event) => {
            updateRemoteVideo(event.stream);
        });
    }
};

const makeOffer = (pc, participants) => {
    pc.createOffer({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }).then((sdp) => {
        pc.setLocalDescription(sdp).then(() => {
            pushNumberToMakeAnOffer(pc, participants)
        })
    })
};

const collectAndSendICEs = (pc, participants) => {
    let senderICEList = [];
    pc.onicecandidate = (event => {
            if (event.candidate != null) {
                senderICEList.push(event.candidate);
            }
            else {
                pushICEToDB(participants, senderICEList);
            }
        }
    );
};


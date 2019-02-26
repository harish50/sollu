import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import styles from "../Stylesheet/videocallStyles";
import FontAwesome, {Icons} from "react-native-fontawesome";

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from "react-native-webrtc";
import firebase from "../firebase/firebase";

export default class VideoCall extends Component {
    state = {
        SenderVideoURL: null,
        RecieverVideoURL: null,
        isFront: true
    };

    static navigationOptions = ({navigation}) => {
        let props = navigation;
        return {
            headerTitle: navigation.getParam("contactName"),
            headerTintColor: "#cc504e",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: "Roboto-Bold",
                height: 60
            }
        };
    };

    getPairID(sender, receiver) {
        let key = "";
        if (sender === receiver) {
            key = sender;
        } else if (sender > receiver) {
            key = receiver + sender;
        } else {
            key = sender + receiver;
        }
        return key;
    }

    componentDidMount() {
        const configuration = {
            iceServers: [{url: "stun:stun.l.google.com:19302"}]
        };
        const pc = new RTCPeerConnection(configuration);
        const {isFront} = this.state;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (
                    sourceInfo.kind == "video" &&
                    sourceInfo.facing == (isFront ? "front" : "back")
                ) {
                    videoSourceId = sourceInfo.id;
                }
            }

            mediaDevices
                .getUserMedia({
                    audio: true,
                    video: {
                        mandatory: {
                            minWidth: 320, // Provide your own width, height and frame rate here
                            minHeight: 240,
                            minFrameRate: 30
                        },
                        facingMode: isFront ? "user" : "environment",
                        optional: videoSourceId ? [{sourceId: videoSourceId}] : []
                    }
                })
                .then(stream => {
                    console.log("Streaming OK", stream);
                    video.srcObject = stream;
                    this.setState({
                        SenderVideoURL: stream.toURL()
                    });
                    pc.addStream(stream);
                    // Got stream!
                })
                .catch(error => {
                    console.log("Oops, we getting error", error.message);
                    throw error;
                });
        });
        //caller side
        let info = this.props.navigation.getParam("info");
        console.log(info);
        pc.createOffer()
            .then(sdp => pc.setLocalDescription(sdp))
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        VIDEO_CALL_REF.child(info.sender).child('videoSDP').push(pc.localDescription),
            VIDEO_CALL_REF.child(info.sender).set({isVideoSendCall: true}),
            VIDEO_CALL_REF.child(info.receiver).set({isVideoReceiveCall: true}),
            VIDEO_CALL_REF.child(info.receiver).set({caller: info.sender})
        if (VIDEO_CALL_REF.hasChild(info.receiver)!=null) {
            let remoteSDP = VIDEO_CALL_REF.child(info.receiver).child("videoSDP").once("once", (receiverVideoSDP) => receiverVideoSDP.val());
            pc.setRemoteDescription(remoteSDP);
        }
    }

    handlePressCall = () => {
        let {navigation} = this.props;
        this.props.navigation.navigate("ChatScreen");
    };

    render() {
        if (this.state.ReceiverVideoURL) {
            console.warn(this.state.ReceiverVideoURL);
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.videoURL} style={styles.video1}/>
                    <View style={styles.callIcon}>
                        <TouchableOpacity onPress={this.handlePressCall}>
                            <Text style={styles.phoneCallBox}>
                                <FontAwesome>{Icons.phoneSquare}</FontAwesome>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.phoneCallBox}>
                                <FontAwesome>{Icons.videoSlash}</FontAwesome>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={styles.text}>Not Working On Web RTC</Text>
                </View>
            );
        }

        // return (
        //     <View>
        //         <Text style={styles.textBox}>
        //             Hey Dude, video call will release soon.....
        //         </Text>
        //         <View style={styles.callIcon}>
        //             <TouchableOpacity onPress={this.handlePressCall}>
        //                 <Text style={styles.phoneCallBox}>
        //                     <FontAwesome>{Icons.phoneSquare}</FontAwesome>
        //                 </Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity>
        //                 <Text style={styles.phoneCallBox}>
        //                     <FontAwesome>{Icons.videoSlash}</FontAwesome>
        //                 </Text>
        //             </TouchableOpacity>
        //         </View>
        //
        //     </View>
        // )
    }
}

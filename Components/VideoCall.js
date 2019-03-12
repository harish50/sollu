import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "../Stylesheet/videocallStyles";
import FontAwesome, {Icons} from "react-native-fontawesome";

import {mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
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

    sendICE(senderNumber, ICE) {
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        let info = this.props.navigation.getParam("info");
        VIDEO_CALL_REF.child(info.sender).child(ICE);
    }

    setReceiverStream(stream) {
        this.setState({
            RecieverVideoURL: stream
        })
    }

    componentDidMount() {
        // const configuration = {
        //     iceServers: [{ url: "stun:stun.l.google.com:19302" }]
        // };
        var servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };

        const pc = new RTCPeerConnection(servers);
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

            mediaDevices.getUserMedia({
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
            }).then(stream => {
                console.log("Streaming OK", stream);
                this.setState({
                    SenderVideo: stream
                });
                pc.addStream(stream);
                // Media stream added to PC
            }).catch(error => {
                console.log("Oops, we getting error", error.message);
                throw error;
            });
        });
        //caller side
        let info = this.props.navigation.getParam("info");
        console.log(info);
        pc.onicecandidate = (event => {
                if (event.candidate != null) {
                    console.log("Video screen");
                    console.log(JSON.stringify({'ice': event.candidate}))
                    this.sendICE(info.sender, JSON.stringify({'ice': event.candidate}))
                }
                else {
                    console.log("No ice found")
                }
            }
        );
        // pc.onaddstream = (event => this.setReceiverStream(event.stream));
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        pc.createOffer().then((sdp) => {
            pc.setLocalDescription(sdp).then(() => {
                VIDEO_CALL_REF.child(info.sender).set({videoSDP: pc.localDescription, isVideoSendCall: true});
                VIDEO_CALL_REF.child(info.receiver).set({caller: info.sender, isVideoReceiveCall: true});
            })
        });
        // pc.onaddstream = event =>
        VIDEO_CALL_REF.child(info.receiver).child('videoSDP').on('child_added', (snapshot) => {
            console.log("Snapshot : ")
            console.log(snapshot.val());

            if (snapshot != null && snapshot !== 'answer') {
                pc.setRemoteDescription(new RTCSessionDescription(snapshot.val().sdp));
            }
        });
    }

    handlePressCall = () => {
        let {navigation} = this.props;
        this.props.navigation.navigate("ChatScreen");
    };

    render() {
        if (this.state.SenderVideoURL) {
            console.warn(this.state.SenderVideoURL);
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.SenderVideoURL} style={styles.video1}/>
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
    }
}

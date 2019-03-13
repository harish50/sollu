import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "../Stylesheet/videocallStyles";
import FontAwesome, {Icons} from "react-native-fontawesome";

import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
import firebase from "../firebase/firebase";

let senderIceList = [];
let ReceiverIceList = [];
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
        // console.log("SendICE method called : ")
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        let info = this.props.navigation.getParam("info");
        VIDEO_CALL_REF.child(info.sender).child('ICE').set(ICE);
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
        pc.onicecandidate = (async event => {
                if (event.candidate != null) {
                    // console.log("pushing to list")
                    // console.log(event.candidate)
                    senderIceList.push(event.candidate);
                    // this.sendICE(info.sender, event.candidate)
                    // console.log(senderIceList);
                }
                else {
                    console.log("No ice found")
                    console.log("Trying to set to FIREBASE")
                    // console.log(senderIceList);
                    let index = 0;
                    for (let ice in senderIceList) {
                        console.log("one of the ice");
                        // console.log(index);
                        // console.log(senderIceList[ice])
                        VIDEO_CALL_REF.child(info.sender).child('ICE').push(senderIceList[ice]);
                        index++;
                    }
                }
            }
        );

        pc.onaddstream = (event => {
            console.log("Huhuuuu getting stream!!!!")
            console.log(event.stream)
            this.setState({
                RecieverVideoURL: event.stream
            })

        });


        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        pc.createOffer().then((sdp) => {
            pc.setLocalDescription(sdp).then(() => {
                // console.log("Local desc ")
                // console.log(pc.localDescription)
                VIDEO_CALL_REF.child(info.sender).child('videoSDP').set(pc.localDescription);
                VIDEO_CALL_REF.child(info.receiver).set({caller: info.sender, isVideoReceiveCall: true});

            })
        });
        // pc.onaddstream = event =>
        VIDEO_CALL_REF.child(info.receiver).on('child_added', (snapshot) => {
            // console.log("Snapshot : ")
            // console.log(snapshot);
            // console.log("Snapshot key: ")
            // console.log(snapshot.key);

            if (snapshot.key === 'videoSDP') {
                console.log("Getting and setting SDP");
                pc.setRemoteDescription(new RTCSessionDescription(snapshot.val()));
            }
            else if (snapshot.key === 'ICE' && snapshot !== undefined) {
                // console.log("Getting and setting ICE");
                VIDEO_CALL_REF.child(info.receiver).child('ICE').on('child_added', snapshot => {)

                    pc.addIceCandidate(new RTCIceCandidate({
                        sdpMLineIndex: snapshot.val().sdpMLineIndex,
                        candidate: snapshot.val().candidate
                    })).then(() => {
                        console.log("set receiver ICE")
                    }).catch(error => {
                        console.log("Oops, we getting error", error.message);
                        throw error;
                    });
                })
                // console.log(JSON.parse(snapshot.val()).ice)
                // console.log(new RTCIceCandidate(snapshot.val()));
                //
                console.log("Done setting ICE")

            }
        });
    }

    handlePressCall = () => {
        let {navigation} = this.props;
        this.props.navigation.navigate("ChatScreen");
    };

    render() {
        if (this.state.RecieverVideoURL) {
            // console.warn(this.state.SenderVideoURL);
            console.log("In the render method")
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.RecieverVideoURL.toURL()} style={styles.video1}/>
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

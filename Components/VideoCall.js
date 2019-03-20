import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import styles from "../Stylesheet/videocallStyles";
import FontAwesome, {Icons} from "react-native-fontawesome";

import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
import firebase from "../firebase/firebase";

let senderIceList = [];
let receiverIceList = [];
let pc = null;

let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
let info = null;
let callerVideoTrack = null;
let callerVideoMuted = false;
export default class VideoCall extends Component {
    state = {
        SenderVideoURL: null,
        ReceiverVideoURL: null,
        isFront: true,
        streamVideo: false
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
        info = this.props.navigation.getParam("info")
        this.startVideoCall();
    }
    componentWillUnmount(){
        senderIceList=[];
    }

    async startVideoCall() {
        let servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };
        pc = new RTCPeerConnection(servers);
        let flag="false";
        flag = await this.getLocalStream();
        console.log("flag");
        console.log(flag)
        if (flag==="true") {
            console.log("Flag is true")
            this.makeOffer();
            console.log("Completed creating Offer");
            this.collectAndSendICEs();
            console.log("Back to method");
            this.waitForAnswer();

            pc.onaddstream = ((event) => {
                console.log("onaddstream");
                console.log(event.stream);
                this.setState({
                    ReceiverVideoURL: event.stream
                })
            });
        }
    }

    waitForAnswer() {
        console.log("Entered in to waitForCall ")
        VIDEO_CALL_REF.child(info.receiver).on('child_added', async (snap) => {
            if (snap.key === 'videoSDP') {
                console.log("Getting SDP");
                pc.setRemoteDescription(new RTCSessionDescription(snap.val()));
                console.log("Done setting SDP")
            } else if (snap.key === 'ICE') {
                receiverIceList = snap.val();
                console.log("got receivers ICE list");
                let flag =false;
                console.log("flag before addRemoteICE:",flag);
                flag = await this.addRemoteICE();
                console.log("flag from addRemoteICE:",flag);
                if(flag){
                    console.log("addRemoteICE done");
                    this.setState({
                        streamVideo: true
                    })
                }
            }
        });
    }

    async addRemoteICE() {
        let temp=-1;
        let index =0;
        for(;index<receiverIceList.length&&temp!==index;){
            temp=index;
            await pc.addIceCandidate(new RTCIceCandidate(receiverIceList[index])).then(
                () => {
                    console.log("add ice succeeded");
                    index++;
                },
                error => {
                    console.log("error");
                    console.log(error);
                }
            )
        }
        if(index===receiverIceList.length){
            console.log("out from addICE");
            return true;
        }
    }

    collectAndSendICEs() {
        console.log("collect Ice here")
         pc.onicecandidate = ( event => {
                if (event.candidate != null) {
                    console.log("Pushing ICE to list")
                    senderIceList.push(event.candidate);
                }
                else {
                    console.log("No ice found")
                    console.log("Trying to set to FIREBASE")
                    // let index = 0;
                    // for (let ice in senderIceList) {
                    //     console.log("one of the ice");
                    //     VIDEO_CALL_REF.child(info.sender).child('ICE').push(senderIceList[ice]);
                    //     index++;
                    // }

                    VIDEO_CALL_REF.child(info.sender).child('ICE').set(senderIceList);

                    // VIDEO_CALL_REF.child(info.sender).child('ICE').push("completed");
                }
            }
        )
        console.log("Completed collecting ICEs")
    }

    makeOffer() {
        console.log("Creating Offer")
        pc.createOffer({
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }).then((sdp) => {
            pc.setLocalDescription(sdp).then(() => {
                console.log("Local desc ")
                console.log(pc.localDescription)
                VIDEO_CALL_REF.child(info.receiver).set({caller: info.sender});
                VIDEO_CALL_REF.child(info.sender).child('videoSDP').set(pc.localDescription);
            })
        });
    }

    async getLocalStream() {
        console.log("Getting my media")
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
            console.log("Streaming OK", stream);
            await pc.addStream(stream);
            console.log("going out")
        })
        console.log("Gonna return true")
        return "true";
    }

    handlePressCall = () => {
        //mute video of yours.
        console.log("in mute video");
        let localStream = pc.getLocalStreams()[0];
        console.log(localStream);
            localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
            console.log("video track removed");
    };

    handleCallHangUp=()=>{
        console.log(pc);
        console.log("in callhangup");
        console.log(pc.close());
        console.log("after pc.close");
        // pc=null;
        VIDEO_CALL_REF.child(info.sender).remove();
        VIDEO_CALL_REF.child(info.receiver).child('VideoCallEnd').set(true);
        console.log(pc);
        this.props.navigation.navigate("ChatScreen", {
            info: info,
            contactName: this.props.navigation.getParam("contactName")
        });
    };

    render() {
        if (this.state.streamVideo && this.state.ReceiverVideoURL) {
            // console.warn(this.state.SenderVideoURL);
            console.log("In the render method");
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.ReceiverVideoURL.toURL()} style={styles.video1}/>
                    <View style={styles.callIcon}>
                        <TouchableOpacity onPress={this.handleCallHangUp}>
                            <Text style={styles.phoneCallBox}>
                                <FontAwesome>{Icons.phoneSquare}</FontAwesome>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.handlePressCall}>
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

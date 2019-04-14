import React, {Component} from "react";
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import styles from "../Stylesheet/videocallStyles";
import InCallManager from 'react-native-incall-manager';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
import firebase from "../firebase/firebase";

const VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
let senderIceList = [];
let receiverIceList = [];
let participants = null;
let pc = null;
export default class VideoCall extends Component {
    state = {
        selfVideo: null,
        remoteVideo: null,
        readyToStreamVideo: false,
        callStatus: "Starting sollu video call",
        selfVideoEnable: false,
        speakerEnabled: true
    };

    static navigationOptions = ({navigation}) => {
        let props = navigation;
        return {
            headerTitle: navigation.getParam("contactName"),
            headerTintColor: "#fff",
            headerStyle: {
                fontFamily: "Roboto-Bold",
                height: 60,
                backgroundColor: '#cc504e',
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
        participants = this.props.navigation.getParam("participants")
        this.startVideoCall();

        VIDEO_CALL_REF.child(participants.receiver).on('child_added', async (callerSnap) => {
            if (callerSnap.key === 'VideoCallReceived') {
                this.setState({
                    callStatus: this.props.navigation.getParam("contactName") + " Answered the Call"
                });
                InCallManager.stopRingback();
                InCallManager.start();
                InCallManager.setSpeakerphoneOn(true);
            }
        });
    }

    componentWillUnmount() {
        senderIceList = [];
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
        let flag = false;
        flag = await this.getLocalStream();
        if (flag === true) {
            this.makeOffer();
            this.collectAndSendICEs();
            this.waitForAnswer();

            pc.onaddstream = ((event) => {
                this.setState({
                    remoteVideo: event.stream
                })
            });
        }
    }

    waitForAnswer() {
        VIDEO_CALL_REF.child(participants.receiver).on('child_added', async (snap) => {
            if (snap.key === 'VideoCallEnd') {
                this.setState({
                    readyToStreamVideo: false
                });
                InCallManager.stopRingback();
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop();
                pc.close();
                VIDEO_CALL_REF.child(participants.sender).remove();
                VIDEO_CALL_REF.child(participants.receiver).remove();
                this.props.navigation.navigate("ChatScreen", {
                    participants: participants,
                    contactName: this.props.navigation.getParam("contactName")
                });
            }
            if (snap.key === 'videoSDP') {
                this.setState({
                    callStatus: this.props.navigation.getParam("contactName") + " Answered the Call"
                })
                InCallManager.stopRingback();
                InCallManager.setSpeakerphoneOn(true);
                pc.setRemoteDescription(new RTCSessionDescription(snap.val()));
                this.setState({
                    callStatus: "Connecting to video call"
                })
            } else if (snap.key === 'ICE') {
                receiverIceList = snap.val();
                let flag = false;
                flag = await this.addRemoteICE();
                if (flag) {
                    this.setState({
                        readyToStreamVideo: true
                    })

                }
            }
        });
    }

    async addRemoteICE() {
        let temp = -1;
        let index = 0;
        for (; index < receiverIceList.length && temp !== index;) {
            temp = index;
            await pc.addIceCandidate(new RTCIceCandidate(receiverIceList[index])).then(
                () => {
                    index++;
                },
                error => {
                    console.log(error);
                }
            )
        }
        if (index === receiverIceList.length) {
            return true;
        }
    }

    collectAndSendICEs() {
        pc.onicecandidate = (event => {
                if (event.candidate != null) {
                    senderIceList.push(event.candidate);
                    VIDEO_CALL_REF.child(participants.sender).child('ICE').set(senderIceList);
                }
                else {
                    console.log("No ice found")
                }
            }
        )}

    makeOffer() {
        pc.createOffer({
            OfferToReceiveAudio: true,
            OfferToReceiveVideo: true
        }).then((sdp) => {
            pc.setLocalDescription(sdp).then(() => {
                VIDEO_CALL_REF.child(participants.receiver).set({caller: participants.sender});
                VIDEO_CALL_REF.child(participants.sender).child('videoSDP').set(pc.localDescription);
                this.setState({
                    callStatus: "Calling..."
                })
                InCallManager.start({media: 'audio', ringback: '_BUNDLE_'});
            })
        });
    }

    async getLocalStream() {
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
            this.setState({
                selfVideo : stream
            })
        })
        return true;
    }

    muteVideo = () => {
        //mute video of yours.
        let localStream = pc.getLocalStreams()[0];
        localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
        this.setState({
            selfVideoEnable: !this.state.selfVideoEnable
        })
    };

    handleSpeaker=()=>{
        console.log(" handle speaker");
        if(this.state.speakerEnabled){
            InCallManager.setSpeakerphoneOn(false);
        }
        else{
            InCallManager.setSpeakerphoneOn(true);
        }
        this.setState({
            speakerEnabled : !this.state.speakerEnabled
        })
    };

    handleCallHangUp = () => {
        if (pc !== null) {
            console.log(pc.close());
        }
        InCallManager.stopRingback();
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.stop();

        VIDEO_CALL_REF.child(participants.sender).remove();
        VIDEO_CALL_REF.child(participants.sender).child('VideoCallEnd').set(true);
        this.props.navigation.navigate("ChatScreen", {
            participants: participants,
            contactName: this.props.navigation.getParam("contactName")
        });
    };

    render() {
        if (this.state.readyToStreamVideo && this.state.remoteVideo) {
            return (
                <View style={styles.container1}>
                    <RTCView objectFit='cover' streamURL={this.state.remoteVideo.toURL()} style={styles.remoteVideoContainer}/>
                    <RTCView objectFit='cover' zOrder={1} streamURL={this.state.selfVideo.toURL()} style={styles.videoPreviewContainer}/>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={this.handleCallHangUp}>
                            <View style={styles.callIcon}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                        {(!this.state.speakerEnabled)?
                            <TouchableOpacity onPress={this.handleSpeaker}>
                                <View style={styles.callIcon}>
                                    <Icon name="volume-off" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>:<TouchableOpacity onPress={this.handleSpeaker}>
                                <View style={styles.callIcon}>
                                    <Icon name="volume-up" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                        }
                        {(!this.state.selfVideoEnable) ?
                            <TouchableOpacity onPress={this.muteVideo}>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity> : <TouchableOpacity onPress={this.muteVideo}>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam-off" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.loadbox}>
                    <ActivityIndicator size="large" color="#cc504e"/>
                    <Text style={styles.loadingtextbox1}>{this.state.callStatus}</Text>
                    <TouchableOpacity onPress={this.handleCallHangUp}>
                        <View style={styles.callIcon3}>
                            <Icon name="call-end" color="#fff" size={30}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}

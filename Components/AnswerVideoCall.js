import React from "react";
import firebase from "../firebase/firebase";
import {ActivityIndicator, AsyncStorage, Text, TouchableOpacity, View} from "react-native";
import InCallManager from 'react-native-incall-manager';
import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
import stylings from "../Stylesheet/videocallStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../Stylesheet/styleSheet";

const VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
let receiverIceList = [];
let senderIceList = [];
let caller = null;
let callee = null;
let sdp = null;
let pc = null;
let local = false;
export default class AnswerVideoCall extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            remoteVideo: '',
            readyToStreamVideo: false,
            isCallAnswered: false,
            callerName: '',
            selfVideoEnable: false,
            speakerEnabled : true,
            selfVideo : null,
        };
        this.listenOnCaller = this.listenOnCaller.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        let props = navigation;
        return {
            headerTitle: "Sollu",
            headerTintColor: "#fff",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: "Roboto-Bold",
                height: 60,
                backgroundColor: '#cc504e',
            }
        };
    };

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
        }).then(async (stream) => {
            await pc.addStream(stream);
            this.setState({
                selfVideo : stream
            })
        });
        return true;
    }

    async addRemoteICE() {
        let temp = -1;
        let index = 0;
        for (; index < senderIceList.length && temp !== index;) {
            temp = index;
            await pc.addIceCandidate(new RTCIceCandidate(senderIceList[index])).then(
                () => {
                    index++;
                },
                error => {
                    console.log(error);
                }
            )
        }
        if (index === senderIceList.length) {
            return true;
        }
    }

    answerTheCall() {
        pc.createAnswer().then((sdp) => {
            pc.setLocalDescription(sdp)
        });
    }

    async componentDidMount() {
        InCallManager.startRingtone('_DEFAULT_');
        caller = this.props.navigation.getParam("caller");
        callee = this.props.navigation.getParam("callee");
        let name = await AsyncStorage.getItem(caller);
        this.setState({
            callerName: name,
        })

        VIDEO_CALL_REF.child(caller).on('child_added', async (callerSnap) => {
            if (callerSnap.key === 'VideoCallEnd') {
                InCallManager.stopRingtone();
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop()
                local = false;
                receiverIceList = [];
                senderIceList = [];
                VIDEO_CALL_REF.child(callee).remove();
                VIDEO_CALL_REF.child(caller).remove();
                this.props.navigation.navigate("HomeScreen", {sender: callee});
            }
        });
    }

    muteVideo = () => {
        let localStream = pc.getLocalStreams()[0];
        localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
        this.setState({
            selfVideoEnable: !this.state.selfVideoEnable
        })
    };

    handleCallHangUp = () => {
        local = false;
        if (pc !== null) {
            console.log(pc.close());
        }
        InCallManager.stopRingtone();
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.stop();
        VIDEO_CALL_REF.child(callee).child('VideoCallEnd').set(true);
        this.props.navigation.navigate("HomeScreen", {sender: callee});
    };


    listenOnCaller = () => {
        let servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };
        pc = new RTCPeerConnection(servers);
        VIDEO_CALL_REF.child(caller).once('value', async (callerSnap) => {
            callerSnap.forEach((childsnap) => {
                if (childsnap.key === 'videoSDP') {
                    sdp = childsnap.val();
                }
                if (childsnap.key === 'ICE') {
                    if(senderIceList.length!==0){
                        senderIceList = []
                    }
                    senderIceList = childsnap.val()
                }
            });
            let flag;
            flag = this.getLocalStream();
            if (flag) {
                pc.setRemoteDescription(new RTCSessionDescription(sdp)).then(async () => {
                    if (senderIceList.length !== 0) {
                        flag = await this.addRemoteICE();
                        if (flag) {
                            this.answerTheCall();
                        }
                    }
                }, error => {
                    console.log(error)
                });
            }
        });
        pc.onicecandidate = (event => {
                if (event.candidate != null) {
                    receiverIceList.push(event.candidate);
                    VIDEO_CALL_REF.child(callee).child('ICE').set(receiverIceList);
                    if (!local) {
                        local = true;
                        VIDEO_CALL_REF.child(callee).child('videoSDP').set(pc.localDescription);
                    }
                    this.setState({
                        readyToStreamVideo: true
                    });
                }
                else {
                    console.log("No ice found");
                }
            }
        );
        pc.onaddstream = ((event) => {
            this.setState({
                remoteVideo: event.stream
            });
        });
    }

    callAnswer() {
        InCallManager.stopRingtone();
        InCallManager.start();
        InCallManager.setSpeakerphoneOn(true);
        VIDEO_CALL_REF.child(callee).child('VideoCallReceived').set(true);
        this.setState({
            isCallAnswered: true
        });
        this.listenOnCaller();
    }
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

    render() {
        if (this.state.remoteVideo && this.state.readyToStreamVideo) {
            return (
                <View style={stylings.container1}>
                    <RTCView objectFit='cover' streamURL={this.state.remoteVideo.toURL()} style={stylings.remoteVideoContainer}/>
                    <RTCView objectFit='cover' zOrder={1} streamURL={this.state.selfVideo.toURL()} style={stylings.videoPreviewContainer}/>
                    <View style={stylings.bottomBar}>
                        <TouchableOpacity onPress={this.handleCallHangUp}>
                            <View style={stylings.callIcon}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                        {(!this.state.speakerEnabled) ?
                            <TouchableOpacity onPress={this.handleSpeaker}>
                                <View style={stylings.callIcon}>
                                    <Icon name="volume-off" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>:<TouchableOpacity onPress={this.handleSpeaker}>
                                <View style={stylings.callIcon} onPress={this.handleSpeaker}>
                                    <Icon name="volume-up" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                        }
                        {(!this.state.selfVideoEnable) ?
                            <TouchableOpacity onPress={this.muteVideo}>
                                <View style={stylings.callIcon}>
                                    <Icon name="videocam" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity> : <TouchableOpacity onPress={this.muteVideo}>
                                <View style={stylings.callIcon}>
                                    <Icon name="videocam-off" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            );
        }
        else if (this.state.isCallAnswered) {
            return (
                <View style={stylings.container2}>
                    <View style={styles.loadbox1}>
                        <ActivityIndicator size="large" color="#cc504e"/>
                        <Text style={stylings.loadingtextbox1}>Connecting...</Text>
                    </View>
                    <View style={stylings.bottomBar3}>
                        <TouchableOpacity onPress={this.handleCallHangUp}>
                            <View style={stylings.callIcon1}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else {
            return (
                <View style={stylings.container1}>
                    <View>
                        <Text style={stylings.callerName}>{this.state.callerName}</Text>
                        <Text style={stylings.callerStatus}>Calling....</Text>
                    </View>
                    <View style={stylings.bottomBar2}>
                        <TouchableOpacity onPress={this.handleCallHangUp}>
                            <View style={stylings.callIcon1}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.callAnswer.bind(this)}>
                            <View style={stylings.callIcon2}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
}
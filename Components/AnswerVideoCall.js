import React from "react";
import firebase from "../firebase/firebase";
import {Text, TouchableOpacity, View,ActivityIndicator, AsyncStorage} from "react-native";
import InCallManager from 'react-native-incall-manager';
import {mediaDevices, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from "react-native-webrtc";
import stylings from "../Stylesheet/videocallStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../Stylesheet/styleSheet";

let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
let caller = null;
let callee = null;
let pc = null;
let receiverIceList = [];
let senderIceList = [];
export default class AnswerVideoCall extends React.Component{
    constructor(props){
        super();
        this.state = {
            remoteStream: '',
            streamVideo: false,
            onClickAnswerCall : false,
            callerName : '',
            videoEnable : true,
            selfVideo : null,
            speakerEnabled : true
        };
        this.listenOnCaller= this.listenOnCaller.bind(this);
    }

    static navigationOptions = ({navigation}) => {
        let props = navigation;
        return {
            headerTitle: "Sollu",
            headerTintColor: "#cc504e",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: "Roboto-Bold",
                height: 60
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
            console.log("stream added");
        });
        console.log("in getLocalStream return true");
        return true;
    }

    async addRemoteICE() {
        let temp = -1;
        let index = 0;
        for (; index < senderIceList.length && temp !== index;) {
            temp = index;
            await pc.addIceCandidate(new RTCIceCandidate(senderIceList[index])).then(
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
        if (index === senderIceList.length) {
            console.log("out from addICE");
            return true;
        }
    }

    answerTheCall() {
        pc.createAnswer().then(async (sdp) => {
            console.log("in create answer");
            pc.setLocalDescription(sdp).then(() => {
                console.log("localdescription");
                VIDEO_CALL_REF.child(callee).child('videoSDP').set(pc.localDescription);
            })
        });
    }

    async componentDidMount() {
        InCallManager.startRingtone('_DEFAULT_');
        console.log("Entered into AnswerVideoCall.js");
        caller = this.props.navigation.getParam("caller");
        callee = this.props.navigation.getParam("callee");
        let name = await AsyncStorage.getItem(caller)
        this.setState({
            callerName: name,
            videoEnable : false
        })

        VIDEO_CALL_REF.child(caller).on('child_added', async (callerSnap) => {
            console.log("Let us know the key");
            console.log(callerSnap.key);
            if (callerSnap.key === 'VideoCallEnd') {
                InCallManager.stopRingtone();
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop()
                VIDEO_CALL_REF.child(callee).remove();
                console.log("videocallEnd has child 1");
                VIDEO_CALL_REF.child(caller).remove();
                console.log("videocallEnd has child21");
                this.props.navigation.navigate("HomeScreen", {sender: callee});
            }
        });
    }

    muteVideo = () => {
        //mute video of yours.
        console.log("in mute video");
        let localStream = pc.getLocalStreams()[0];
        console.log(localStream);
        localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
        console.log("video track removed");
        this.setState({
            videoEnable : !this.state.videoEnable
        })
        // console.log(this.state.videoEnable);
    };

    handleCallHangUp = () => {
        console.log("in callhangup");
        console.log(pc);
        if(pc!==null){
            console.log(pc.close());
        }
        InCallManager.stopRingtone();
        InCallManager.setSpeakerphoneOn(false);
        InCallManager.stop();

        console.log("after pc.close");
        // pc=null;
        VIDEO_CALL_REF.child(callee).child('VideoCallEnd').set(true);
        this.props.navigation.navigate("HomeScreen", {sender: callee});
    };


    listenOnCaller=()=> {
        let servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };
        pc = new RTCPeerConnection(servers);
        VIDEO_CALL_REF.child(caller).on('child_added', async (callerSnap) => {
            console.log("Let us know the key");
            console.log(callerSnap.key);
            if (callerSnap.key === 'VideoCallEnd') {
                InCallManager.stopRingtone();
                InCallManager.setSpeakerphoneOn(false);
                InCallManager.stop();
                VIDEO_CALL_REF.child(callee).remove();
                console.log("videocallEnd has child 1");
                VIDEO_CALL_REF.child(caller).remove();
                console.log("videocallEnd has child21");
                pc.close();
                this.props.navigation.navigate("HomeScreen", {sender: callee});
            }
            if (callerSnap.key === 'videoSDP') {
                console.log("videoSDP");
                let flag = false;
                flag = await this.getLocalStream();
                if (flag) {
                    pc.setRemoteDescription(new RTCSessionDescription(callerSnap.val())).then(() => {
                        console.log("setremotedescription")
                    }, error => {
                        console.log(error)
                    });
                }
            }
            else if (callerSnap.key === 'ICE') {
                if (senderIceList.length !== 0) {
                    senderIceList = [];
                }
                senderIceList = callerSnap.val();
                console.log("added into senderIceList");
                let flag;
                flag = await this.addRemoteICE();
                console.log("flag from addRemoteICE:", flag);
                if (flag) {
                    console.log("inside flag to start answer");
                    this.answerTheCall();

                }
            }
        });
        pc.onicecandidate = (event => {
                console.log('Printing event');
                if (event.candidate != null) {
                    receiverIceList.push(event.candidate);
                    console.log("inside onicecandidate");
                }
                else {
                    console.log("No ice found");
                    VIDEO_CALL_REF.child(callee).child('ICE').set(receiverIceList);
                    this.setState({
                        streamVideo: true
                    });
                    console.log("pushing to fb");
                }
            }
        );
        pc.onaddstream = ((event) => {
            console.log("onaddstream");
            console.log(event.stream);
            this.setState({
                remoteStream: event.stream
            });
        });
    }

    callAnswer(){
        console.log("in callAnswering");
        // when user pickup
        InCallManager.stopRingtone();
        InCallManager.start();
        InCallManager.setSpeakerphoneOn(true);
        VIDEO_CALL_REF.child(callee).child('VideoCallReceived').set(true);
        this.setState({
            onClickAnswerCall : true
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
        if (this.state.remoteStream && this.state.streamVideo) {
            console.log("In the render method");
            return (
                <View style={stylings.container1}>
                        <RTCView objectFit='cover' streamURL={this.state.remoteStream.toURL()} style={stylings.remoteVideoContainer}/>
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
                        {(!this.state.videoEnable) ?
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
        else if (this.state.onClickAnswerCall) {
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
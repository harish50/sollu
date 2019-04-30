import React from 'react';
import VideoCalleeView from "./VideoCalleeView";
import {handleCallHangUp} from "../VideoCallerPage/VideoCallerFunctions";
import {navigateToHomeScreen} from "./VideoCalleeFunctions";
import {listenOnCaller} from "./VideoCalleeService";
import {Header} from "../Header/HeaderView";
import InCallManager from "react-native-incall-manager";

let pc = null;
let participants = null;
let senderIceList = [], receiverIceList = [];
export default class VideoCalleeContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            remoteVideo: '',
            readyToStreamVideo: false,
            isCallAnswered: false,
            callerName: '',
            selfVideoEnable: false
        };
    }

    static navigationOptions = ({navigation}) => {
        return (Header("Sollu"));
    };

    updateFlagToStreamVideo = () => {
        this.setState({
            readyToStreamVideo: true
        });
    };

    updateStreamVideo = (stream) => {
        this.setState({
            remoteVideo: stream
        });
    };

    muteVideo = () => {
        if (pc) {
            let localStream = pc.getLocalStreams()[0];
            localStream.getVideoTracks()[0].enabled = !(localStream.getVideoTracks()[0].enabled);
        }
        this.setState({
            selfVideoEnable: !this.state.selfVideoEnable
        })
    };

    callHangUp = () => {
        handleCallHangUp(pc, participants);
        navigateToHomeScreen(this.props.navigation, participants.sender)
    };

    prepareVideo = () => {
        listenOnCaller(pc, senderIceList, receiverIceList, participants.sender, participants.receiver, this.updateFlagToStreamVideo, this.updateStreamVideo);
    };

    componentDidMount() {
        InCallManager.startRingtone('_DEFAULT_');
    }

    render() {
        participants = {
            sender: this.props.navigation.getParam("caller"),
            receiver: this.props.navigation.getParam("callee")
        };
        let props = {
            caller: participants.sender,
            callee: participants.receiver,
            readyToStreamVideo: this.state.readyToStreamVideo,
            remoteVideo: this.state.remoteVideo,
            selfVideoEnable: this.state.selfVideoEnable,
            pc: pc,
            callHangUp: this.callHangUp,
            prepareVideo: this.prepareVideo,
            muteVideo: this.muteVideo
        };
        return (
            <VideoCalleeView {...props}/>
        )
    }
}
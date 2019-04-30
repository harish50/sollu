import React from 'react';
import VideoCallerView from "./VideoCallerView";
import {Header} from "../Header/HeaderView";
import {handleCallHangUp, handleMuteVideo, navigateToChatScreen} from "./VideoCallerFunctions";
import {startVideoCall} from "./VideoCallerFunctions";
import {checkForReceivedVideoCall} from "./VideoCallerService";


let pc = null;
let participants = null;
let navigation = null;
export default class VideoCallerContainer extends React.Component{

    state = {
        selfVideo: null,
        remoteVideo: null,
        readyToStreamVideo: false,
        callStatus: "Starting sollu video call",
        selfVideoEnable: false
    };

    static navigationOptions = ({navigation}) => {
        return (Header(navigation.getParam("contactName"), null, null));
    };

    componentDidMount(){
        console.log("inside component did mount");
        console.log(this.props);
        startVideoCall(pc, participants, this.updateReadyToStreamVideo, this.updateCallStatus, this.updateRemoteVideo);
        checkForReceivedVideoCall(participants, this.updateCallStatus);
    }

    updateCallStatus=(text)=>{
        console.log(text);
        let updateText = text;
        if(text==="Answered the Call"){
            updateText=this.props.navigation.getParam("contactName")+" Answered the Call"
        }
        this.setState({
            callStatus: updateText
        })
    };

    updateReadyToStreamVideo=(flag)=>{
        console.log("in updateReadyToStreamVideo");
        this.setState({
            readyToStreamVideo: flag
        })
    };

    updateRemoteVideo=(stream)=>{
        console.log("in updateRemoteVideo");
        console.log(stream);
        this.setState({
            remoteVideo: stream
        })
    };

    callHangUp=()=>{
        console.log("Hangup");
        console.log("participants in callHangUp:",participants);
        if(pc){
            handleCallHangUp(pc, participants);
        }
        navigateToChatScreen(this.props.navigation, participants, "Testing");
    };

    muteVideo=()=>{
        console.log("muteVideo",pc);
        if(pc){
            handleMuteVideo(pc);
        }
        this.setState({
            selfVideoEnable: !this.state.selfVideoEnable
        })
    };

    render(){
        participants = this.props.navigation.getParam("participants");
        navigation = this.props.navigation;
        let props = {
            readyToStreamVideo: this.state.readyToStreamVideo,
            remoteVideo: this.state.remoteVideo,
            selfVideoEnable: this.state.selfVideoEnable,
            callStatus: this.state.callStatus,
            callHangUp: this.callHangUp,
            muteVideo: this.muteVideo
        };
        return(
        <VideoCallerView {...props}/>
        )
    }
}
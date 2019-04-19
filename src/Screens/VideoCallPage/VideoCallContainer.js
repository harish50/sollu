import React from 'react';
import VideoCallView from "./VideoCallView";
import {Header} from "../Header/HeaderView";
import {handleCallHangUp, navigateToChatScreen} from "./VideoCallFunctions";


let pc = null;
let participants = null;
let navigation = null;
export default class VideoCallContainer extends React.Component{

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

    callHangUp=()=>{
        handleCallHangUp(pc, participants);
        navigateToChatScreen(participants, navigation.getParam("contactName"));
    };

    //mute video need to be added

    render(){
        participants = this.props.navigation.getParam("");
        navigation = this.props.navigation;
        let props = {
            readyToStreamVideo: this.state.readyToStreamVideo,
            remoteVideo: this.state.remoteVideo,
            selfVideoEnable: this.state.selfVideoEnable,
            callStatus: this.state.callStatus,
            handleCallHangUp: this.callHangUp,
            muteVideo: this.muteVideo
        };
        return(
        <VideoCallView {...props}/>
        )
    }
}
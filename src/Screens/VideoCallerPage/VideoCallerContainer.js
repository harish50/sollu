import React from 'react';
import VideoCallerView from "./VideoCallerView";
import {Header} from "../Header/HeaderView";
import {handleCallHangUp, navigateToChatScreen} from "./VideoCallerFunctions";


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

    callHangUp=()=>{
        console.log("Hangup")
        // handleCallHangUp(pc, participants);
         participants = {
            sender: "9491173782",
            receiver: "9440179801"
        };
        navigateToChatScreen(this.props.navigation, participants, "Testing");
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
            callHangUp: this.callHangUp,
            muteVideo: this.muteVideo
        };
        return(
        <VideoCallerView {...props}/>
        )
    }
}
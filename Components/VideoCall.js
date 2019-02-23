import React, { Component } from 'react';
import { View, TouchableOpacity, Image,} from 'react-native';
import styles from "../Stylesheet/styleSheet";

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc';

export default class videoCall extends Component{
    // constructor(){
    //     super()
    //     this.state={
    //         stream: '',
    //         streamUrl: ''
    //     }
    // }
    // componentDidMount(){
    //     this.setState({
    //         streamUrl : this.state.stream.toURL()
    //     })
    // }

    onPress=()=>{
        console.log("In videocall screen P2P");

        this.props.navigation.navigate('VideoScreen')
        // let connectedUser, myConnection, name='';
        // let localStream;
        //
        // let configuration = {
        //     "iceServers": [{ "url": "stun:stun.1.google.com:19302" }]
        // };
        //
        // myConnection = new RTCPeerConnection(configuration);
        //         console.log("RTCPeerConnection object was created");
        //         console.log(myConnection);
        //
        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if(sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }

            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500, // Provide your own width, height and frame rate here
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{sourceId: videoSourceId}] : [])
                }
            })
                .then(stream => {
                    console.log("Streamed")
                    console.log('Received local stream');
                    const videoTracks = stream.getVideoTracks();
                    if (videoTracks.length > 0) {
                        console.log(`Using video device: ${videoTracks[0].label}`);
                    }
                    this.setState({
                         stream: stream
                    })
                    localStream = stream;
                    // Got stream!
                })
                .catch(error => {
                    console.log("Error throwed")
                    console.log(error)
                    // Log error
                });
        });

    }

    render(){
        return(
            <View>
                <TouchableOpacity onPress={this.onPress}>
                    <Image style={styles.profile} source={require('../Icon/videocallicon.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}
'use strict';

import React from 'react';
import {
    Platform,
    Animated,
    StyleSheet,
    View,
    Text
} from 'react-native';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc'
// import mediaDevices from "react-native-webrtc/MediaDevices";

export default class VideoScreen extends React.Component {

    state = {
        videoURL: null,
        isFront: true
    }

    componentDidMount() {
        const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
        const pc = new RTCPeerConnection(configuration);
        const { isFront } = this.state;
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
                    console.log('Streaming OK', stream);
                    this.setState({
                        videoURL: stream.toURL()
                    });
                    pc.addStream(stream);
                    // Got stream!
                })
                .catch(error => {
                    console.log('Oops, we getting error', error.message);
                    throw error;
                });
        });
        // pc.createOffer((desc) => {
        //     pc.setLocalDescription(desc, () => {
        //         console.log('pc.setLocalDescription');
        //     }, (e) => { throw e; });
        // }, (e) => { throw e; });
        //
        // pc.onicecandidate = (event) => {
        //     console.log('onicecandidate', event);
        // };

    }

    render() {
        if (this.state.videoURL) {
            console.warn(this.state.videoURL);
            return (
                <View style={styles.container}>
                <View>
                    <Text style={styles.text}>Working On Web RTC</Text>
                </View>
                <View  style={styles.videoContainer}>
                    <RTCView streamURL={this.state.videoURL}  style={styles.video1}/>
                </View>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Text style={styles.text}>Not Working On Web RTC</Text>
                </View>

            );
        }

    }
}
const styles = {
    text: {
        textAlign: "center",
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000'
    },
    videoContainer: {
        flex: 1,
        alignSelf: 'stretch'
    },
    video1: {
        flex: 1
    },
};
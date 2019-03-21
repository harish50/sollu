import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../Stylesheet/videocallStyles'
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices
} from 'react-native-webrtc'

export default class VideoCall extends Component {
    state = {
        videoURL: null,
        isFront: true
    }

    static navigationOptions = ({ navigation }) => {
        let props = navigation
        return ({
            headerTitle: navigation.getParam('contactName'),
            headerTintColor: "#fff",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: 'Roboto-Bold',
                height: 60,
                backgroundColor: '#cc504e',
            },
        })
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
                if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }

            mediaDevices.getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 320, // Provide your own width, height and frame rate here
                        minHeight: 240,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
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
    }

    handlePressCall = () => {
        let { navigation } = this.props;
        this.props.navigation.navigate('ChatScreen')
    }
    render() {

        if (this.state.videoURL) {
            console.warn(this.state.videoURL);
            return (
                <View style={styles.container1}>
                        <RTCView streamURL={this.state.videoURL} style={styles.video1}></RTCView>
                        <View style={styles.bottomBar}>
                            <TouchableOpacity onPress={this.handlePressCall}>
                                <View style={styles.callIcon}>
                                    <Icon name="call-end" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.handlemutecall}>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
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
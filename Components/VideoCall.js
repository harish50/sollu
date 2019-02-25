import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from '../Stylesheet/videocallStyles'
import FontAwesome, { Icons } from 'react-native-fontawesome';


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
            headerTintColor: "#cc504e",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: 'Roboto-Bold',
                height: 60,
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

    handlePressCall = () => {
        let { navigation } = this.props;
        this.props.navigation.navigate('ChatScreen')
    }
    render() {

        if (this.state.videoURL) {
            console.warn(this.state.videoURL);
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.videoURL} style={styles.video1} />
                    <SafeAreaView>
                        <View style={styles.callIcon}>
                            <TouchableOpacity onPress={this.handlePressCall}>
                                <Text style={styles.phoneCallBox}>
                                    <FontAwesome>{Icons.phoneSquare}</FontAwesome>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.phoneCallBox}>
                                    <FontAwesome>{Icons.videoSlash}</FontAwesome>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
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

        // return (
        //     <View>
        //         <Text style={styles.textBox}>
        //             Hey Dude, video call will release soon.....
        //         </Text>
        //         <View style={styles.callIcon}>
        //             <TouchableOpacity onPress={this.handlePressCall}>
        //                 <Text style={styles.phoneCallBox}>
        //                     <FontAwesome>{Icons.phoneSquare}</FontAwesome>
        //                 </Text>
        //             </TouchableOpacity>
        //             <TouchableOpacity>
        //                 <Text style={styles.phoneCallBox}>
        //                     <FontAwesome>{Icons.videoSlash}</FontAwesome>
        //                 </Text>
        //             </TouchableOpacity>
        //         </View>
        //
        //     </View>
        // )
    }
}
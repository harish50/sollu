import React from 'react';
import {TouchableOpacity, View} from "react-native";
import styles from "../../../Stylesheet/videocallStyles";
import {HangUpButton} from "./HangUpButton";
import {Loading} from "../HomePage/Loading";
import RTCView from "react-native-webrtc/RTCView";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class VideoCallergView extends React.Component {
    render() {
        console.log(this.props);
        if (this.props.readyToStreamVideo && this.props.remoteVideo) {
            console.log("In the render method ready to stream");
            console.log("In the render method");
            return (
                <View style={styles.container1}>
                    <RTCView streamURL={this.props.remoteVideo.toURL()} style={styles.video1}/>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={this.props.callHangUp}>
                            <View style={styles.callIcon}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                        {(!this.props.selfVideoEnable) ?
                            <TouchableOpacity onPress={this.props.muteVideo}>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity> : <TouchableOpacity onPress={this.props.muteVideo}>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam-off" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.loadbox}>
                    <Loading message={this.props.callStatus}/>
                    <HangUpButton callHangUp={this.props.callHangUp}/>
                </View>
            );
        }
    }
}
import React, {Component} from 'react';
import styles from "./VideoCalleeStyles";
import {View, TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {HangUpButton} from "../VideoCallerPage/HangUpButton";
import {CallAnswerButton} from "../VideoCallerPage/CallAnswerButton";
import {handleCallAnswer} from "./VideoCalleeFunctions";
import {addReceivedCallFlagToDB} from "./VideoCalleeService";
import RTCView from "react-native-webrtc/RTCView";


export default class VideoCalleeView extends Component {

    callAnswer = () => {
        handleCallAnswer();
        addReceivedCallFlagToDB(this.props.callee);
        this.props.prepareVideo();
    };

    render() {
        if (this.props.remoteVideo && this.props.readyToStreamVideo) {
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
                            <TouchableOpacity onPress={
                                this.props.muteVideo
                            }>
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
        }
        else if (this.props.isCallAnswered) {
            return (
                <View style={styles.container2}>
                    <View style={styles.loadbox1}>
                        <ActivityIndicator size="large" color="#cc504e"/>
                        <Text style={styles.loadingtextbox1}>Connecting...</Text>
                    </View>
                    <View style={styles.bottomBar3}>
                        <TouchableOpacity onPress={this.props.callHangUp}>
                            <View style={styles.callIcon1}>
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
                        <Text style={styles.callerName}>{this.props.callerName}</Text>
                        <Text style={stylings.callerStatus}>Calling....</Text>
                    </View>
                    <View style={stylings.bottomBar2}>
                        <HangUpButton callHangUp={this.props.callHangUp}/>
                        <CallAnswerButton callAnswer={this.callAnswer}/>
                    </View>
                </View>
            );
        }

    }
}
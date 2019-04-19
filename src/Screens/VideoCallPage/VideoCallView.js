import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import styles from "../../../Stylesheet/videocallStyles";
import RTCView from "react-native-webrtc/RTCView";
import Icon from "react-native-vector-icons/MaterialIcons";

export default class VideoCallView extends React.Component{
    render(){
        console.log(this.props);
        if (this.props.readyToStreamVideo && this.props.remoteVideo) {
            return (
                <View style={styles.container1}>
                    <RTCView streamURL={this.props.remoteVideo.toURL()} style={styles.video1}/>
                    <View style={styles.bottomBar}>
                        <TouchableOpacity>
                            <View style={styles.callIcon}>
                                <Icon name="call-end" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                        {(!this.props.selfVideoEnable) ?
                            <TouchableOpacity>
                                <View style={styles.callIcon}>
                                    <Icon name="videocam" color="#fff" size={30}/>
                                </View>
                            </TouchableOpacity> : <TouchableOpacity >
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
                    <ActivityIndicator size="large" color="#cc504e"/>
                    <Text style={styles.loadingtextbox1}>{this.props.callStatus}</Text>
                    <TouchableOpacity>
                        <View style={styles.callIcon3}>
                            <Icon name="call-end" color="#fff" size={30}/>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
    }
}
import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from "react-native";
import styles from "../../../Stylesheet/videocallStyles";
import RTCView from "react-native-webrtc/RTCView";
import Icon from "react-native-vector-icons/MaterialIcons";
import {HangUpButton} from "./HangUpButton";
import {Loading} from "../../Generics/Components/LoadingIndicator";


export default class VideoCallerView extends React.Component{
    render(){
            return (
                <View style={styles.loadbox}>
                   <Loading message ={this.props.callStatus}/>
                  <HangUpButton callHangUp = {this.props.callHangUp}/>
                </View>
            );
    }
}
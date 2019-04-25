import React from 'react'
import {Text, TouchableOpacity} from "react-native";
import styles from "../../../Stylesheet/videocallStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

export const VideoCallIconView = (props) =>{
    return (
        <TouchableOpacity onPress={props.handlePress}>
            <Text style={styles.videoIcon}>
                    <Icon name="videocam" color="#fff" size={40}/>
            </Text>
        </TouchableOpacity>
    );
}
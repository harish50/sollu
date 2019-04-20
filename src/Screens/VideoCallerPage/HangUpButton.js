import React,{Component} from 'react'
import {TouchableOpacity, View} from "react-native";
import styles from "../../../Stylesheet/videocallStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

export const HangUpButton = (props) =>{
        return(
            <TouchableOpacity onPress={() => {
                console.log("Pressed hangup");
                props.callHangUp()
            }}>
                <View style={styles.callIcon3}>
                    <Icon name="call-end" color="#fff" size={30}/>
                </View>
            </TouchableOpacity>
        )

};
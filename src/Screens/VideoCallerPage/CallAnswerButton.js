import {TouchableOpacity, View} from "react-native";
import stylings from "../../../Stylesheet/videocallStyles";
import Icon from "react-native-vector-icons/MaterialIcons";
import React from "react";

export const CallAnswerButton=(props)=>{
    return(
        <TouchableOpacity onPress={() => {
            console.log("Pressed hangup");
            props.callAnswer()
        }}>
            <View style={stylings.callIcon2}>
                <Icon name="call-end" color="#fff" size={30}/>
            </View>
        </TouchableOpacity>
    )
}
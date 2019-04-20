import React, { Component } from 'react';
import { View, TouchableOpacity, } from 'react-native';
import FastImage from 'react-native-fast-image'
import styles from "../../../src/Screens/Profile/ProfileStyles";
import {PROFILEICONS} from "./ProfileStore";

export default class ProfileIconView extends Component{
    render(){
        console.log("profilepic")
        console.log(this.props.profile)
        return(
            <View>
                <TouchableOpacity onPress={this.props.onClickHandler}>
                    <FastImage style={styles.profileIconContainer} source={{ uri:this.props.profile }} />
                </TouchableOpacity>
            </View>
        )
    }
}
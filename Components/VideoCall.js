import React, { Component } from 'react';
import { View, TouchableOpacity, Image,} from 'react-native';
import styles from "../Stylesheet/styleSheet";

export default class videoCall extends Component{
    render(){
        return(
            <View>
                <TouchableOpacity>
                    <Image style={styles.profile} source={require('../Icon/videocallicon.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}
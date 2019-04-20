import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';

export default class ProfileIcon extends Component{
    render(){
        return(
            <View>
                <TouchableOpacity >
                    <FastImage style={styles.profileIconContainer} source={{ uri: this.props.profile_pic }} />
                </TouchableOpacity>
            </View>
        )
    }
}
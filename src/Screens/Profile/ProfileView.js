import React, { Component } from 'react';
import {View, TouchableOpacity,ActivityIndicator} from 'react-native';
import FastImage from 'react-native-fast-image'
import styles from "../../../src/Screens/Profile/ProfileStyles";
import { Picker } from 'react-native-picker-dropdown'

export default class ProfileView extends Component{

    render() {
        console.log("profilepic ijijkj")
        console.log(this.props.profile_pic)
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.imageContainer}>
                        {
                            (!this.props.isProfilePicSet) ? <View style={styles.iconPlaceholder}>
                                    <ActivityIndicator size="large" color='#cc504e' style={styles.loadingPosition} />
                                </View> :
                                <TouchableOpacity onPress={this.props.changeProfilePic}>
                                    <FastImage style={styles.iconPlaceholder} source={{ uri: this.props.profile_pic }} />
                                </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={this.props.gender}
                            onValueChange={this.props.setGender}
                            style={styles.pickerContainer}
                            textStyle={styles.pickerContainerText}>
                            <Picker.Item label="Select Gender" value="Select Gender" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                        </Picker>
                    </View>
                </View>
            </View>
        );
    }
}


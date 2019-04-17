import React, { Component } from 'react';
import {View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image'
import styles from "/Users/harikam/Desktop/feb/sollu/Stylesheet/ProfileScreen.js";
import { Picker } from 'react-native-picker-dropdown'


export default class ProfileView extends Component{

    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={this.props.pickImageHandler}>
                                <FastImage style={styles.iconPlaceholder} source={{ uri: this.props.image_uri }} />
                            </TouchableOpacity>
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


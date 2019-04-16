import React, { Component } from 'react';
import { View, TouchableOpacity,ActivityIndicator,Text } from 'react-native';
import FastImage from 'react-native-fast-image'
import styles from "/Users/harikam/Desktop/feb/sollu/Stylesheet/ProfileScreen.js";
import { Picker } from 'react-native-picker-dropdown'

export default class ProfileView extends Component{
    render() {
        return (
            <View style={styles.container}>
                <View>
                    <View style={styles.imageContainer}>
                        {(!this.props.isProfileSet) ?
                            <TouchableOpacity>
                                <FastImage style={styles.iconPlaceholder} source={{ uri: this.props.image_uri }} />
                            </TouchableOpacity> :<View style={styles.iconPlaceholder}>
                                <ActivityIndicator size="large" color='#cc504e' style={styles.loadingPosition} />
                            </View>
                        }
                    </View>
                    <View style={styles.dropdownContainer}>
                        <Picker
                            selectedValue={this.props.gender}
                            onValueChange={this.props.genderChange}
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


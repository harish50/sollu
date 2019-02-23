import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../Stylesheet/videocallStyles'
import FontAwesome, { Icons } from 'react-native-fontawesome';


export default class VideoCall extends Component {

    static navigationOptions = ({ navigation }) => {
        let props = navigation
        return ({
            headerTitle: navigation.getParam('contactName'),
            headerTintColor: "#cc504e",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: 'Roboto-Bold',
                height: 60,
            },
        })
    }
    handlePressCall = () => {
        let { navigation } = this.props;
        this.props.navigation.navigate('ChatScreen')
    }
    render() {

        return (
            <View>
                <Text style={styles.textBox}>
                    Hey Dude, video call will release soon.....
                </Text>
                <View style={styles.callIcon}>
                    <TouchableOpacity onPress={this.handlePressCall}>
                        <Text style={styles.phoneCallBox}>
                            <FontAwesome>{Icons.phoneSquare}</FontAwesome>
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.phoneCallBox}>
                            <FontAwesome>{Icons.videoSlash}</FontAwesome>
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}
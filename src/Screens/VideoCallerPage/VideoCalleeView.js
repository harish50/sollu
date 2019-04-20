import React, {Component} from 'react';
import styles from "../../../Stylesheet/videocallStyles";
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


export default class VideoCalleeView extends Component{
    render(){
        console.log("in view")
        return (
            <View style={styles.container1}>
                <View style={styles.bottomBar}>
                    <TouchableOpacity>
                        <View style={styles.callIcon}>
                            <Icon name="call-end" color="#fff" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.callIcon}>
                            <Icon name="volume-up" color="#fff" size={30}/>
                        </View>
                    </TouchableOpacity>
                        <TouchableOpacity>
                            <View style={styles.callIcon}>
                                <Icon name="videocam" color="#fff" size={30}/>
                            </View>
                        </TouchableOpacity>
                </View>
            </View>
        );
    }
}
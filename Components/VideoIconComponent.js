import React, {Component} from 'react';
import {TouchableOpacity,Text} from 'react-native';
import FontAwesome, {Icons} from 'react-native-fontawesome';
import styles from '../Stylesheet/videocallStyles'


export default class VideoIconComponent extends Component{

    handlePress = () =>{
        let { navigation } = this.props;
        const name = navigation.getParam('contactName')
        this.props.navigation.navigate('VideoCall',{contactName:name})
    }
    render(){
        let { navigation } = this.props;
        const info = navigation.getParam('info');
        return(
            <TouchableOpacity onPress={this.handlePress}>
                <Text style={styles.videoIcon}>
                    {  (info.sender !== info.receiver) &&
                    <FontAwesome>{Icons.video}</FontAwesome>
                    }
                </Text>
            </TouchableOpacity>
        )
    }
}
import React, { Component } from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../Stylesheet/videocallStyles";

export default class VideoCallRinging extends Component{

    static navigationOptions = ({ navigation }) => {
        let props = navigation
        return ({
            headerTitle:"Sollu App Calling...",
            headerTintColor: "#fff",
            headerBackTitle: "Back",
            headerStyle: {
                fontFamily: 'Roboto-Bold',
                height: 60,
                backgroundColor: '#cc504e',
            },
        })
    }
   render(){
       return(
           <View style={styles.container1}>
               <View style={styles.bottomBar2}>
                   <TouchableOpacity onPress={this.handlePressCall}>
                       <View style={styles.callIcon1}>
                           <Icon name="call-end" color="#fff" size={30}/>
                       </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={this.handlemutecall}>
                       <View style={styles.callIcon2}>
                           <Icon name="call-end" color="#fff" size={30}/>
                       </View>
                   </TouchableOpacity>
               </View>
           </View>
       );
   }
}
import React, { Component } from "react";
import { TouchableOpacity, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from "../Stylesheet/videocallStyles";

export default class VideoIconComponent extends Component {
  handlePress = () => {
    let { navigation } = this.props;
    const name = navigation.getParam("contactName");
    this.props.navigation.navigate("VideoCall", {
      contactName: name,
        participants: navigation.getParam("participants")
    });
  };
  render() {
    let { navigation } = this.props;
    const participants = navigation.getParam("participants");
    return (
      <TouchableOpacity onPress={this.handlePress}>
        <Text style={styles.videoIcon}>
          {participants.sender !== participants.receiver && (
              <Icon name="videocam" color="#fff" size={40}/>
          )}
        </Text>
      </TouchableOpacity>
    );
  }
}

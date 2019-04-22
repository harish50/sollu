import React,{Component} from 'react'
import {VideoCallIconView} from "./VideoCallIconView";

export default class VideoCallIconContainer extends Component{

    handlePress = () =>{
        console.log("Inside method");
        let { navigation } = this.props;
        console.log("Pressed Video Icon")
        const name = navigation.getParam("contactName");
        this.props.navigation.navigate("VideoCallerContainer", {
            contactName: name,
            participants: navigation.getParam("participants")
        });
    }
    render(){
        return(
            <VideoCallIconView handlePress = {this.handlePress}/>
        )
    }
}
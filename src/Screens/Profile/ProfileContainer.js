import React, { Component } from 'react';
import ProfileView from "./ProfileView";
import {getFromLocalStorage} from "../../Utilities/LocalStorage";
import {ProfileIcons} from "../../Utilities/ProfileDefaultIconsStore";

export default class ProfileContainer extends Component{
    state = {
        image_uri:ProfileIcons.GENERALICON,
        isProfilePicSet : false,
        gender:''
    }
    componentDidMount(){
        this.setState({
            isProfilePicSet:true,
            image_uri:ProfileIcons.GENERALICON,
        });
    }

    genderChange = (itemValue) => {
        this.setState({
            gender: itemValue
        })
    }
    render() {
        return (
            <ProfileView image_uri={this.state.image_uri} isProfilePicSet={this.state.isProfilePicSet} genderChange={this.genderChange} gender={this.state.gender}/>
        )
    }
}
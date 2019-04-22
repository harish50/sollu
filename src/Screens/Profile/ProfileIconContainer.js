import React, { Component } from 'react';
import ProfileIconView from "./ProfileIconView";
import {PROFILEICONS} from "./ProfileStore";

export default class ProfileIconContainer extends Component{
    state={
        profile:""
    }
    onClickHandler = () => {
        this.navigateToProfileScreen(this.props.navigation)
    }
    navigateToProfileScreen=(navigation)=>{
        navigation.navigate("ProfileContainer",
            {onGoBack: () => this.ProfileInfoin})
    };
    ProfileInfoin = () => {
        this.setState({
            profile:PROFILEICONS.GENERALICON
        })
    }
    render(){
        return(
            <ProfileIconView onClickHandler={this.onClickHandler} profile={this.state.profile}/>
        )
    }
}
import React, { Component } from 'react';
import ProfileIconView from "./ProfileIconView";
import {ProfilePicFetch} from "./ProfilePicFetch";

export default class ProfileIconContainer extends Component{
    state={
        profile_pic:''
    }
    onClickHandler = () => {
        this.navigateToProfileScreen(this.props.navigation)
    }
    navigateToProfileScreen=(navigation)=>{
        navigation.navigate("ProfileContainer",{onGoBack: () => this.updateProfilePic()})
    };

    componentDidMount(){
        this.updateProfilePic()
    }

    updateProfilePic = async () => {
        await ProfilePicFetch().then((props) => {
            this.setState({
                profile_pic: props.profile_pic,
            });
        })
        this.setState({
            profile_pic:profile_pic,
        });
    }

    render(){
        return(
            <ProfileIconView onClickHandler={this.onClickHandler} profile={this.state.profile_pic}/>
        )
    }
}
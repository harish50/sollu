import React, { Component } from 'react';
import {AsyncStorage} from 'react-native'
import ProfileIconView from "./ProfileIconView";
import {ProfilePicFetch} from "./ProfilePicFetch";
import _ from "lodash";

export default class ProfileIconContainer extends Component{
    state={
        profile_pic:''
    }
    onClickHandler = () => {
        if(!_.isUndefined(this.props.navigation)) {
            this.navigateToProfileScreen(this.props.navigation)
        }
    }
    navigateToProfileScreen= async (navigation) => {
        let user = await AsyncStorage.getItem('PhoneNumber')
        navigation.navigate("ProfileContainer", {
            onGoBack: () => {
                this.updateProfilePic(user)
            }
        })
    };

    async componentDidMount() {
        let user = this.props.user ? this.props.user : await AsyncStorage.getItem('PhoneNumber');
        this.updateProfilePic(user)
    }

    updateProfilePic = async (user) => {
        await ProfilePicFetch(user).then((props) => {
            this.setState({
                profile_pic: props.profile_pic,
            });
        })
    }

    render(){
        return(
            <ProfileIconView onClickHandler={this.onClickHandler} profile={this.state.profile_pic}/>
        )
    }
}
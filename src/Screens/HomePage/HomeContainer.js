import React, {Component} from 'react';
import {AsyncStorage, PermissionsAndroid, Platform} from 'react-native'
import HomeView from './HomeView'

export default class HomeContainer extends Component {
    state = {
        contacts: []
    };

    componentDidMount() {
        if (this.getPermissionToLocalContacts()) {
            this.getSolluLocalContacts()
        }
        else {
            alert("Permission denied")
        }
    }

    getPermissionToLocalContacts() {
        this.requestContactsPermission().then((permission) => {
            return !!permission;
        });

    }

    async requestContactsPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            return false;
        }
    }

    async getSolluLocalContacts() {
        let localSolluContacts = await AsyncStorage.getItem('SolluContacts');
        if (localSolluContacts) {
            this.setState({
                contacts: await JSON.parse(localSolluContacts) || []
            });
        }
    }

    render() {

        return (
            <HomeView contacts={this.state.contacts}/>
        )
    }
}
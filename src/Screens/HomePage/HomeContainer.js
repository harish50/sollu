import React, {Component} from 'react';
import HomeView from './HomeView'
import {getSolluContacts, requestContactsPermission} from "./Contacts";
import {AsyncStorage} from "react-native";
import {Header} from "../Header/HeaderView";
import {createNotificationListeners} from "../../NotificationService/Listeners";
import ProfileIconContainer from "../Profile/ProfileIconContainer";

export default class HomeContainer extends Component {
    state = {
        contacts: [],
        isPermitted: false
    };

    componentDidMount() {
        this.getPermissionToLocalContacts().then((permission) => {
            if (!permission) {
                alert(permission);
                return;
            }
            this.setState({isPermitted: true});
            this.getSolluLocalContacts();
            createNotificationListeners(this.props.navigation).done();
        });
    }

    componentWillUnmount() {
        if (this.state.isPermitted) {
            getSolluContacts().then((solluContacts) => {
                AsyncStorage.setItem("solluContacts", JSON.stringify(solluContacts));
            });
        }
    }

    getPermissionToLocalContacts = async () => {
        return await requestContactsPermission();
    };

    getSolluLocalContacts = async () => {
        await AsyncStorage.getItem('solluContacts').then(async (localSolluContacts) => {
            if (localSolluContacts) {
                this.setState({contacts: await JSON.parse(localSolluContacts) || []});
            }
            else {
                getSolluContacts().then((solluContacts) => {
                    AsyncStorage.setItem("solluContacts", JSON.stringify(solluContacts));
                    this.setState({contacts: solluContacts})
                })
            }
        });
    };

    navigateToChatScreen = async (receiverPhoneNumber, receiverName) => {
        let sender = await AsyncStorage.getItem('PhoneNumber');
        let participants = {
            sender: sender,
            receiver: receiverPhoneNumber
        };
        this.props.navigation.navigate('ChatContainer',
            {participants: participants, contactName: receiverName});
    }
    onContactPress = (contact) => {
        this.navigateToChatScreen(contact.item.key, contact.item.name)
    };

    static navigationOptions = ({navigation}) => {
        const headerRight = <ProfileIconContainer navigation={navigation}/>
        return (Header("Sollu", null, headerRight))
    };

    render() {
        return (
            <HomeView contacts={this.state.contacts} onContactPress={this.onContactPress}/>
        )
    }
}
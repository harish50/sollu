import React, {Component} from 'react';
import HomeView from './HomeView'
import {getSolluContacts, requestContactsPermission} from "./Contacts";
import {AsyncStorage} from "react-native";
import {Header} from "../Header/HeaderView";

export default class HomeContainer extends Component {
    state = {
        contacts: [],
    };

    componentDidMount() {
        this.getPermissionToLocalContacts().then((permission) => {
            if (!permission) {
                alert(permission);
                return;
            }
            this.getSolluLocalContacts()
        });
    }

    async getPermissionToLocalContacts() {
        return await requestContactsPermission();
    }

    async getSolluLocalContacts() {
        await AsyncStorage.getItem('solluContacts').then(async (localSolluContacts) => {
            if (localSolluContacts) {
                this.setState({
                    contacts: await JSON.parse(localSolluContacts) || [],
                });
            }
            else {
                getSolluContacts().then((solluContacts) => {
                    AsyncStorage.setItem("solluContacts", JSON.stringify(solluContacts));
                    this.setState({
                        contacts: solluContacts,
                    })
                })
            }
        });
    }

     navigateToChatScreen = (receiverPhoneNumber, receiverName) => {
        let participants = {
            sender: "9491173782",
            receiver: receiverPhoneNumber
        };
        this.props.navigation.navigate('ChatScreen',
            {participants: participants, contactName: receiverName});
    }
    onContactPress = (contact) => {
       this.navigateToChatScreen(contact.item.key, contact.item.name)
    };

    static navigationOptions = ({navigation}) => {
        return (Header("Sollu"))
    };

    render() {
        return (
            <HomeView contacts={this.state.contacts} onContactPress={this.onContactPress}/>
        )
    }
}
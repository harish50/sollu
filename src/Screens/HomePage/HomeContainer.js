import React, {Component} from 'react';
import HomeView from './HomeView'
import {getSolluContacts, requestContactsPermission} from "./Contacts";
import {AsyncStorage, Text, TouchableOpacity} from "react-native";
import {Header} from "../Header/HeaderView";
import styles from "../../../Stylesheet/styleSheet";

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
    renderContact = (contact) => {
        return (
            <TouchableOpacity onPress={() => {
                this.onContactPress(contact)
            }} style={styles.contactContainer}>
                <Text style={styles.item}> {contact.item.name} </Text>
            </TouchableOpacity>

        );
    };
    onContactPress = (contact) => {
        let participants = {
            sender: "9491173782",
            receiver: contact.item.key
        };
        this.props.navigation.navigate('ChatScreen',
            {participants: participants, contactName: contact.item.name});
    };

    static navigationOptions = ({navigation}) => {
        return (Header("Sollu"))
    };

    render() {
        return (
            <HomeView contacts={this.state.contacts} renderContact = {this.renderContact}/>
        )
    }
}
import React, {Component} from 'react';
import HomeView from './HomeView'
import {getSolluContactsFromDB, requestContactsPermission} from "./Contacts";
import {AsyncStorage} from "react-native";
import {Header} from "../Header/HeaderView";
import {createNotificationListeners} from "../../NotificationService/Listeners";
import ProfileIconContainer from "../Profile/ProfileIconContainer";
import {setCurrentUser} from "../ChatPage/CurrentUser";
import {getFromLocalStorage} from "../../Utilities/LocalStorage";

let user = null;
export default class HomeContainer extends Component {
    state = {
        contacts: [],
        isPermitted: false
    };

    async componentDidMount() {
        user = await getFromLocalStorage('PhoneNumber');
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

    getPermissionToLocalContacts = async () => {
        return await requestContactsPermission();
    };

    getSolluLocalContacts = async () => {
        await AsyncStorage.getItem('solluContacts').then(async (localSolluContacts) => {
            if (localSolluContacts) {
                this.setState({contacts: await JSON.parse(localSolluContacts) || []});
            }
        });
        getSolluContactsFromDB().then((solluContacts) => {
            AsyncStorage.setItem("solluContacts", JSON.stringify(solluContacts));
            this.setState({contacts: solluContacts})
        })
    };

    navigateToChatScreen = async (receiverPhoneNumber, receiverName) => {
        let participants = {
            sender: user,
            receiver: receiverPhoneNumber
        };
        this.props.navigation.navigate('ChatContainer',
            {participants: participants, contactName: receiverName});
    }
    onContactPress = (contact) => {
        setCurrentUser(contact.item.key)
        this.navigateToChatScreen(contact.item.key, contact.item.name)
    };

    static navigationOptions = ({navigation}) => {
        const headerRight = <ProfileIconContainer navigation={navigation} user={user}/>
        return (Header("Sollu", null, headerRight))
    };

    render() {
        return (
            <HomeView contacts={this.state.contacts} onContactPress={this.onContactPress}/>
        )
    }
}
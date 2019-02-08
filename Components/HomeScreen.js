import React from "react";
import { View, Text, FlatList, TouchableOpacity, Platform, PermissionsAndroid,ActivityIndicator,StyleSheet,AsyncStorage } from 'react-native';
import styles from "../Stylesheet/styleSheet";
import Contacts from 'react-native-contacts';
import firebase from '../firebase/firebase';
import Profile from './Profile';
import Firebase from 'react-native-firebase';


export default class HomeScreen extends React.Component {
    state = {
        contacts: [],
        currentUser: '',
    };

    //1
    async checkPermission() {
        const enabled = await Firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await Firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
        const user = this.props.navigation.getParam("sender");
        firebase.database().ref('registeredUserProfileInfo').child(user).child("pushToken").set(fcmToken);
    }

    //2
    async requestPermission() {
        try {
            await Firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }
    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async createNotificationListeners() {
        /*
        * Triggered when a particular notification has been received in foreground
        * */

        const channel = new Firebase.notifications.Android.Channel(
            '001',
            'Channel Name',
            Firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        Firebase.notifications().android.createChannel(channel);
        this.notificationListener = Firebase.notifications().onNotification(async (notification) => {
            console.log("Frontgrond");
            // if(appState==='foreground'){console.log("Foreground")}
            if (Platform.OS === 'android') {
                const contactName = await AsyncStorage.getItem(notification.data.sender);
                const data = {
                    sender: notification.data.receiver,
                    receiver: notification.data.sender,
                }
                if (contactName === this.state.currentUser) {
                    return;
                }
                const localNotification = new Firebase.notifications.Notification({
                    show_in_foreground: true,
                }).setNotificationId(notification.notificationId)
                    .setTitle(contactName)
                    .setBody(notification.body)
                    .setData(data)
                    .setSound('default')
                    .android.setAutoCancel(true)
                    .android.setChannelId(channel.channelId)
                    .android.setPriority(Firebase.notifications.Android.Priority.High);

                Firebase.notifications().displayNotification(localNotification)
                    .catch(err => console.error("cant send"));

            }
            else if (Platform.OS === 'ios') {
                const localNotification = new Firebase.notifications.Notification({
                    show_in_foreground: true,
                }).setNotificationId(notification.notificationId)
                    .setTitle(contactName)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(data)
                    .setSound('default')
                    .ios.setBadge(notification.ios.badge);
                Firebase.notifications().displayNotification(localNotification)
                    .catch(err => console.error("cant send"));
            }
        });

        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = Firebase.notifications().onNotificationOpened(async (notificationOpen) => {
            const notification = notificationOpen.notification;
            const data = notification.data;
            console.log(data, "notification open back");
            const contactName = await AsyncStorage.getItem(data.receiver);
            let info = {
                receiver: data.receiver,
                sender: data.sender,
            }
            this.props.navigation.navigate('ChatScreen', { info: info, contactName: contactName }, { onGoBack: () => this.updateCurrentUser() });
        });

        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await Firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const notification = notificationOpen.notification;
            const data = notification.data;
            console.log(data, "notification close");
            const contactName = await AsyncStorage.getItem(data.receiver);
            let info = {
                receiver: data.receiver,
                sender: data.sender,
            }
            this.props.navigation.navigate('ChatScreen', { info: info, contactName: contactName }, { onGoBack: () => this.updateCurrentUser() });
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = Firebase.messaging().onMessage((message) => {
            //process data message
            console.log(JSON.stringify(message));
        });
    }
    updateCurrentUser() {
        this.setState({ currentUser: '' });
    }

    showAlert(title, body) {
        alert(title + body);
    }
    async requestContactsPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (error) {
            return Platform.OS === "ios" ? true : false;
        }
    }
    async componentDidMount() {
        const permission = await this.requestContactsPermission();
        if (!permission) {
            alert(permission);
            return;
        }
        let db = firebase.database();
        let localContacts = [];
        localContacts.push( {
            key: this.props.navigation.getParam("sender"),
            name: "You",
        })
        Contacts.getAll((err, contacts) => {
            if (err) throw err;
            else {
                db.ref("registeredUsers").once('value', async (registeredUsers) => {
                    for (let i = 0; i < contacts.length; i++) {
                        if (contacts[i].phoneNumbers.length !== 0) {
                            let number = contacts[i].phoneNumbers[0].number.replace(/\D/g, '');
                            let trimmedNumber = number;
                            if (number.length == 12) {
                                trimmedNumber = number.substring(2);
                            }
                            number = trimmedNumber;
                            if (number) {
                                if (number && registeredUsers.hasChild(number)) {
                                    localContacts.push({
                                        key: number,
                                        name: contacts[i].givenName
                                    });
                                    await AsyncStorage.setItem(number, contacts[i].givenName);
                                }
                            }
                        }
                    }
                    this.setState({
                        contacts: [...this.state.contacts, ...localContacts]
                    })
                });
            }
        })
        this.checkPermission();
        this.createNotificationListeners();
    }

    renderName(contact) {
        let info = {
            sender: this.props.navigation.getParam("sender"),
            receiver: contact.item.key
        }
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ChatScreen', { info: info, contactName: contact.item.name }, { onGoBack: () => this.updateCurrentUser() });
                this.setState({ currentUser: contact.item.name })
            }} style={styles.contactContainer}>    
                <Profile sender={contact.item.key} />
                <Text style={styles.item}> {contact.item.name} </Text>
            </TouchableOpacity>
        );
    }

    static navigationOptions = ({ navigation }) => {
        let props = navigation;
        return (
            {
                headerTitle: 'Sollu',
                headerBackTitle: "Back",
                headerTintColor: "white",
                headerStyle: {
                    fontFamily: 'Roboto-Bold',
                    backgroundColor: '#cc504e',
                    height: 60,
                },
                headerRight: (<Profile sender={props.getParam("sender")} navigation={props} />),
            }
        );
    };
    render() {
        if(this.state.contacts.length === 0) {
            return (<View style={[styles.loadingIcon, styles.loadShape]}>
                    <ActivityIndicator size="large" color='#cc504e'/>
                </View>
            );
        }else if(this.state.contacts.length <= 0){
            return(<View style={[styles.loadingIcon, styles.loadShape]}>
                    <Text style={styles.loadingText}>No Registered Contacts</Text>

                </View>
            );
        }else{
            return (
                <View>
                    <FlatList
                        data={this.state.contacts}
                        renderItem={this.renderName.bind(this)}
                        extradata={this.state}
                    />
                </View>
            );
        }
    }
}


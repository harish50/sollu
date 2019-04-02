import React from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View,
    Linking,
    StyleSheet
} from "react-native";
import styles from "../Stylesheet/styleSheet";
import Contacts from "react-native-contacts";
import firebase from "../firebase/firebase";
import Profile from "./Profile";
import Firebase from "react-native-firebase";

let sender = null;
let caller = null;
let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
export default class HomeScreen extends React.Component {
    state = {
        contacts: [],
        currentUser: "",
        remoteStream: '',
        streamVideo: false
    };

    async checkPermission() {
        const enabled = await Firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem("fcmToken");
        if (!fcmToken) {
            fcmToken = await Firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem("fcmToken", fcmToken);
            }
        }
        firebase
            .database()
            .ref("registeredUserProfileInfo")
            .child(sender)
            .child("pushToken")
            .set(fcmToken);
    }

    //videocall receiving side

    async requestPermission() {
        try {
            await Firebase.messaging().requestPermission();
            this.getToken();
        } catch (error) {
            console.log("permission rejected");
        }
    }

    componentWillUnmount() {
        this.notificationListener();
        this.notificationOpenedListener();
        VIDEO_CALL_REF.child(sender).child("flag").remove();
    }

    async createNotificationListeners() {
        const channel = new Firebase.notifications.Android.Channel(
            "001",
            "Channel Name",
            Firebase.notifications.Android.Importance.Max
        ).setDescription("A natural description of the channel");
        Firebase.notifications().android.createChannel(channel);

        this.notificationListener = Firebase.notifications().onNotification(
            async notification => {
                console.log("onNotofication")
                if(notification.body === "Incoming video call. Tap to open")
                {
                    return;
                }
                const contactName = await AsyncStorage.getItem(
                    notification.data.sender
                );
                const data = {
                    sender: notification.data.receiver,
                    receiver: notification.data.sender
                };
                if (contactName === this.state.currentUser) {
                    return;
                }
                const localNotification = new Firebase.notifications.Notification({
                    show_in_foreground: true
                })
                    .setNotificationId(notification.notificationId)
                    .setTitle(contactName)
                    .setBody(notification.body)
                    .setData(data)
                    .setSound("default");
                if (Platform.OS === "android") {
                    localNotification.android
                        .setAutoCancel(true)
                        .android.setChannelId(channel.channelId)
                        .android.setPriority(Firebase.notifications.Android.Priority.High);
                } else if (Platform.OS === "ios") {
                    localNotification.ios.setBadge(notification.ios.badge);
                }
                Firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error("cant send"));
            }

        );

        this.notificationOpenedListener = Firebase.notifications().onNotificationOpened(
            async notificationOpen => {
                    const notification = notificationOpen.notification
                    const data = notification.data;
                    const contactName = await AsyncStorage.getItem(data.receiver);
                    let info = {
                        receiver: data.receiver,
                        sender: data.sender
                    };
                    this.props.navigation.navigate(
                        "ChatScreen",
                        {info: info, contactName: contactName},
                        {onGoBack: () => this.updateCurrentUser()}
                    );
            }
        );

        const notificationOpen = await Firebase.notifications().getInitialNotification()
        if (notificationOpen) {
            console.log("getInitialNotification");
            if(notificationOpen.notification.data.receiver === undefined){
                console.log("if passed")
                this.listenForVideoCall();
            }
            else{
                const notification = notificationOpen.notification;
                const data = notification.data;
                const contactName = await AsyncStorage.getItem(data.sender);
                let info = {
                    receiver: data.sender,
                    sender: data.receiver
                };
                this.props.navigation.navigate(
                    "ChatScreen",
                    {info: info, contactName: contactName},
                    {onGoBack: () => this.updateCurrentUser()}
                );
            }
        }


    }
    async updateCurrentUser() {
        this.setState({ currentUser: '' });
        this.setState({ contacts: []});
        this.updateList()
    }

    getPairID(sender, receiver) {
        let key = '';
        if (sender === receiver) {
            key = sender;
        } else if (sender > receiver) {
            key = receiver + sender;
        } else {
            key = sender + receiver;
        }
        return key;
    }

    async getLastActiveTime(sender, receiver) {
        let lastchatTime = 0;
        let key = this.getPairID(sender, receiver);
        await firebase.database().ref('conversations').once('value', async (snap) => {
            if (snap.hasChild(key)) {
                let time = snap.child(key).val().lastActiveTime;
                if (time) {
                    lastchatTime = time;
                    return time;
                }
            }
        });
        return lastchatTime;
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

    async getOrderedLocalContacts() {
        let db = firebase.database();
        let localContacts = [];
        Contacts.getAll((err, contacts) => {
            if (err) throw err;
            else {
                db.ref("registeredUsers").once("value", async registeredUsers => {
                    const time = await this.getLastActiveTime(sender, sender);
                    localContacts.push({
                        key: sender,
                        name: "You",
                        lastActiveTime: time
                    });
                    for (let i = 0; i < contacts.length; i++) {
                        if (contacts[i].phoneNumbers.length !== 0) {
                            let number = contacts[i].phoneNumbers[0].number.replace(
                                /\D/g,
                                ""
                            );
                            let trimmedNumber = number;
                            if (number.length == 12) {
                                trimmedNumber = number.substring(2);
                            }
                            number = trimmedNumber;
                            if (number) {
                                if (number && registeredUsers.hasChild(number)) {
                                    const time = await this.getLastActiveTime(sender, number);
                                    localContacts.push({
                                        key: number,
                                        name: contacts[i].givenName,
                                        lastActiveTime: time
                                    });
                                    AsyncStorage.setItem(number, contacts[i].givenName);
                                }
                            }
                        }
                    }
                    localContacts.sort(function (contact1, contact2) {
                        return contact2.lastActiveTime - contact1.lastActiveTime;
                    });
                    this.setState({
                        contacts: localContacts
                    })
                    await AsyncStorage.setItem('listofContacts', JSON.stringify(localContacts))
                });
            }
        });
    }

    async updateList(){
        let response = await AsyncStorage.getItem('listofContacts');
        if(response === null){
            this.getOrderedLocalContacts()
        }
        else{
            let listofContacts = await JSON.parse(response)||[];
            this.setState({
                contacts:listofContacts
            });
            this.getOrderedLocalContacts()
        }
    }

    listenForVideoCall() {
        VIDEO_CALL_REF.child(sender).child("flag").set(true);
        VIDEO_CALL_REF.child(sender).on("value", (snapshot) => {
            let videoCallInfo = snapshot.val();
            if (caller !== null && videoCallInfo !== null && caller === videoCallInfo.caller) {
                console.log("one");
            }
            else {
                caller = videoCallInfo !== null ? videoCallInfo.caller : null;
                console.log("two")
            }
            if (caller && videoCallInfo != null) {
                // this.listenOnCaller();
                console.log("three")
                this.props.navigation.navigate("AnswerVideoCall", {
                    callee: this.props.navigation.getParam("sender"),
                    caller: caller
                    // onGoBack: () => this.updateCurrentUser()
                });
            }
        });
    }

    componentWillMount() {
        sender = this.props.navigation.getParam("sender")
        console.log("in componentWillMount:" + sender);
    }

    async componentDidMount() {
        const permission = await this.requestContactsPermission();
        if (!permission) {
            alert(permission);
            return;
        }
        this.updateList();
        this.checkPermission();
        this.createNotificationListeners();
        this.listenForVideoCall();
    }

    renderName(contact) {
        let info = {
            sender: this.props.navigation.getParam("sender"),
            receiver: contact.item.key
        };
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('ChatScreen', { info: info, contactName: contact.item.name, onGoBack: () => this.updateCurrentUser() });
                this.setState({ currentUser: contact.item.name })
            }} style={styles.contactContainer}>
                <Profile sender={contact.item.key} />
                <Text style={styles.item}> {contact.item.name} </Text>
            </TouchableOpacity>
        );
    }

    static navigationOptions = ({navigation}) => {
        let props = navigation;
        return {
            headerTitle: "Sollu",
            headerBackTitle: "Back",
            headerTintColor: "white",
            headerStyle: {
                fontFamily: "Roboto-Bold",
                backgroundColor: "#cc504e",
                height: 60
            },
            headerRight: (
                <Profile sender={props.getParam("sender")} navigation={props}/>
            )
        };
    };

    render() {
        if (this.state.contacts.length === 0) {
            return (
                <View style={styles.loadingIcon}>
                    <ActivityIndicator size="large" color="#cc504e"/>
                    <View>
                        <Text style={styles.loadingtextbox}>Loading Contacts...</Text>
                    </View>
                </View>
            );
        } else if (this.state.contacts.length <= 0) {
            return (
                <View style={[styles.loadingIcon, styles.loadShape]}>
                    <Text style={styles.loadingText}>No Registered Contacts</Text>
                </View>
            );
        } else {
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
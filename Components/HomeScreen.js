import React from "react";
import {
    ActivityIndicator,
    AsyncStorage,
    FlatList,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import styles from "../Stylesheet/styleSheet";
import Contacts from "react-native-contacts";
import firebase from "../firebase/firebase";
import Profile from "./Profile";
import Firebase from "react-native-firebase";
import {mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, RTCView} from "react-native-webrtc";

let receiverIceList = [];
let pc = null;
export default class HomeScreen extends React.Component {
    state = {
        contacts: [],
        currentUser: ""
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
        const user = this.props.navigation.getParam("sender");
        firebase
            .database()
            .ref("registeredUserProfileInfo")
            .child(user)
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
                const notification = notificationOpen.notification;
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

        const notificationOpen = await Firebase.notifications().getInitialNotification();
        if (notificationOpen) {
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

    updateCurrentUser() {
        this.setState({currentUser: ""});
        this.setState({contacts: []});
        this.getOrderedLocalContacts();
    }

    getPairID(sender, receiver) {
        let key = "";
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
        await firebase
            .database()
            .ref("conversations")
            .once("value", async snap => {
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

    getOrderedLocalContacts() {
        let db = firebase.database();
        let localContacts = [];
        let sender = this.props.navigation.getParam("sender");
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
                        contacts: [...this.state.contacts, ...localContacts]
                    });
                });
            }
        });
    }

    sendICE(senderNumber, ICE) {
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        let sender = this.props.navigation.getParam("sender")
        console.log("sender:"+sender);
        console.log("Checking ICE : ")
        console.log(ICE)
        VIDEO_CALL_REF.child(sender).child('ICE').set(ICE);
    }

    listenForVideoCall() {
        let caller = null;
        let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
        var servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };

        pc = new RTCPeerConnection(servers);
        VIDEO_CALL_REF.child(this.props.navigation.getParam("sender")).on("value", (snapshot) => {
            let videoCallInfo = snapshot.val()
            if (caller !== null && videoCallInfo !== null && caller === videoCallInfo.caller) {
                return;
            }
            else {
                caller = videoCallInfo !== null ? videoCallInfo.caller : null;
            }
            if (videoCallInfo !== null && videoCallInfo.isVideoReceiveCall === true) {
                const {isFront} = this.state;
                let sender = this.props.navigation.getParam("sender")
                console.log("sender:"+sender);

                pc.onicecandidate = (event => {
                        console.log('Printing event');
                        console.log(event.candidate);
                        if (event.candidate != null) {
                            receiverIceList.push(event.candidate);
                            console.log("inside onicecandidate");
                            // console.log(event.candidate)
                            console.log(receiverIceList)
                        }
                        else {
                            console.log("No ice found")
                            let index = 0;
                            for(let ice in receiverIceList){
                                VIDEO_CALL_REF.child(this.props.navigation.getParam("sender")).child('ICE').push(receiverIceList[ice]);
                                console.log("pushing to fb");
                            }
                        }
                    }
                );

                pc.onaddstream = (event => {
                    console.log("event stream.......");
                    console.log(event.stream);
                });

                VIDEO_CALL_REF.child(videoCallInfo.caller).on('child_added', (snapshot) => {
                    console.log("Waiting for SDP")
                    console.log(snapshot.val());
                    if(snapshot.key==='videoSDP'){
                        console.log("inside if");
                        pc.setRemoteDescription(new RTCSessionDescription(snapshot.val())).then(()=>{
                            console.log("Accesing my media")
                            mediaDevices.getUserMedia({
                            audio: true,
                            video: {
                                mandatory: {
                                    minWidth: 320, // Provide your own width, height and frame rate here
                                    minHeight: 240,
                                    minFrameRate: 30
                                },
                                facingMode: isFront ? "user" : "environment",
                                // optional: videoSourceId ? [{ sourceId: videoSourceId }] : []
                            }
                        }).then((stream) => {
                            pc.addStream(stream);
                            console.log("stream added");
                        });}).then(() => {
                            console.log("in getting snapshot");
                            pc.createAnswer().then((sdp) => {
                                console.log("in create answer");
                                // console.log(sdp);
                                pc.setLocalDescription(sdp).then(() => {
                                    console.log("localdescription");
                                    // console.log(pc.localDescription);
                                    VIDEO_CALL_REF.child(this.props.navigation.getParam("sender")).child('videoSDP').set(pc.localDescription);
                                });
                            });
                        });
                    }
                    else if(snapshot.key==='ICE'){
                        VIDEO_CALL_REF.child(videoCallInfo.caller).child("ICE").on('child_added', (snapshot) => {
                            console.log("adding ice");
                            console.log(pc.addIceCandidate(new RTCIceCandidate({
                                sdpMLineIndex: snapshot.val().sdpMLineIndex,
                                candidate: snapshot.val().candidate
                            })));
                            // console.log(snapshot.val());
                            console.log("ice candidate added");
                        })
                    }
                });
            }
        });
    }

    async componentDidMount() {
        const permission = await this.requestContactsPermission();
        if (!permission) {
            alert(permission);
            return;
        }
        this.getOrderedLocalContacts();
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
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("ChatScreen", {
                        info: info,
                        contactName: contact.item.name,
                        onGoBack: () => this.updateCurrentUser()
                    });
                    this.setState({currentUser: contact.item.name});
                }}
                style={styles.contactContainer}
            >
                <Profile sender={contact.item.key}/>
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
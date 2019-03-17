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
import FontAwesome,{Icons} from "react-native-fontawesome";

let receiverIceList = [];
let senderIceList=[];
let caller = null;
let pc = null;
let sender = null;
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
        senderIceList = [];
        receiverIceList = [];
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

    // sendICE(senderNumber, ICE) {
    //     let VIDEO_CALL_REF = firebase.database().ref("videoCallInfo");
    //     console.log("sender:" + sender);
    //     console.log("Checking ICE : ");
    //     console.log(ICE);
    //     VIDEO_CALL_REF.child(sender).child('ICE').set(ICE);
    // }
    //


    async getLocalStream(){
        await mediaDevices.getUserMedia({
            audio: true,
            video: {
                mandatory: {
                    minWidth: 320, // Provide your own width, height and frame rate here
                    minHeight: 240,
                    minFrameRate: 30
                },
                facingMode: "user"
            }
        }).then(async (stream) => {
            await pc.addStream(stream);
            console.log("stream added");
        });
        console.log("in getLocalStream return true");
        return true;
    }

    async addRemoteICE() {
        let temp=-1;
        let index =0;
        for(;index<senderIceList.length&&temp!==index;){
            temp=index;
            await pc.addIceCandidate(new RTCIceCandidate(senderIceList[index])).then(
                () => {
                    console.log("add ice succeeded");
                    index++;
                },
                error => {
                    console.log("error");
                    console.log(error);
                }
            )
        }
        if(index===senderIceList.length){
            console.log("out from addICE");
            return true;
        }
    }

    answerTheCall() {
        pc.createAnswer().then(async (sdp) => {
            console.log("in create answer");
            pc.setLocalDescription(sdp).then(() => {
                console.log("localdescription");
                VIDEO_CALL_REF.child(this.props.navigation.getParam("sender")).child('videoSDP').set(pc.localDescription);
            })
        });
    }

    listenOnCaller(){
        let servers = {
            'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {
                'urls': 'turn:numb.viagenie.ca',
                'credential': 'webrtc',
                'username': 'websitebeaver@mail.com'
            }]
        };
        pc = new RTCPeerConnection(servers);
        VIDEO_CALL_REF.child(caller).on('child_added', async (callerSnap) => {
            if(callerSnap.key==='videoSDP'){
                console.log("videoSDP");
                let flag = false;
                flag = await this.getLocalStream();
                if(flag){
                    pc.setRemoteDescription(new RTCSessionDescription(callerSnap.val())).then(()=>{console.log("setremotedescription")},error=>{console.log(error)});
                }
            }
            else if(callerSnap.key==='ICE'){
                if (senderIceList.length !== 0){
                    senderIceList = [];
                }
                senderIceList = callerSnap.val();
                console.log("added into senderIceList");
                let flag;
                flag = await this.addRemoteICE();
                console.log("flag from addRemoteICE:",flag);
                if(flag){
                    console.log("inside flag to start answer");
                    this.answerTheCall();

                }
            }
        });
        pc.onicecandidate = (event => {
                console.log('Printing event');
                if (event.candidate != null) {
                    receiverIceList.push(event.candidate);
                    console.log("inside onicecandidate");
                }
                else {
                    console.log("No ice found")
                    VIDEO_CALL_REF.child(this.props.navigation.getParam("sender")).child('ICE').set(receiverIceList);
                    this.setState({
                        streamVideo: true
                    })
                    console.log("pushing to fb");
                }
            }
        );
        pc.onaddstream = ((event) => {
            console.log("onaddstream");
            console.log(event.stream);
            this.setState({
                remoteStream: event.stream
            });
        });
        // pc.onaddtrack=((event)=> {console.log("onaddtrack"); console.log(event.stream)});
        // let stream = pc.getRemoteStreams()[0];
        //
        // console.log("getRemoteSreams");
        // console.log(stream);
    }


    listenForVideoCall() {
        VIDEO_CALL_REF.child(sender).child("flag").set(true);
            VIDEO_CALL_REF.child(sender).on("value", (snapshot) => {
                let videoCallInfo = snapshot.val();
                if (caller !== null && videoCallInfo !== null && caller === videoCallInfo.caller) {
                    return;
                }
                else {
                    caller = videoCallInfo !== null ? videoCallInfo.caller : null;
                }
                if(caller && videoCallInfo!=null){
                    this.listenOnCaller();
                }
            });
    }

    componentWillMount(){
        sender = this.props.navigation.getParam("sender")
        console.log("in componentWillMount:"+sender);
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
        if(this.state.remoteStream&&this.state.streamVideo){
            console.log("In the render method")
            return (
                <View style={styles.container}>
                    <RTCView streamURL={this.state.remoteStream.toURL()} style={styles.video1}/>
                    <View style={styles.callIcon}>
                        <TouchableOpacity>
                            <Text style={styles.phoneCallBox}>
                                <FontAwesome>{Icons.phoneSquare}</FontAwesome>
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.phoneCallBox}>
                                <FontAwesome>{Icons.videoSlash}</FontAwesome>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
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
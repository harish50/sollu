import {sendMessage} from "../../Utilities/Firebase";
import firebase from "../../../firebase/firebase";
import styles from "../../../Stylesheet/styleSheet";
let CONVERSATIONS_REF = firebase.database().ref("conversations");
let REGISTERED_USER_PROFILE_INFO_REF = firebase.database().ref("registeredUserProfileInfo");

export const getTime = (item) =>{
    let time=null;
    if(item.createdAt!==undefined && item.createdAt){
        let minutes = '' + item.createdAt.getMinutes();
        if (minutes.length < 2) minutes = '0' + minutes;
        let hours = '' + item.createdAt.getHours();
        if (hours.length < 2) hours = '0' + hours;
        time = hours + ":" + minutes;
    }
    return time;
};

export const getMessageRenderingStyles = (participants, item) =>{
    let messageboxstyle;
    let messagetextstyle;
    let phoneNo = participants.sender;
    if (item._id === 0) {
        messageboxstyle = styles.selfMessageContainer;
        messagetextstyle = styles.selfTextContainer;
    }
    else if (item._id === 2) {
        messageboxstyle = [styles.senderMessageContainer, styles.chatBox];
        messagetextstyle = styles.senderMessage;
    } else {
        messageboxstyle = [styles.receiverMessageContainer, styles.chatBox];
        messagetextstyle = styles.receiverMessage;
        phoneNo = participants.receiver;
    }
    return [messageboxstyle,messagetextstyle, phoneNo];
};

export const sendMessageAndSetLastActiveTime = (participants, message) => {
    if (message.trim() === '') {
        return;
    }
    let msg = {
        _id: 2,
        text: message.trim(),
        createdAt: new Date().getTime(),
    };
    if (participants.sender === participants.receiver) {
        msg._id = 0;
        sendMessage(participants.sender, participants.receiver, msg);
    }
    else {
        sendMessage(participants.sender, participants.receiver, msg);
        msg._id = 1;
        sendMessage(participants.receiver, participants.sender, msg);
    }
    setLastActiveTime(participants,msg.createdAt);
};

export const getPairID = (participants) => {
    let key = '';
    if (participants.sender === participants.receiver) {
        key = participants.sender;
    }
    else if (participants.sender > participants.receiver) {
        key = participants.receiver + participants.sender;
    }
    else {
        key = participants.sender + participants.receiver;
    }
    return key;
};

export const setLastActiveTime = (participants, time) => {
    let key = getPairID(participants);
    CONVERSATIONS_REF.child(key).set({'lastActiveTime': time});
};

export const isColorDiffers = (participants) => {
    let colorDifference = false;
    const senderInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.sender);
    const receiverInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.receiver);
    senderInfoRef.once('value', (senderSnap) => {
        let sender = senderSnap.val();
        receiverInfoRef.on('value', (receiverSnap) => {
            let receiver = receiverSnap.val();
            if (receiver === null) {
                return;
            }
            if ((sender.imageURL === undefined && receiver.imageURL === undefined)) {
                if ((sender.Gender === undefined && receiver.Gender === undefined) || (sender.Gender === receiver.Gender)) {
                    colorDifference = true;
                }
            } else if (sender.imageURL === receiver.imageURL) {
                colorDifference = true;
            }
        })
    });
    return colorDifference;
};

export const filterMessagesDayWise = (messages) => {
    if (messages.length === 0) {
        return [];
    }
    let messagesLength = messages.length;
    let daywiseFilteredMessages = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let lastDate = monthNames[messages[0].createdAt.getMonth()] + " " + messages[0].createdAt.getDate() + " " + messages[0].createdAt.getFullYear();
    daywiseFilteredMessages.push({
        text: lastDate,
        header: true
    });
    for (let counter = 0; counter < messagesLength; counter++) {
        let day = monthNames[messages[counter].createdAt.getMonth()] + " " + messages[counter].createdAt.getDate() + " " + messages[counter].createdAt.getFullYear();
        if (day !== lastDate) {
            daywiseFilteredMessages.push({
                text: day,
                header: true
            });
            lastDate = day;
        }
        daywiseFilteredMessages.push(messages[counter]);
    };
    return daywiseFilteredMessages;
};
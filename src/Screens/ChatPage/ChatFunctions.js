import {sendMessage} from "./ChatService";
import {getPairID} from "../../Utilities/GenericFunctions";
import firebase from "../../../Firebase/firebase";
import styles from "./ChatStyles";
import _ from 'lodash'

let CONVERSATIONS_REF = firebase.database().ref("conversations");
let REGISTERED_USER_PROFILE_INFO_REF = firebase.database().ref("registeredUserProfileInfo");

export const getTime = (item) => {
    let time = null;
    if (!_.isNil(item.createdAt)) {
        let minutes = '' + item.createdAt.getMinutes();
        if (minutes.length < 2) minutes = '0' + minutes;
        let hours = '' + item.createdAt.getHours();
        if (hours.length < 2) hours = '0' + hours;
        time = hours + ":" + minutes;
    }
    return time;
};

export const getMessageRenderingStyles = (participants, item) => {
    if (!_.isNil(participants) && !_.isNil(item)) {
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
        return [messageboxstyle, messagetextstyle, phoneNo];
    }
    return false;
};

export const sendMessageAndSetLastActiveTime = (participants, message) => {
    if (_.isEmpty(message.trim())) {
        return;
    }
    if(!_.isNil(participants)) {
        let msg = {
            _id: 2,
            text: message.trim(),
            createdAt: new Date().getTime(),
        };
        if (_.isEqual(participants.sender, participants.receiver)) {
            msg._id = 0;
            sendMessage(participants.sender, participants.receiver, msg);
        }
        else {
            sendMessage(participants.sender, participants.receiver, msg);
            msg._id = 1;
            sendMessage(participants.receiver, participants.sender, msg);
        }
        setLastActiveTime(participants, msg.createdAt);
    }
    return null;
};

export const setLastActiveTime = (participants, time) => {
    let key = getPairID(participants.sender, participants.receiver);
    CONVERSATIONS_REF.child(key).set({'lastActiveTime': time});
};

export const getColorDifference = (participants) => {
    let colorDifference = false;
    const senderInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.sender);
    const receiverInfoRef = REGISTERED_USER_PROFILE_INFO_REF.child(participants.receiver);
    senderInfoRef.once('value', (senderSnap) => {
        let sender = senderSnap.val();
        receiverInfoRef.on('value', (receiverSnap) => {
            let receiver = receiverSnap.val();
            if (_.isNull(receiver)) {
                return;
            }
            if ( _.isUndefined(sender.imageURL) &&  _.isUndefined(receiver.imageURL)) {
                if ((sender.Gender === undefined && receiver.Gender === undefined) || (sender.Gender === receiver.Gender)) {
                    colorDifference = true;
                }
            } else if (_.isEqual(sender.imageURL,receiver.imageURL)) {
                colorDifference = true;
            }
        })
    });
    return colorDifference;
};

export const dayWiseFilteredMessages = (messages) => {
    if (messages.length === 0) {
        return [];
    }
    let messagesLength = messages.length;
    let filteredMessages = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let lastDate = monthNames[messages[0].createdAt.getMonth()] + " " + messages[0].createdAt.getDate() + " " + messages[0].createdAt.getFullYear();
    filteredMessages.push({
        text: lastDate,
        header: true
    });

    _.each(messages,(message)=>{
        let day = monthNames[message.createdAt.getMonth()] + " " + message.createdAt.getDate() + " " + message.createdAt.getFullYear();
        if (day !== lastDate) {
            filteredMessages.push({
                text: day,
                header: true
            });
            lastDate = day;
        }
        filteredMessages.push(message);
    });
    return filteredMessages;
};
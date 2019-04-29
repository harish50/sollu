import firebase from "../../../Firebase/firebase";
import _ from 'lodash';

let REGISTERED_USERS_REF = firebase.database().ref("registeredUsers");

export const sendMessage = (sender, receiver, message) => {
    REGISTERED_USERS_REF.child(sender).child("chat").child(receiver).push(message);
};


export const getChatFromDB = (sender, receiver) => {
    return new Promise(function (resolve, reject) {
        try {
            const chatRef = REGISTERED_USERS_REF.child(sender).child("chat").child(receiver);
            chatRef.on('value', function (data) {
                if (typeof data.val() === 'undefined') {
                    resolve(null);
                } else {
                    const chatData = data.val();
                    let chatMessages = [];

                    _.each(chatData,(messageData)=>{
                        const message = {
                            _id: messageData._id,
                            text: messageData.text,
                            createdAt: new Date(messageData.createdAt),
                        };
                        chatMessages.push(message);
                    });
                    resolve(chatMessages);
                }
            })
        } catch (e) {
            reject(e)
        }
    });
};
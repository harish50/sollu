import firebase from '../../firebase/firebase';
import {STRINGS} from "./StringsStore";
let REGISTERED_USERS_REF = firebase.database().ref("registeredUsers");

const usersRef = firebase.database().ref('Users');
export const registerUser = async (phoneNumber) => {
    usersRef.once('value', (registeredUsers) => {
        if (!registeredUsers.hasChild(phoneNumber)) {
            usersRef.child(phoneNumber).set(STRINGS.REGISTERED)
                .catch((error) => {
                    return error;
                });
            return true;
        }
    }).catch((error) => {
        return error;
    });
    return true;
};

export const sendMessage = (sender, receiver, message) => {
    REGISTERED_USERS_REF.child(sender).child("chat").child(receiver).push(message);
};


export const getChat = (sender, receiver) =>{
    return new Promise(function (resolve, reject) {
        try {
            const chatRef = REGISTERED_USERS_REF.child(sender).child("chat").child(receiver);
            chatRef.on('value', function (data) {
                if (typeof data.val() === 'undefined') {
                    resolve(null);
                } else {
                    console.log("in getchat:",data.val());
                    const chatData = data.val();
                    let chatMessages = [];
                    for (let chatID in chatData) {
                        const message = {
                            _id: chatData[chatID]._id,
                            text: chatData[chatID].text,
                            createdAt: new Date(chatData[chatID].createdAt),
                        };
                        chatMessages.push(message);
                    }
                    resolve(chatMessages);
                }
            })
        } catch (e) {
            reject(e)
        }
    });
};
// export const getChat = (sender, receiver) => {
//     const chatRef = REGISTERED_USERS_REF.child(sender).child("chat").child(receiver);
//    chatRef.on('value', (data) => {
//         console.log("getting chat info");
//         let Chat = [];
//         let chatData = data.val();
//         for (let chatID in chatData) {
//             const message = {
//                 _id: chatData[chatID]._id,
//                 text: chatData[chatID].text,
//                 createdAt: new Date(chatData[chatID].createdAt),
//             };
//             Chat.push(message);
//         }
//         console.log("in get Chat",Chat);
//         // let messages = this.filterMessagesDayWise(Chat);
//        return Chat;
//     })
// };

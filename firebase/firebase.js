import * as firebase from 'firebase';

let config = {
    apiKey: "AIzaSyD0hxHO6J52fGJryh7yDKEY-_qMkpxxhPU",
    authDomain: "chatbox-992a8.firebaseapp.com",
    databaseURL: "https://chatbox-992a8.firebaseio.com",
    projectId: "chatbox-992a8",
    storageBucket: "",
    messagingSenderId: "545822368567"
};
firebase.initializeApp(config);
export default firebase;
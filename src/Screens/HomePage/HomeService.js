import firebase from "../../../firebase/firebase";


const dbRef = firebase.database();
export const getData = (path) => {
    return new Promise(function (resolve, reject) {
        console.log("getData")
        try {
            dbRef.ref(path).once('value', (data) => {
                if (typeof data.val() === 'undefined') {
                    resolve(null)
                }
                else {
                    resolve(data)
                }
            })
        } catch (e) {
            console.log("one")
            console.log(e)
            reject(e)
        }
    })
};

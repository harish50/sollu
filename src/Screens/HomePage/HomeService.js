import firebase from "../../../firebase/firebase";
import _ from 'lodash'

const dbRef = firebase.database();
export const getData = (path) => {
    return new Promise(function (resolve, reject) {
        try {
            dbRef.ref(path).once('value', (data) => {
                if (_.isUndefined(data)) {
                    resolve(null)
                }
                else {
                    resolve(data)
                }
            })
        } catch (e) {
            reject(e)
        }
    })
};

import * as firebase from 'firebase'
import { AsyncStorage } from 'react-native'

export function CLogUser(email, pwd) {
    return new Promise(function (resolve, reject) {
        firebase.auth().signInWithEmailAndPassword(email, pwd).then(()=>{
            resolve(true)
        })
        .catch((err) => {
            reject(err)
        });
        
    })
}

import * as firebase from 'firebase'
import { AsyncStorage } from 'react-native'


export function GetCurrentUser() {
    return new Promise(function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                resolve(user)
            } else {
                reject(Error("None"))
            }
        })
    })
}

export function GetUserStorage() {
    return new Promise(function (resolve, reject) {
        try {
            GetStorageUserData((user) => {
                if (user) {
                    resolve(JSON.parse(user))
                } else {
                    resolve(null)
                }
            })
        } catch (error) {
            reject(error)
        }
    })
}

export function GetUserData() {
    return new Promise(function (resolve, reject) {
        var userId = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + userId).once('value')
            .then(function (snapshot) {
                if (snapshot.val() != null) {
                    StorageUserData(snapshot.val(), () => {
                        resolve(snapshot.val())
                    });
                } else {
                    reject("No user info")
                }
            }).catch((err) => {
                reject(err);
            });
    })
}

export function LogOut() {

    return firebase.auth().signOut();
}

const GetStorageUserData = async (callback) => {
    const user = await AsyncStorage.getItem("data_user");
    return callback(user);
}

const StorageUserData = async (userData, callback) => {
    await AsyncStorage.setItem("data_user", JSON.stringify(userData))
    return callback(true);
}
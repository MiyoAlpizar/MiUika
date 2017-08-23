import * as firebase from 'firebase';
import { CrateJSONProp } from '../../globals/functions';

export function GetCenterStores(center) {
    return new Promise((resolve, reject) => {
        firebase.database().ref(`stores/${center}`)
            .once('value')
            .then((snapshot) => {
                if (snapshot.val() != null) {
                    const dataKeys = snapshot.val();
                    const data = [];
                    for (const key in dataKeys) {
                        dataKeys[key].key = key;
                        dataKeys[key].img = `${dataKeys[key].img}&v=${dataKeys[key].image_date}`;
                        data.push(dataKeys[key]);
                    }
                    if (data.length > 0) {
                        resolve(data);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function CUpdateStore(center, key, datastore) {
    return new Promise((resolve, reject) => {
        const refStore = firebase.database().ref(`stores/${center}`).child(key);
        refStore.update(datastore, (error) => {
            if (error === null) {
                resolve([key, datastore]);
            } else {
                reject(error);
            }
        });
    });
}

export function CUpdateStoreField(center, key, field, value, storeToEdit, isImage) {
    return new Promise((resolve, reject) => {
        try {
            const newValue = CrateJSONProp(field, value);
            newValue.last_change = Date.now();
            if (isImage) {
                newValue.image_date = Date.now();
            }

            firebase.database().ref(`stores/${center}`).child(key).update(newValue)
                .then(() => {
                    resolve(storeToEdit);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export function CPushStore(center) {
    return new Promise((resolve, reject) => {
        try {
            const key = firebase.database().ref(`stores/${center}`).push().key;
            resolve(key);
        } catch (error) {
            reject(error);
        }
    });
}


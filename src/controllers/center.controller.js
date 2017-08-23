import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { CrateJSONProp } from '../../globals/functions';

const GeoFire = require('geofire');

export function GetCenterInfo() {
    return new Promise((resolve, reject) => {
        const userId = firebase.auth().currentUser.uid;
        firebase.database().ref('centers').orderByChild('userId').equalTo(userId)
            .once('value')
            .then((snapshot) => {
                if (snapshot.val() != null) {
                    const dataKeys = snapshot.val();
                    const data = [];
                    for (const key in dataKeys) {
                        if (dataKeys[key].image_date) {
                             dataKeys[key].img_profile = `${dataKeys[key].img_profile}&v=${dataKeys[key].image_date}`;
                        }
                        data.push({ key, data: dataKeys[key] });
                    }
                    if (data.length > 0) {
                        StorageCenterData(data[0].data, data[0].key, () => {
                            resolve([data[0].data, data[0].key]);
                        });
                    } else {
                        resolve(null, null);
                    }
                } else {
                    reject('No center info');
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
}

export function UpdateCenterInfo(uid, field, value) {
    return new Promise((resolve, reject) => {
        try {
            const newValue = CrateJSONProp(field, value);
            firebase.database().ref('centers').child(uid).update(newValue)
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

const StorageCenterData = async (centerData, key, callback) => {
    await AsyncStorage.setItem('data_center', JSON.stringify(centerData));
    await AsyncStorage.setItem('key_center', JSON.stringify(key));
    return callback(true);
};

export const GetStorageCenterData = async () => {
    const center = await AsyncStorage.getItem('data_center');
    const key = await AsyncStorage.getItem('key_center');
    return [JSON.parse(center), JSON.parse(key)];
};

export function CUpdateCenterLocation(center, region) {
    return new Promise((resolve, reject) => {
        try {
            const firebaseRef = firebase.database().ref('geocenters');
            const geoFire = new GeoFire(firebaseRef);
            geoFire.set(center, [region.latitude, region.longitude])
                .then(() => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export function CUpdateCenter(center, centerdata) {
    return new Promise((resolve, reject) => {
        const refStore = firebase.database().ref('centers').child(center);
        refStore.update(centerdata, (error) => {
            if (error === null) {
                resolve([center, centerdata]);
            } else {
                reject(error);
            }
        });
    });
}

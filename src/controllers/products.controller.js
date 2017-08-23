import * as firebase from 'firebase';
import { CrateJSONProp } from '../../globals/functions';

export function CGetProductsStore(center, store) {
    return new Promise((resolve, reject) => {
        firebase.database().ref(`products/${center}/${store}`)
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

export function CPushProduct(center, store) {
    return new Promise((resolve, reject) => {
        try {
            const key = firebase.database().ref(`products/${center}/${store}`).push().key;
            resolve(key);
        } catch (error) {
            reject(error);
        }
    });
}

export function CUpdateProduct(center, store, key, data) {
    return new Promise((resolve, reject) => {
        const refStore = firebase.database().ref(`products/${center}/${store}`).child(key);
        refStore.update(data, (error) => {
            if (error === null) {
                resolve([key, data]);
            } else {
                reject(error);
            }
        });
    });
}

export function CUpdateProductField(center, store, key, field, value, dataToEdit, isImage) {
    return new Promise((resolve, reject) => {
        try {
            const newValue = CrateJSONProp(field, value);
            newValue.last_change = Date.now();
            if (isImage) {
                newValue.image_date = Date.now();
            }
            
            firebase.database().ref(`products/${center}/${store}`).child(key).update(newValue)
            .then(() => {
                resolve(dataToEdit);
            })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}

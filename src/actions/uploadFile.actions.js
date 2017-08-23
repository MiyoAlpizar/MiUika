import { UPLOADING_FILE, UPLOADING_FILE_SUCCESS, UPLOADING_FILE_FAILURE, UPLOADING_FILE_PROGRESS } from '../constants';
import * as firebase from 'firebase';
import fb from '../../libs/firebase';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const UploadingFile = () => ({
        type: UPLOADING_FILE
    });

export const UploadingFileProgress = (progress) => ({
        type: UPLOADING_FILE_PROGRESS,
        progress
    });

export const UploadingFileSuccess = (url) => ({
        type: UPLOADING_FILE_SUCCESS,
        url
    });

export const UploadingFileFailure = (error) => ({
        type: UPLOADING_FILE_FAILURE,
        message: error
    });

export function UploadFile(reference, uri, fileName, mime) {
    return (dispatch) => {
        dispatch(UploadingFile());
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        let uploadBlob = null;
        const imageRef = firebase.storage().ref(reference).child(fileName);
        return new Promise((resolve, reject) => {
            fs.readFile(uploadUri, 'base64')
                .then((data) => Blob.build(data, { type: `${mime};BASE64` }))
                .then((blob) => {
                    uploadBlob = blob;
                    const uploadTask = imageRef.put(blob, { contentType: mime });
                    uploadTask.on('state_changed', (snapshot) => {
                        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        while (progress > 100) {
                            progress /= 100;
                        }
                        dispatch(UploadingFileProgress(progress));
                    });
                    return uploadTask;
                })
                .then(() => {
                    uploadBlob.close();
                    return imageRef.getDownloadURL();
                })
                .then((url) => {
                    dispatch(UploadingFileSuccess(url));
                    resolve(url);
                })
                .catch((error) => {
                    dispatch(UploadingFileFailure(error));
                    reject(error);
                });
        });
    };
}

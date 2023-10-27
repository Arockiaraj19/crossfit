import React from 'react';
import { POST, GET } from '../constants';
import {
    NativeModules,
} from 'react-native';
import { getCommonParams, logoutSestion } from '../../helpers/AppManager';//'../../helpers/AppManager'
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import { BASEAPPURL, } from '../../utils';
import axios from 'axios';
import { AuthContext } from '../../components/AuthContext';

const baseURL = BASEAPPURL;
var bearer = 'Bearer ' + bearer_token;
export async function GET_FechInfoWithoutToken(userId, urlString,token) {
    let bearer_token = token;
    // console.log('baseURL + urlString ',baseURL + urlString + userId)
   
    console.log("BearerBearerBearerBearer",bearer)
    try {
        let response = await fetch(baseURL + urlString + userId, {
            method: GET,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
        });
        let responseJSON = await response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function GET_FechInfo(userId, urlString) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    console.log('baseURL + urlString ',baseURL + urlString + userId)
    // console.log('Bearer ','Bearer ' + bearer_token)
    var bearer = 'Bearer ' + bearer_token;
    try {
        let response = await fetch(baseURL + urlString + userId, {
            method: GET,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
        });
        let responseJSON = await response.json();
        console.log('responseJSONresponseJSONresponseJSON',responseJSON);
        if(responseJSON.statusCode == 400 || responseJSON.statusCode == 401) {
            logoutSestion('');
        }
        else if(responseJSON.statusCode == 409){
            logoutSestion(responseJSON.statusMessage);
        }
        else if(responseJSON.result == undefined) {
            return responseJSON;
        }
        else {
            return responseJSON;
        }
    } catch (error) {
        return error;
    }
}
export async function POST_FechInfo  (params, urlString) {
    var mainParams = await getEncryptionData(params);
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    // console.log('baseURL + urlString --------------', baseURL + urlString);
    //  console.log('bearerbearerbearerbearer --------------', mainParams);
    try {
        let response = await fetch(baseURL + urlString, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: JSON.stringify(mainParams)
        });
        let responseJSON = await response.json();
        if(responseJSON.statusCode == 400 || responseJSON.statusCode == 401) {
            logoutSestion('');
        }
        else if(responseJSON.statusCode == 409){
            logoutSestion(responseJSON.statusMessage);
        }
        else if(responseJSON.result == undefined) {
            return responseJSON;
        }
        else {
            return responseJSON;
        }
    } catch (error) {
        return error;
    }
}
export async function FileUpload_ProfileImageUpload(image_url, urlString, params, fieldName) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    let uploadDate = params;
    uploadDate.append(fieldName, { type: 'image/jpg', uri: image_url, name: 'profile_picture.jpg' });
    try {
        let response = await fetch(bas_url, {
            method: 'POST',
            headers: {
                'Accept': 'application/text',
                'Content-Type': 'multipart/form-data',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: uploadDate,
        })
        let responseJSON = response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function FileUpload_VideoUpload(video_url, urlString,) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    let uploadDate = new FormData();;
    uploadDate.append('video', { type: 'video/mp4', uri: video_url, name: 'video.mp4' });
    try {
        let response = await fetch(bas_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: uploadDate,
        });
        let responseJSON = await response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function videoUploadWithFormData(formData, video_url, urlString,) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    let uploadDate = formData;
    uploadDate.append('video', { type: 'video/mp4', uri: video_url, name: 'video.mp4' });
    try {
        let response = await fetch(bas_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: uploadDate,
        });
        let responseJSON = await response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function FileUpload_PDFUpload(formData, urlString,) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    try {
        let response = await fetch(bas_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: formData,
        });
        let responseJSON = await response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function ImageUploadToSertver(image_url, urlString) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    let uploadDate = new FormData();
    uploadDate.append('image', { type: 'image/jpg', uri: image_url, name: 'profile_picture.jpg' });
    try {
        let response = await fetch(bas_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
            },
            body: uploadDate,
        });
        let responseJSON = await response.json();
        return responseJSON;
    } catch (error) {
        return error;
    }
}
export async function UploadChatFiles(formData, urlString,) {
    let bearer_token = '';
    bearer_token = null;
    try {
        bearer_token = await EncryptedStorage.getItem("access_token");
    } catch (e) {
        console.log(e);
    }
    var bearer = 'Bearer ' + bearer_token;
    let bas_url = baseURL + urlString;
    const config = {
        onUploadProgress: progressEvent => {
            let { progress } = 0;
            progress = (progressEvent.loaded / progressEvent.total) * 100;
        }
    }
    const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': (bearer_token !== (Platform.OS === 'ios' ? undefined : null)) ? bearer : '',
    }
    axios({
        url: bas_url,
        method: 'POST',
        data: formData,
        headers: headers,
        onUploadProgress: progressEvent => {
            let { progress } = 0;
            progress = (progressEvent.loaded / progressEvent.total) * 100;
        }
    })
    .then(function (response) {
        return response;
    })
    .catch(function (error) {
        console.log("error from image :", error);
        return error;
    })
}
const getEncryptionData = async (params) => {
    var commonParams = await getCommonParams()
    var encryptParams = Object.assign({}, commonParams, params);
    return encryptParams
};


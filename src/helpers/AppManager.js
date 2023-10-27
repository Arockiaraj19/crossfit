import React, { useContext } from 'react';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
    Platform,
    Linking,
    Alert
} from 'react-native';
import 'intl';
import 'intl/locale-data/jsonp/en-IN';
import 'intl/locale-data/jsonp/en';
import Toast from 'react-native-toast-message';

export async function getAccessToken() {
    var accessToken = ''
    try {
        accessToken = await EncryptedStorage.getItem("access_token");
    } catch (error) {
    }
    return (accessToken !== (Platform.OS === 'ios' ? undefined : null)) ? accessToken : '';
}

export async function getUserName() {
    var userName = ''
    try {
        userName = await EncryptedStorage.getItem("userName");
    } catch (error) {
    }
    return (userName !== (Platform.OS === 'ios' ? undefined : null)) ? userName : '';
}

export async function getUserId() {
    var userId = ''
    try {
        userId = await EncryptedStorage.getItem("userId");
    } catch (error) {
    }
    return (userId !== (Platform.OS === 'ios' ? undefined : null)) ? userId : '';
}

export async function getHelpLineNumber() {
    var helpLineNumber = ''
    try {
        helpLineNumber = await EncryptedStorage.getItem("helpLineNumber");
    } catch (error) {
    }
    return (helpLineNumber !== (Platform.OS === 'ios' ? undefined : null)) ? helpLineNumber : '';
}

export async function getUserMobileNumber() {
    var MobileNo = ''
    try {
        MobileNo = await EncryptedStorage.getItem("MobileNo");
    } catch (error) {
    }
    return (MobileNo !== (Platform.OS === 'ios' ? undefined : null)) ? MobileNo : '';
}

export async function getUserProfileImage() {
    var ProfileImage = ''
    try {
        ProfileImage = await EncryptedStorage.getItem("ProfileImage");
    } catch (error) {
    }
    return (ProfileImage !== (Platform.OS === 'ios' ? undefined : null)) ? ProfileImage : '';
}
export async function getIsBack() {
    var userName = ''
    try {
        userName = await EncryptedStorage.getItem("isBack");
    } catch (error) {
    }
    return (userName !== (Platform.OS === 'ios' ? undefined : null)) ? userName : '';
}
export async function getPushToken() {
    var pushToken = ''
    try {
        pushToken = await EncryptedStorage.getItem("pushToken");
    } catch (error) {
    }
    return pushToken;
}
export function weightConvertKilogram(type, value) {
    var kilogram = value
    if(type == 'Quintal'){
        kilogram =  value * 100
    }
    else if(type == 'Ton'){
        kilogram = value * 1000
    }
   return parseFloat(kilogram)
}
export function currencyFormat(value){
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(value);
}

export const filterItem = (list, searchText) => {
    return list?.filter(
        (item) =>
            item?.Name?.replace(/\s/g, "").toLowerCase().includes(searchText.replace(/\s/g, "").toLowerCase())
    );
}

export const showToastMessage = (type, text1, text2, handleToastClick = () => { }) => {
    Toast.show({
        type,
        text1,
        text2,
        onPress: handleToastClick
    });
}


export const handlePhoneCall = async(phoneNum,navigation) => {
    if (phoneNum != '') {
        Linking.openURL(`tel:${phoneNum}`)
    }
    return;
    if (isMobileNumView) {
        if (phoneNum != '') {
            Linking.openURL(`tel:${phoneNum}`)
        }
    } else {
        Alert.alert('', 'You should add your address?', [{
            text: 'Cancel', onPress: () => {
                return;
            },
        },
        {
            text: 'Ok', onPress: () => {
                navigation.navigate('SelectStateScreen', { isType: '' });
            },
        },
        ]);
    }
}

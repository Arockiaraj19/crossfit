import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Platform, Alert, } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import gql from 'graphql-tag';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useMutation } from '@apollo/react-hooks';
import { useFocusEffect } from '@react-navigation/native';
import { getUserName, getUserId, getUserProfileImage ,getHelpLineNumber} from '../helpers/AppManager';


const DELETEACCOUNT_QUERY = gql`
mutation ($Id: ID!){
    deleteUserAccount(Id: $Id) 
  }
`;


const DeleteAccountScreen = ({ navigation, route }) => {
    const {
        deleteAccount,
        deleteMessage1,
        deleteMessage2,
        deleteMessage3,
        deleteMessage4,
        logoutCancel,
        setLoginToken,
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [deleteUserAccount, { loadingDelete, errorDetele, dataDelete }] = useMutation(DELETEACCOUNT_QUERY);
    const [userId, setUserId] = React.useState('');

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setTimeout(async () => {
                let userInfoId = await getUserId();
                setUserId(userInfoId)
            }, 500);
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {

    }, [])
    const onPressBack = () => {
        navigation.goBack();
    }
   const onPressDelete =()=> {
    setLoadingIndicator(true)
    deleteUserAccount({
        variables: { Id: userId}
    })
        .then(res => {
            setLoadingIndicator(false)
            setLoginToken('')
            setTimeout(async () => {
                try {
                    await EncryptedStorage.setItem('ProfileImage', '');
                    await EncryptedStorage.setItem('languageId', '1');
                } catch (e) {
                    console.log('error ---------------', e)
                }
            }, 100);
            setTimeout(async () => {
                try {
                    await EncryptedStorage.setItem('access_token', '');
                    await EncryptedStorage.setItem('userName', '');
                    await EncryptedStorage.setItem('userId', '');
                    await EncryptedStorage.setItem('MobileNo', '');
                    await EncryptedStorage.setItem('ProfileImage', '');

                } catch (e) {
                    console.log('error ---------------', e)
                }
            }, 100);
            console.log('res ------------------', res);
        })
        .catch(e => {
            setLoadingIndicator(false)
            console.log('errer ------------------', e.message);
        });
   }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <View style={styles.view_inner}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                        onPress={onPressBack}>
                        <Image style={{ width: 10, height: 18 }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{deleteAccount}</Text>
                </View>
            </View>
            <View style={{ alignItems: 'center', marginTop: 100, width: '100%', height: 100 }}>
                <Image style={{ width: 100, height: 100}}
                    source={images.WARNINGDELETE}>
                </Image>
            </View>
            <Text style={[styles.text_heading,]}>{deleteMessage1}</Text>
            <View style={{ marginTop: 20, marginLeft: 20, width: '90%', flexDirection: 'row', alignItems: 'center', }}> 
                <View style={{ width: 6, height: 6, marginLeft: 5, borderRadius: 3, backgroundColor: '#e22525'}}>
                </View>
                <Text style={[styles.text_message,]}>{deleteMessage2}</Text>
            </View>
            <View style={{ marginTop: 8, marginLeft: 20, width: '90%', flexDirection: 'row', alignItems: 'center', }}> 
                <View style={{ width: 6, height: 6, marginLeft: 5, borderRadius: 3, backgroundColor: '#e22525'}}>
                </View>
                <Text style={[styles.text_message,]}>{deleteMessage3}</Text>
            </View>
            <View style={{ marginTop: 8, marginLeft: 20, width: '90%', flexDirection: 'row', alignItems: 'center', }}> 
                <View style={{ width: 6, height: 6, marginLeft: 5, borderRadius: 3, backgroundColor: '#e22525'}}>
                </View>
                <Text style={[styles.text_message,]}>{deleteMessage4}</Text>
            </View>

            <View style={{ marginTop: 50,  width: '100%', alignItems: 'center'}}>
            <TouchableOpacity style={{ width: '90%', height: 40, backgroundColor: '#fbc4c4', justifyContent: 'center', alignItems: 'center', borderRadius: 4,}}
                onPress={onPressDelete}>
                <Text style={[styles.text_delete,]}>{deleteAccount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10, width: '90%', height: 40, backgroundColor: 'white', borderRadius: 4, justifyContent: 'center', alignItems: 'center',}}
                onPress={onPressBack}>
              <Text style={[styles.text_delete,{ color: '#333333'}]}>{logoutCancel}</Text>
            </TouchableOpacity>
            </View>
            {loadingIndicator && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff3f3',
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (Platform.OS == 'android') ? 10 : 40,
        width: '100%',
        height: 40,
    },
    text_title: {
        marginLeft: 25,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: colors.black_color,
    },
    text_heading: {
        marginTop: 50,
        marginLeft: 25,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        justifyContent: 'center',
        fontSize: 18,
        color: '#333333',
    },
    text_message: {
        marginLeft: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 13,
        color: '#444444',
    },
    text_delete: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        justifyContent: 'center',
        fontSize: 16,
        color: '#333333',
    },
});

export default DeleteAccountScreen;


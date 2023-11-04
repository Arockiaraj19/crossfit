import { useMutation } from '@apollo/react-hooks';
import { useFocusEffect } from '@react-navigation/native';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useRef } from 'react';
import { Alert, BackHandler, Image, Linking, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DeviceInfo from 'react-native-device-info';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as ImagePicker from "react-native-image-picker";
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import { getHelpLineNumber, getUserId, getUserName, getUserProfileImage } from '../helpers/AppManager';
import uploadImageToStorage from '../helpers/uploadImage';
//  import { ScrollView } from 'react-native-gesture-handler';

const UPDATEPROFILEIMAGE_QUERY = gql`
mutation ($Id: ID!, $ProfilePicPath: String!){ 
    updateUserProfilePic(Id: $Id , ProfilePicPath: $ProfilePicPath) 
    
  }
`;


const ProfileDetailScreen = ({ navigation, route }) => {
    const {
        profileText,
        editProfileText,
        personalInformation,
        locationDetail,
        farmDetails,
        logout,
        setLoginToken,
        viewLot,
        bidView,
        mandiRate,
        viewEnquiries,
        logoutYes,
        logoutCancel,
        areYouSure,
        helpLine,
        deleteAccount,
        setEnableLogin
    } = useContext(AuthContext);

    const [updateUserProfilePic, { loading, error, data }] = useMutation(UPDATEPROFILEIMAGE_QUERY);
    const [userName, setUserName] = React.useState('');
    const [profileImageUrl, setProfileImageUrl] = React.useState('');
    const [uuid, setUUID] = React.useState('');
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [userId, setUserId] = React.useState('');
    const [helpLineNumber, setHelpLineNumber] = React.useState('');
    let options = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.3,
    };

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setTimeout(async () => {
                let name = await getUserName();
                let userInfoId = await getUserId();
                let helpLineNumber = await getHelpLineNumber();
                let profileImage = await getUserProfileImage();
                setProfileImageUrl(profileImage)
                setUserId(userInfoId)
                setUserName(name);
                setHelpLineNumber(helpLineNumber);
            }, 500);
            return () => {
                isActive = false;
            };
        }, [])
    );
    useEffect(() => {
        if (BackHandler) {
            BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
            };
        }
    }, [])
    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    }
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressPersonalInfo = () => {
        navigation.navigate('PersonalInfoScreen');
    }
    const onPressFarmDetails = () => {
        navigation.navigate('FarmDetailsScreen');
    }
    const onPressEnquiryList = () => {
        navigation.navigate('EnquiryListScreen', { isProfile: true });
    }
    const onPressViewLots = () => {
        navigation.navigate('ViewLotListScreen', { isProfile: true });
    }
    const onPressViewBids = () => {
        navigation.navigate('BidsProductsScreen', { isProfile: true });
    }
    const onPressAddressUpdate = () => {
        navigation.navigate('DeliveryAddressScreen', { isType: 'profile' });
    }
    const onPressMandiRate = () => {
        navigation.navigate('UploadMandiRatesScreen');
    }
    const onPressHelpLine = () => {
        if (helpLineNumber) {
            Linking.openURL(`tel:${helpLineNumber}`)
        }
    }
    const onPressLogout = () => {
        Alert.alert('', areYouSure, [{
            text: logoutCancel, onPress: () => { return; },
        },
        {
            text: logoutYes,
            onPress: () => {
                setEnableLogin((pre) => !pre)
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
                        await EncryptedStorage.setItem('loginTrue', "true")
                        await EncryptedStorage.setItem('access_token', '');
                        await EncryptedStorage.setItem('userName', '');
                        await EncryptedStorage.setItem('userId', '');
                        await EncryptedStorage.setItem('MobileNo', '');
                        await EncryptedStorage.setItem('ProfileImage', '');

                    } catch (e) {
                        console.log('error ---------------', e)
                    }
                }, 100);
                return;
            },
        },
        ]);
    }
    const onPressDeleteAccount = () => {
        navigation.navigate('DeleteAccountScreen')
    }
    const actionSheet = useRef();
    const showActionSheet = () => {
        actionSheet.current.show()
    }
    const selectActionSheet = async (index) => {
        if (index === 0) {
            handleChoosePhoto()
        }
        else if (index === 1) {
            handleCamera()
        }
    }

    const handleChoosePhoto = async () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',//'video'
                includeBase64: false,
                quality: 0.3,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else {
                    setProfileImageUrl(response.assets[0].uri)
                    uploadImage(response.assets[0].uri);
                }
            },
        )
    };
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const handleCamera = async () => {
        let isCameraPermitted = await requestCameraPermission();

        if (isCameraPermitted) {
            ImagePicker.launchCamera(options, (res) => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    console.log('User tapped custom button: ', res.customButton);
                    alert(res.customButton);
                } else {
                    setProfileImageUrl(res.assets[0].uri)
                    uploadImage(Platform.OS === "android" ? res.assets[0].uri : res.assets[0].uri);
                }
            });
        }
    };


    const uploadImage = async (imageUrl) => {
        setLoadingIndicator(true);

        const profileImage = await uploadImageToStorage(imageUrl);

        setTimeout(async () => {
            // const res = await fetchUploadUrl(urlaws, image_file);
            // let profileImage = res.url.split('?')[0];
            // console.log('resresresresres -----------', res.url.split('?')[0])
            updateUserProfilePic({
                variables: { Id: userId, ProfilePicPath: profileImage }
            })
                .then(res => {
                    setLoadingIndicator(false)
                    setProfileImageUrl(profileImage);
                    setTimeout(async () => {
                        try {
                            await EncryptedStorage.setItem('ProfileImage', profileImage);
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
        }, 100);
    }
    const onUpdateProgress = (progress) => {

    }

    useEffect(() => {
        if (Platform.OS == "android" && DeviceInfo.getApiLevelSync() >= 33) {
            requestPermission();
        }

        return () => { };
    }, []);
    async function requestPermission() {
        try {
            check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
                .then((result) => {
                    console.log("what is the camera permission");
                    console.log(result);
                    if (result != RESULTS.GRANTED) {
                        request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then((finalResult) => {
                            console.log("what is the request in image permissions");
                            console.log(finalResult);
                        });
                    }

                })
                .catch((error) => {
                    // …
                });

        } catch (err) {
            console.log("what is the permission error");
            console.log(err);

        }
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
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{profileText}</Text>
                </View>
            </View>
            <ScrollView style={{ flex: 1, width: '100%', }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={{ width: '100%', flex: 1, marginBottom: 25 }}>
                    <View style={styles.view_top}>
                        <View style={styles.view_profileImage}>
                            {(profileImageUrl == '') ?
                                <Image style={styles.image_user}
                                    source={images.EMPTYPROFILEICON}>
                                </Image> : <Image style={styles.image_user}
                                    source={{ uri: profileImageUrl }}>
                                </Image>}
                            <TouchableOpacity style={styles.touch_editProfile}
                                onPress={showActionSheet}>
                                <Image style={{ width: 12, height: 12, tintColor: colors.white_color }}
                                    source={images.EDITPROFILEICON}>
                                </Image>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.text_name}>{userName}</Text>
                    </View>
                    <View style={{ marginTop: 40, width: '100%', alignItems: 'center', backgroundColor: '#f0f0f0' }}>
                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressPersonalInfo}>
                            <Image style={styles.image_Icon}
                                source={images.PERSONALICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{personalInformation}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>
                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressAddressUpdate}>
                            <Image style={styles.image_Icon}
                                source={images.LOCATIONPROFILEICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{locationDetail}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>
                        {/* <TouchableOpacity style={styles.view_box}
                            onPress={onPressFarmDetails}>
                            <Image style={styles.image_Icon}
                                source={images.FARMICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{farmDetails}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View> */}
                        {/* <TouchableOpacity style={styles.view_box}
                            onPress={onPressViewLots}>
                            <Image style={styles.image_Icon}
                                source={images.SELLACTIVEICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{viewLot}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View> */}
                        {/* <TouchableOpacity style={styles.view_box}
                            onPress={onPressViewBids}>
                            <Image style={styles.image_Icon}
                                source={images.BUYACTIVEICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{bidView}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View> */}
                        {/* <TouchableOpacity style={styles.view_box}
                            onPress={onPressEnquiryList}>
                            <Image style={styles.image_Icon}
                                source={images.VIEWENQUIRIESICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{viewEnquiries}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View> */}


                        {/* <TouchableOpacity style={styles.view_box}
                    onPress={onPressFarmDetails}>
                    <Image style={styles.image_Icon}
                        source={images.FARMICON}
                        resizeMode={'contain'}></Image>
                    <Text style={styles.text_personal}>{farmDetails}</Text>
                    <Image style={styles.image_arrow}
                        source={images.RIGHTARROWICON}></Image>
                </TouchableOpacity>
                <View style={styles.view_line}></View> */}
                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressMandiRate}>
                            <Image style={styles.image_Icon}
                                source={images.UPLOADMANDIICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{mandiRate}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>
                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressHelpLine}>
                            <Image style={styles.image_Icon}
                                source={images.HELPLINE}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{helpLine}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>
                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressDeleteAccount}>
                            <Image style={styles.image_Icon}
                                source={images.DELETEACCOUNT}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{deleteAccount}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>

                        <TouchableOpacity style={styles.view_box}
                            onPress={onPressLogout}>
                            <Image style={styles.image_Icon}
                                source={images.LOGOUTICON}
                                resizeMode={'contain'}></Image>
                            <Text style={styles.text_personal}>{logout}</Text>
                            <Image style={styles.image_arrow}
                                source={images.RIGHTARROWICON}></Image>
                        </TouchableOpacity>
                        <View style={styles.view_line}></View>
                    </View>
                </View>

            </ScrollView>

            {loadingIndicator && <Loading />}
            <ActionSheet
                ref={actionSheet}
                title={'Choose type'}
                options={['Choose Library', 'Choose Camera', 'cancel']}
                cancelButtonIndex={2}
                onPress={(index) =>
                    selectActionSheet(index)
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background_color,
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
    text_name: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: colors.black_color,
    },
    view_top: {
        width: '100%',
        height: 175,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_profileImage: {
        marginTop: 15,
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 70,
    },
    image_user: {
        width: 120,
        height: 120,
        backgroundColor: colors.white_color,
        borderRadius: 60,
    },
    touch_editProfile: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        borderRadius: 13,

    },
    view_box: {
        width: '100%',
        minHeight: 49,
        flexDirection: 'row',
        alignItems: 'center',
    },
    view_line: {
        width: '95%',
        height: 1,
        backgroundColor: 'rgba(201, 201, 201, 0.5)'
    },
    image_Icon: {
        width: 20,
        height: 20,
        marginLeft: 20,
    },
    image_arrow: {
        width: 7,
        height: 13,
        position: 'absolute',
        right: 20,
    },
    text_personal: {
        width: '76%',
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.black_color,
    },
    view_headerBottom: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 5,
    },
    button_edit: {
        width: 120,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_edit: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
});

export default ProfileDetailScreen;


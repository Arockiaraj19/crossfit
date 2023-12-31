import React, { useEffect, useContext, useState, useRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, Platform, Pressable, KeyboardAvoidingView, ScrollView, TextInput, Modal, Alert, FlatList, PermissionsAndroid } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import DatePicker from 'react-native-date-picker'
import moment from "moment";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '../components/Loading';
import { graphql } from 'react-apollo';
import {getAccessToken, } from '../helpers/AppManager';
import EncryptedStorage from 'react-native-encrypted-storage';
import { Query } from 'react-apollo';
import { useFocusEffect } from '@react-navigation/native';
import { getUserProfileImage } from '../helpers/AppManager';
import * as ImagePicker from "react-native-image-picker";
import ActionSheet from 'react-native-actionsheet';
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import UUIDv4 from '../helpers/uuid';

const GETUSERDETAIL_QUERY = gql`
query {
    getUserProfile{
        UserId
        MobileNo
        UserName 
        GenderId
        PreferredLanguage
        PreferredLanguageName
        PrimaryRole
        PrimaryRoleName
        Email
        DOB
        ProfilePicPath
    }
    }
`;

const UPDATEUSERPROFILE_QUERY = gql`
mutation ($Id: ID!, $name: String! $gender: ID!, $dob: String!, $emailId: String!, $preferredLanguageId: ID!, $primaryRoleId: ID!){
    updateUserProfile(Id: $Id , name: $name, gender: $gender, dob: $dob, emailId: $emailId, preferredLanguageId: $preferredLanguageId, primaryRoleId: $primaryRoleId) {
        UserId 
    
        MobileNo 
    
        UserName 
    
        token 
        
        ProfilePicPath
    }
   
  }
`;
const GETROLES_QUERY = gql`
query getRoles($languageId: ID!){
    getRoles(languageId: $languageId){
        Id
        Name
        Code
    }
}
`;

const UPDATEPROFILEIMAGE_QUERY = gql`
mutation ($Id: ID!, $ProfilePicPath: String!){ 
    updateUserProfilePic(Id: $Id , ProfilePicPath: $ProfilePicPath) 
    
  }
`;

const PersonalInfoScreen = ({ navigation, route }) => {
    const {
        saveAddress,
        personalInformation,
        nameText,
        gender,
        dateOfBirth,
        mobileNumber,
        emailId,
        preferredLanguage,
        preferredRole,
        maleText,
        femaleText,
        otherText,
        nameAlert,
        genderAlert,
        dobAlert,
        mobileAlert,
        emailAlert,
        languageAlert,
        roleAlert,
        changeProfile,
        selectRole,
        setLanguageInfoId,
        languageInfoId,
        setLoginToken,
        setHomeFetch,
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [isFetch, setIsFetch] = React.useState(true);
    const [isFetchRole, setIsFetchRole] = React.useState(true);
    const [userId, setUserId] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [userGender, setUserGender] = React.useState('');
    const [userBirthDate, setUserBirthDate] = React.useState(dateOfBirth);
    const [dobformat, setDobformat] = React.useState('');
    const [userMobile, setUserMobile] = React.useState('');
    const [userEmail, setUserEmail] = React.useState('');
    const [userLanguage, setUserLanguage] = React.useState(preferredLanguage);
    const [userLanguageId, setUserLanguageId] = React.useState('');
    const [userRole, setUserRole] = React.useState(preferredRole);
    const [userRoleId, setUserRoleId] = React.useState('');
    const [isGenderType, setIsGenderType] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const dimensions = Dimensions.get('window');
    const [userDate, setUserDate] = React.useState(new Date())
    const [updateUserProfile, { loading, error, data }] = useMutation(UPDATEUSERPROFILE_QUERY);
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [isPopupType, setIsPopupType] = React.useState('');
    const [profileImageUrl, setProfileImageUrl] = useState('');
    const [uuid, setUUID] = useState('');
    const actionSheet = useRef();
    const option = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.3,
    };

    const [updateUserProfileImage, {}] = useMutation(UPDATEPROFILEIMAGE_QUERY);
    const showActionSheet = () => {
        actionSheet.current.show()
    }

    const handleSelectActionSheet = async (index) => {
        if (index === 0) {
            handleChoosePhoto()
        }
        else if (index === 1) {
            handleChooseCamera()
        }
    }  

    const access = new Credentials({
        accessKeyId: "AKIASVAYFY3SML3QPD5N",
        secretAccessKey: "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",
    });

    const s3 = new S3({
        credentials: access,
        region: "ap-south-1", //"us-west-2"
        signatureVersion: "v4",
    });

    const request = async () => {
        const fileId = 'gt_image_' + UUIDv4() + '.jpg';
        setUUID(fileId)
        const signedUrlExpireSeconds = 60 * 15;

        const url = await s3.getSignedUrlPromise("putObject", {
            Bucket: "userprofileimagescropfit",
            Key: `${fileId}`,
            ContentType: "image/jpeg",
            Expires: signedUrlExpireSeconds,
        });
        return url;
    }  

    const handleChooseCamera = async() => {
        const isCameraPermitted = await requestCameraPermission()
        const isStoragePermitted = await requestExternalWritePermission()  
        if (isCameraPermitted && isStoragePermitted) {
            ImagePicker.launchCamera(option, (res) => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    console.log('User tapped custom button: ', res.customButton);
                    alert(res.customButton);
                } else {
                    setProfileImageUrl(res.assets[0].uri)
                    uploadImage(Platform.OS === "android" ? ('file://' + res.assets[0].uri) : res.assets[0].uri);
                }
            });
        }
    }

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
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const isGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                return isGranted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const handleChoosePhoto = async() => {
        console.log("choose");
        ImagePicker.launchImageLibrary(
           { 
            mediaType : 'photo',
            includeBase64 : false,
            quality : 0.3
         },
         (response) => {
            if(response.didCancel) {}
            else {
               setProfileImageUrl(response.assets[0].uri) 
                uploadImage(Platform.OS === "android" ? ('file://' + response.assets[0].uri) : response.assets[0].uri);
            }
         })
    }  

    const fetchUploadUrl = async (data, fileSelected) => {
        try {
            let res = await fetch(data, {
                method: 'PUT',
                body: fileSelected,
            })
            return res;
        } catch (error) {
            return error;
        }
    }
     
     const uploadImage = async (imageUrl) => {
        setLoadingIndicator(true)
        var urlaws = await request();
        let image_file = await fetch(imageUrl)
            .then((r) => r.blob())
            .then(
                (blobFile) =>
                    new File([blobFile], uuid, {
                        type: 'image/jpg',
                    }),
            );
        setTimeout(async () => {
            const res = await fetchUploadUrl(urlaws, image_file);
            let profileImage = res.url.split('?')[0];
            updateUserProfileImage({
                variables: { Id: userId, ProfilePicPath: profileImage }
            })
                .then(res => {
                    console.log("loggggress",res)
                    setLoadingIndicator(false)
                    setProfileImageUrl(profileImage);
                    setTimeout(async () => {
                        try {
                            await EncryptedStorage.setItem('ProfileImage', profileImage);
                        } catch (e) {
                            console.log(e)
                        }
                    }, 100);
                })
                .catch(e => {
                    setLoadingIndicator(false)
                });
        }, 100);
    }


    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setTimeout(async () => {
                let profileImage = await getUserProfileImage();
                setProfileImageUrl(profileImage)
            }, 10);
            return () => {
                isActive = false;
            };
    }, [])
    )
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressSaveProfile =async () => {
        if (userName == '') {
            Alert.alert('', nameAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userGender == '') {
            Alert.alert('', genderAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userBirthDate == 'Date of Birth') {
            Alert.alert('', dobAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userMobile == '') {
            Alert.alert('', mobileAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        // else if (userEmail == '') {
        //     Alert.alert('', emailAlert, [{
        //         text: 'OK', onPress: () => {
        //             return;
        //         },
        //     },
        //     ]);
        // }
        else if (userLanguageId == '') {
            Alert.alert('', languageAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userRole == '') {
            Alert.alert('', roleAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
//             var token = await getAccessToken();
// console.log('tokentokentoken',token)
            if (loading) {
                setLoadingIndicator(true)
            }
            console.log('updateUserProfile',{ Id: parseInt(userId), name: userName, gender: parseInt(userGender), dob: dobformat, emailId: userEmail, preferredLanguageId: parseInt(userLanguageId), primaryRoleId: parseInt(userRoleId) })
            updateUserProfile({
                variables: { Id: parseInt(userId), name: userName, gender: parseInt(userGender), dob: dobformat, emailId: userEmail, preferredLanguageId: parseInt(userLanguageId), primaryRoleId: parseInt(userRoleId) }
            })
                .then(res => {
                    console.log('res ------------------', res);
                    if(res.data?.updateUserProfile){
                    (async () => {
                        setLoginToken(res.data.updateUserProfile?.token)
                        await EncryptedStorage.setItem('access_token', res.data.updateUserProfile?.token)
                        setLanguageInfoId(userLanguageId)
                        await EncryptedStorage.setItem("languageId",userLanguageId)
                            try {
                                await EncryptedStorage.setItem('userName', userName);
                                if(languageInfoId !=userLanguageId){
                                    setHomeFetch(true)
                                    navigation.navigate('HomeScreen');
                                   } else {
                                    navigation.goBack();
                                   }
                            } catch (e) {
                                console.log('error ---------------', e)
                            }
                            setLoadingIndicator(false)
                        })()
                    }
                    else {
                        setLoadingIndicator(false);
                    }
                })
                .catch(e => {
                    setLoadingIndicator(false)
                    console.log('error ------------------', e.message);
                });
        }
    }
    const GetUserProfileInfo = graphql(GETUSERDETAIL_QUERY)(props => {
        const { error, data, loading } = props.data;
        if (error) {
            setIsFetch(false);
            { console.log('errorerrorerror 1111', error) }
            return <View />;
        }
        if (!loading) {
            // console.log('propspropspropspropspropsprops', props)
            if (props.data?.getUserProfile != undefined) {
                setTimeout(async () => {
                    updateValue(props.data.getUserProfile);
                }, 500);
                return <View />;

            }
            return <View />;
        }
        return <View />;
    });
    const updateValue = (UserProfile) => {
        console.log("user")
        let genderInfo = (UserProfile.GenderId != null) ? ((UserProfile.GenderId == 1) ? 'male' : (UserProfile.GenderId == 2) ? 'female' : 'others') : '';
        console.log('UserProfile -----', UserProfile)

        setLoadingIndicator(false)
        setIsFetch(false);
        setUserId(UserProfile.UserId);
        setUserName(UserProfile.UserName);
        setUserMobile(UserProfile.MobileNo);
        setUserEmail((UserProfile.Email != null) ? UserProfile.Email : '');
        setUserBirthDate((UserProfile.DOB != null) ? UserProfile.DOB : dateOfBirth);
        setUserRole((UserProfile.PrimaryRoleName != null) ? UserProfile.PrimaryRoleName : '');
        setUserRoleId((UserProfile.PrimaryRole != null) ? UserProfile.PrimaryRole : '');
        setUserLanguage((UserProfile.PreferredLanguageName != null) ? UserProfile.PreferredLanguageName : '');
        setUserLanguageId((UserProfile.PreferredLanguage != null) ? UserProfile.PreferredLanguage : 0);
        setUserGender((UserProfile.GenderId != null) ? UserProfile.GenderId : 0);
        setIsGenderType(genderInfo);
        setDobformat((UserProfile.DOB != null) ? UserProfile.DOB : '')

        setTimeout(async () => {
            console.log('userLanguageIduserLanguageIduserLanguageIduserLanguageId -------------------', userLanguage);
            setIsFetchRole(false)
        }, 500);
    }
    const onPressSelectGender = (type) => {
        console.log('type -------------------', type);

        setIsGenderType(type);
        setUserGender((type == 'male') ? 1 : ((type == 'female') ? 2 : 3))
    }
    const onPressDateOfBirth = () => {
        setIsPopupType('dob')
        setModalVisible(true);
    }
    const closePopup = () => {
        setModalVisible(false);
    }
    const onPressSelectDateOfBirth = () => {
        setDobformat(moment(userDate).format("YYYY-MM-DD"))
        setUserBirthDate(moment(userDate).format("DD - MMMM - YYYY"))
        closePopup()
    }
    const onPressSelectLanguage = () => {
        navigation.navigate('LanguageListScreen', {
            onReturn: (item) => {
                console.log('itemitemitem ---------', item);
                setUserLanguage(item.language);
                setUserLanguageId(item.languageId);
            },
        })
    }
    const onPressSelectRole = () => {
        setModalVisible(true);
        setIsPopupType('Role')
    }
    const GetRolesComponent = graphql(GETROLES_QUERY)(props => {
        const { error, getRoles, loading } = props.data;
        { console.log('propspropsprops 121212121 ---- ', props) }
        if (getRoles) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getRoles)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(false);
        }, 500);
        return <View />;
    });
    const updateLoading = (isloading) => {
        setIsFetchRole(true);
        setLoadingIndicator((isloading == undefined) ? false : isloading);
    }
    const updateDate = (list) => {
        list.map((listInfo, i) => {
            if(listInfo.Id == userRoleId){
                setUserRole(listInfo.Name)
            }

        })
        setArrayOfItems(list);
    }
    const handleSelectItem = (item, index) => {
        setUserRole(item.Name)
        setUserRoleId(item.Id)
        setModalVisible(false);
    }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <View style={styles.view_inner}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                        onPress={onPressBack}>
                        <Image style={{ width: 10, height: 18 }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{personalInformation}</Text>
                </View>
            </View>
            {(isFetch) && (
                <View>
                    <GetUserProfileInfo />
                </View>
            )}
            {(!isFetchRole) && (
                <Query query={GETROLES_QUERY} variables={{ languageId: userLanguageId }}>
                {({ loading, error, data }) => {
                    if (loading) {
                        () =>
                        updateLoading(true);
                        return null
                    };
                    if (error) {
                        updateLoading(false);
                        return null;
                    }
                    if (!data) {
                        updateLoading(false);
                        return null;
                    }
                    console.log('getRolesgetRolesgetRolesgetRolesgetRoles', data)
                    updateDate(data.getRoles)
                    return null;
                }}
            </Query>
            )}
            <ScrollView style={{ marginBottom: 80, width: '100%', height: '50%', }}>
                <View style={styles.view_Main}>
                    <View style={styles.view_top}>
                        <View style={styles.view_profileImage}>
                            {(profileImageUrl == '') ? 
                               <Image style={styles.image_user}
                               source={images.EMPTYPROFILEICON}>
                           </Image> : 
                            <Image style={styles.image_user}
                            source={{ uri: profileImageUrl }}>
                        </Image>
                        }
                            <TouchableOpacity 
                            style={styles.touch_editProfile}
                            onPress={showActionSheet}
                            >
                                <Text style={styles.text_name}>{changeProfile}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ marginTop: 15, width: '100%', }}>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{nameText}</Text>
                            <View style={styles.view_box}>
                                <TextInput style={styles.search_Input}
                                    value={userName}
                                    onChangeText={setUserName}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType={'default'}
                                    returnKeyType='done'
                                    placeholderTextColor={colors.text_Color}
                                    placeholder={nameText}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 160 }]}>
                            <Text style={styles.text_heading}>{gender}</Text>
                            <View style={[styles.view_Genderbox, { alignItems: 'center', height: 120 }]}>
                                <View style={{ width: '95%', height: 50, flexDirection: 'row', alignItems: 'center', }}>
                                    <TouchableOpacity style={styles.view_buttonSelect}
                                        onPress={() =>
                                            onPressSelectGender('male')}>
                                        <View style={(isGenderType == 'male') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                        <Text style={(isGenderType == 'male') ? styles.text_SelectedMale : styles.text_Male}>{maleText}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.view_buttonSelect, { marginLeft: 10,}]}
                                        onPress={() =>
                                            onPressSelectGender('female')}>
                                        <View style={(isGenderType == 'female') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                        <Text style={(isGenderType == 'female') ? styles.text_SelectedMale : styles.text_Male}>{femaleText}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '95%', height: 50, flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity style={[styles.view_buttonSelect, { width: '48%' }]}
                                        onPress={() =>
                                            onPressSelectGender('others')}>
                                        <View style={(isGenderType == 'others') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                        <Text style={(isGenderType == 'others') ? styles.text_SelectedMale : styles.text_Male}>{otherText}</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            </View>
                        </View>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{dateOfBirth}</Text>
                            <TouchableOpacity style={styles.view_box}
                                onPress={onPressDateOfBirth}>
                                <Text style={styles.text_dateOfBirth}>{userBirthDate}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{mobileNumber}</Text>
                            <View style={styles.view_box}>
                                <TextInput style={styles.search_Input}
                                    value={userMobile}
                                    onChangeText={setUserMobile}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    maxLength={10}
                                    keyboardType={'numeric'}
                                    returnKeyType='done'
                                    placeholderTextColor={colors.text_Color}
                                    placeholder={mobileNumber}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{emailId}</Text>
                            <View style={styles.view_box}>
                                <TextInput style={styles.search_Input}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType={'email-address'}
                                    returnKeyType='done'
                                    placeholderTextColor={colors.text_Color}
                                    placeholder={emailId}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{preferredLanguage}</Text>
                            <TouchableOpacity style={styles.view_box}
                                onPress={onPressSelectLanguage}>
                                <Text style={styles.text_dateOfBirth}>{userLanguage}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{preferredRole}</Text>
                            <TouchableOpacity style={styles.view_box}
                                onPress={onPressSelectRole}>
                                <Text style={styles.text_dateOfBirth}>{userRole}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center' }]}>
                            <Text style={styles.text_heading}>{preferredRole}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (userRole == 'buyer') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressSelectRole('buyer')}>
                                    <Text style={[styles.text_roles, { color: (userRole == 'buyer') ? colors.white_color : 'rgba(1, 165, 82, 0.4)' }]}>{buyerText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (userRole == 'seller') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressSelectRole('seller')}>
                                    <Text style={[styles.text_roles, { color: (userRole == 'seller') ? colors.white_color : 'rgba(1, 165, 82, 0.4)' }]}>{sellerText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View> */}
                    </View>
                </View>
            </ScrollView>
            {(modalVisible) && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        closePopup()
                    }}>
                    <Pressable style={[styles.popup_view, { justifyContent: ((isPopupType == 'Role') ? 'center' : 'flex-end'),}]}
                        onPress={() => closePopup()}>
                            {(isPopupType == 'Role') ? 
                            <View style={styles.modalView}>
                            <Text style={styles.modalText}>{selectRole}</Text>
                            <View style={styles.line} />
                            <View style={styles.view_List}>
                                <FlatList
                                    style={styles.list}
                                    data={arrayOfItems}
                                    keyExtractor={(x, i) => i}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={styles.title_view}
                                            onPress={() => handleSelectItem(item, index)}>
                                            <Text style={styles.task_title}> {`${item.Name}`} </Text>
                                            <View style={styles.line} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View> : 
                            <View style={{ width: '100%', height: 310, }}>
                            <View style={{ width: '100%', height: 310, backgroundColor: colors.white_color, }}>
                                <View style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center', width: 80, height: 40, borderRadius: 5, borderWidth: 1, borderColor: colors.line_background }}
                                        onPress={closePopup}>
                                        <Text style={styles.text_cancel}>{'Cancel'}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ position: 'absolute', right: 15, justifyContent: 'center', alignItems: 'center', width: 80, height: 40, borderRadius: 5, borderWidth: 1, borderColor: colors.line_background }}
                                        onPress={onPressSelectDateOfBirth}>
                                        <Text style={styles.text_cancel}>{'Done'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ marginTop: 5, width: '100%', height: 250, }}>
                                    <View style={[styles.view_line, { top: 0, marginTop: 0, width: '100%' }]}></View>
                                    <DatePicker
                                        style={{ width: dimensions.width, height: 250, }}
                                        textColor={'#333333'}
                                        maximumDate={new Date()}
                                        date={userDate}
                                        androidVariant={'nativeAndroid'}
                                        dividerHeight={50}
                                        onDateChange={setUserDate}
                                        mode='date' />
                                </View>
                            </View>
                        </View>}
                        
                    </Pressable>
                </Modal>
            )}

            <View style={styles.view_headerBottom}>
                <TouchableOpacity style={styles.button_edit}
                    onPress={onPressSaveProfile}>
                    <Text style={styles.text_edit}>{saveAddress}</Text>
                </TouchableOpacity>
            </View>
            {loadingIndicator && <Loading />}
            <ActionSheet
                ref={actionSheet}
                title={'Choose type'}
                options={['Choose Library', 'Choose Camera', 'cancel']}
                cancelButtonIndex={2}
                onPress={(index) =>
                    handleSelectActionSheet(index)
                }
            />
        </KeyboardAvoidingView>
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
    view_Main: {
        width: '100%',
        flex: 1,
    },
    text_name: {
        textAlign: 'center',
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: '#01a553',
    },
    view_top: {
        width: '100%',
        minHeight: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_profileImage: {
        marginTop: 15,
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 70,
    },
    image_user: {
        width: 80,
        height: 80,
        backgroundColor: colors.white_color,
        borderRadius: 60,
    },
    touch_editProfile: {
        width: '80%',
        minHeight: 26,
        alignItems: 'center',
    },
    view_headerBottom: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    button_edit: {
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 1.0)'
    },
    text_edit: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.white_color,
    },
    view_info: {
        marginTop: 10,
        width: '100%',
        height: 85,
    },
    text_heading: {
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.black_color,
    },
    view_box: {
        marginTop: 10,
        marginLeft: 20,
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(112, 112, 112, 0.2)',
        backgroundColor: colors.white_color,
    },
    view_Genderbox: {
        marginTop: 10,
        marginLeft: 20,
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(112, 112, 112, 0.1)',
        backgroundColor: colors.white_color,
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 5
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    search_Input: {
        width: '92%',
        height: 35,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        paddingVertical: 0,
    },
    text_dateOfBirth: {
        width: '92%',
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        paddingVertical: 0,
    },
    view_buttonSelect: {
        width: '48%',
        height: 43,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.line_background,
        flexDirection: 'row',
        alignItems: 'center',
    },
    unSelectCircle: {
        marginLeft: 15,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(112, 112, 112, 1.0)',
    },
    selectedCircle: {
        marginLeft: 15,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 5,
        borderColor: colors.landing_background,
    },
    text_Male: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
    },
    text_SelectedMale: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a553',
    },
    popup_view: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        backgroundColor: colors.lite_black,
    },
    view_line: {
        position: 'absolute',
        bottom: 0,
        marginTop: 10,
        width: '65%',
        height: 1,
        backgroundColor: '#f0f0f0'
    },
    view_role: {
        overflow: 'hidden',
        width: 120,
        height: 40,
        borderRadius: 20,
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        backgroundColor: 'rgba(1, 165, 82, 1.0)',
        alignItems: 'center',
    },
    button_buyer: {
        marginLeft: 2,
        width: 58,
        height: 36,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_seller: {
        width: 58,
        height: 36,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_roles: {
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
    },
    text_cancel: {
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.text_Color,
    },
    modalView: {
        width: '90%',
        height: '70%',
        margin: 20,
        backgroundColor: colors.white_color,
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 22,
        fontWeight: '700',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.text_Color,
    },
    view_List: {
        marginLeft: 5,
        width: '100%',
        height: '95%',
    },
    list: {
        width: '100%',
    },
    title_view: {
        height: 40,
        justifyContent: 'center',
    },
    task_title: {
        fontSize: 14,
        height: 20,
        marginBottom: 8,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
});

export default PersonalInfoScreen;


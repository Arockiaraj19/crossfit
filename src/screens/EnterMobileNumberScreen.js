import React, { useContext, useEffect, useCallback, useState } from 'react';
import { StyleSheet, Alert, View, Image, PermissionsAndroid, KeyboardAvoidingView, Linking, Dimensions, ImageBackground, TouchableOpacity, Text, ScrollView, TextInput, Modal, Pressable, FlatList, Switch , ActivityIndicator} from 'react-native';
import { colors, fonts, images } from '../core';
import LanguageSelectionComponent from '../components/LanguageSelectionComponent';
import { AuthContext } from '../components/AuthContext';
import GetLocation from 'react-native-get-location';
import Loading from '../components/Loading';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Query } from 'react-apollo';
import DataFetchComponents from '../components/DataFetchComponents';
import { graphql } from 'react-apollo';
import * as ImagePicker from "react-native-image-picker";
import ActionSheet from 'react-native-actionsheet';
import UUIDv4 from '../helpers/uuid';
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import { getPushToken } from '../helpers/AppManager';
import { useFocusEffect } from '@react-navigation/native';
import uploadImageToStorage from '../helpers/uploadImage';


const CONTINENT_QUERY = gql`
mutation ($mobileNo: String!, $language: ID!, $roleId: ID!, $profilePicPath: String!, $userName: String!, $referalCode: String!, $deviceToken: String!){ 
    generateOTP(mobileNo: $mobileNo , language: $language, roleId: $roleId, profilePicPath: $profilePicPath, userName: $userName, referalCode: $referalCode, deviceToken: $deviceToken) 
    { 
        userId 
        error 
        Msg 
        otpInfo { 
            generated 
        } 
    } 
  }
`;

const lableQuery = gql`
query getAppLabels($languageId: ID!) {
    getAppLabels(languageId: $languageId) 
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

const REFERALCODE_QUERY = gql`
query checkReferalCode($referalCode: String!) {
    checkReferalCode(referalCode: $referalCode) {
        UserId
        ReferalCode
        ValidUntil
        MessageContent
        ApplicationUrl
    }
  }
`;



const EnterMobileNumberScreen = ({ navigation, route }) => {

    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 12);
    const imageWidth = dimensions.width;
    const [isShowLanguageList, setIsShowLanguageList] = React.useState(false);
    const [userMobileNumber, setUserMobileNumber] = React.useState('');
    const [userName, setUserName] = React.useState('');
    const [referalCode, setReferalCode] = React.useState('');
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [registerLoading, setregisterLoading] = React.useState(false);
    const [isGetLables, setIsGetLables] = React.useState(false);
    const [profileImageUrl, setProfileImageUrl] = React.useState('');
    const [userRole, setUserRole] = React.useState('');
    const [userRoleId, setUserRoleId] = React.useState('');
    const [userProfileImage, setUserProfileImage] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [isFetch, setIsFetch] = React.useState(true);
    const [uuid, setUUID] = React.useState('');
    const [isReferal, setIsReferal] = React.useState(false);
    const [isReferalApi, setIsReferalApi] = React.useState(false);
    const [checkBoxSelected, setCheckBoxSelected] = React.useState(false);
    const [isFetchPolicy, setIsFetchPolicy] = React.useState(false);
    const [privacyPolicy, setPrivacyPolicy] = React.useState('');
    const [deviceToken, setDeviceToken] = React.useState('');
    const [shouldRunEffect, setShouldRunEffect] = useState(false);
    const [isToggleEnabled, setIsToggleEnabled] = useState(false);

    const [state, setState] = React.useState({
        languageId: '',
    });
    const {
        pushDeviceToken,
        isLoading,
        setIsLoading,
        loginToken,
        setLoginToken,
        getStart,
        setGetStart,
        welcomeText,
        setWelcomeText,
        loginandSignup,
        setLoginandSignup,
        continueText,
        setContinueText,
        enterPhoneNumebr,
        setEnterPhoneNumebr,
        enterYourName,
        setEnterYourName,
        chooseLanguage,
        setChooseLanguage,
        locationAlert,
        setLocationAlert,
        otpVerification,
        setOtpVerification,
        enterOtp,
        setEnterOtp,
        didntReceive,
        setDidntReceive,
        errorNumer,
        setErrorNumer,
        errorName,
        setErrorName,
        languageList,
        setLanguageList,
        buySearchPlaceholder,
        setBuySearchPlaceholder,
        deliverAddress,
        setDeliverAddress,
        addNewAddress,
        setAddNewAddress,
        noAddress,
        setNoAddress,
        myAddress,
        setMyAddress,
        type,
        setType,
        userState,
        setUserState,
        district,
        setDistrict,
        taluk,
        setTaluk,
        village,
        setVillage,
        doorNo,
        setDoorNo,
        pincode,
        setPincode,
        next,
        setNext,
        placeholderType,
        setPlaceholderType,
        placeholderState,
        setPlaceholderState,
        placeholderDistrict,
        setPlaceholderDistrict,
        placeholderTaluk,
        setPlaceholderTaluk,
        placeholderTown,
        setPlaceholderTown,
        placeholderVillage,
        setPlaceholderVillage,
        placeholderDoorNo,
        setPlaceholderDoorNo,
        placeholderPinCode,
        setPlaceholderPinCode,
        selectAddress,
        setSelectAddress,
        listMyProduct,
        setListMyProduct,
        gradeText,
        setGradeText,
        gradePlaceholder,
        setGradePlaceholder,
        availableQuality,
        setAvailableQuality,
        availableQualityPlaceholder,
        setAvailableQualityPlaceholdery,
        weightPlaceholder,
        setWeightPlaceholder,
        acres,
        setAcres,
        acresPlaceholder,
        setAcresPlaceholder,
        productPrice,
        setProductPrice,
        productPricePlaceholder,
        setProductPricePlaceholder,
        saveLot,
        setSaveLot,
        gradeAlert,
        setGradeAlert,
        quantityAlert,
        setQuantityAlert,
        weightAlert,
        setWeightAlert,
        acreAlert,
        setAcreAlert,
        priceAlert,
        setPriceAlert,
        successText,
        setSuccessText,
        successLot,
        setSuccessLot,
        viewLot,
        setViewLot,
        backHome,
        setBackHome,
        statusText,
        setStatusText,
        placeBit,
        setPlaceBit,
        bitsText,
        setBitsText,
        weightUnitAlert,
        setWeightUnitAlert,
        successBid,
        setSuccessBid,
        requiredQuantity,
        setRequiredQuantity,
        bidPrice,
        setBidPrice,
        bidView,
        setBidView,
        stepText,
        setStepText,
        saveAddress,
        setSaveAddresst,
        villageString,
        setVillageString,
        bitsTitle,
        setBitsTitle,
        editBits,
        setEditBits,
        deleteBits,
        setDeleteBits,
        enquireText,
        setEnquireText,
        buyText,
        setBuyText,
        sellText,
        setSellText,
        newEnquriyText,
        setNewEnquriyText,
        deliverOn,
        setDeliverOn,
        placeEnquiry,
        setPlaceEnquiry,
        deliverOnAlert,
        setDeliverOnAlert,
        profileText,
        setProfileText,
        editProfileText,
        setEditProfileText,
        personalInformation,
        setPersonalInformation,
        locationDetail,
        setLocationDetail,
        farmDetails,
        setFarmDetails,
        logout,
        setLogout,
        nameText,
        setNameText,
        gender,
        setGender,
        dateOfBirth,
        setDateOfBirth,
        mobileNumber,
        setMobileNumber,
        emailId,
        setEmailId,
        preferredLanguage,
        setPreferredLanguage,
        preferredRole,
        setPreferredRole,
        nameAlert,
        setNameAlert,
        genderAlert,
        setGenderAlert,
        dobAlert,
        setDobAlert,
        mobileAlert,
        setMobileAlert,
        emailAlert,
        setEmailAlert,
        languageAlert,
        setLanguageAlert,
        roleAlert,
        setRoleAlert,
        maleText,
        setMaleText,
        femaleText,
        setFemaleText,
        otherText,
        setOtherText,
        cultivableText,
        setCultivableText,
        irrigationText,
        setIrrigationText,
        groundWaterText,
        setGroundWaterText,
        sprinklerText,
        setSprinklerText,
        borewellText,
        setBorewellText,
        organicText,
        setOrganicText,
        toolsText,
        setToolsText,
        livestockText,
        setLivestockText,
        expertText,
        setExpertText,
        enquirySuccess,
        setEnquirySuccess,
        viewExpert,
        setViewExpert,
        myExpert,
        setMyExpert,
        alertRequiredQuantity,
        setAlertRequiredQuantity,
        biddedOn,
        setBiddedOn,
        pickup, setPickup,
        editLot, setEditLot,
        deleteLotInfo, setDeleteLotInfo,
        sortBy, setSortBy,
        bidPricePlaceholder, setBidPricePlaceholder,
        updateon, setUpdateon,
        updateLot, setUpdateLot,
        updateBit, setUpdateBit,
        deleteBidAlert, setDeleteBidAlert,
        deleteLotAlert, setDeleteLotAlert,
        deleteAddressAlert, setDeleteAddresAlert,
        organic, setOrganic,
        per, setPer,
        selectRole, setSelectRole,
        home, setHome,
        buy, setBuy,
        sell, setSell,
        bids, setBids,
        lots, setLots,
        watchVideo, setWatchVideo,
        mandiRate, setMandiRate,
        profileImage, setProfileImage,
        browseFile, setBrowseFile,
        useCamera, setUseCamera,
        locationMandi, setLocationMandi,
        uploaDMandi, setUploaDMandi,
        mandiRates, setMandiRates,
        realmandiRates, setRealmandiRates,
        languageInfoId, setLanguageInfoId,
        quantityText, setQuantityText,
        applyText, setApplyText,
        referenceText, setReferenceText,
        appliedReference, setAppliedReference,
        checkQuantityAlert, setCheckQuantityAlert,
        acceptBit, setAcceptBit,
        declineBit, setDeclineBit,
        enquiries, setEnquiries,
        sellerList, setSellerList,
        lotAddedOn, setLotAddedOn,
        expectedon, setExpectedon,
        showInterest, setShowInterest,
        enquiryAddedOn, setEnquiryAddedOn,
        viewEnquiries, setViewEnquiries,
        editEnquiry, setEditEnquiry,
        deleteEnquiryText, setDeleteEnquiryText,
        viewResponses, setViewResponses,
        deleteEnquiryAlert, setDeleteEnquiryAlert,
        deleteAddress, setDeleteAddress,
        logoutYes, setLogoutYes,
        logoutCancel, setLogoutCancel,
        noMandi, setNoMandi,
        noLods, setNoLods,
        noBids, setNoBids,
        changeProfile, setChangeProfile,
        isBackOption, setIsBackOption,
        checkRate, setCheckRate,
        quickSearch, setQuickSearch,
        buyerText, setBuyerText,
        sellerText, setSellerText,
        viewMore, setViewMore,
        areYouSure, setAreYouSure,
        mandiratesSuccess, setMandiratesSuccess,
        enterLocation, setEnterLocation,
        noEnquiry, setNoEnquiry,
        setUpdateSuccess,
        setEnquiryMessage,
        termsAndConditions, setTermsAndConditions,
        helpLine, setHelpLine,
        minAmountPerGvtAlert, setMinAmountPerGvtAlert,
        approveErrorMsg, setApproveErrorMsg,
        pickupAddress, setPickupAddress,
        comingSoon, setComingSoon,
        areYouSureAccept, setAreYouSureAccept,
        areYouSureDecline, setAreYouSureDecline,
        setDeleteAccount,
        setDeleteMessage1,
        setDeleteMessage2,
        setDeleteMessage3,
        setDeleteMessage4,
        alreadyRegister, singinText,
        isShowLanguage,
        loginLabel,
        setEmptyNotification,
        setNotificationTitle,
        setActivity,
        setBidText,
        setEnquiryText,
        setLoginLabel,
        referralCode
    } = useContext(AuthContext);

    const [generateOTP, { loading, error, data }] = useMutation(CONTINENT_QUERY);
    let options = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.3,
    };

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
   
    useEffect(() => {
        setTimeout(async () => {
            let token = await getPushToken()
            setDeviceToken(token)
            let isLocationPermitted = await requestLocationPermission();
            let isLocationPermitted2 = await requestLocationPermission2();
            if (isLocationPermitted && isLocationPermitted2) {
                GetLocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 15000,
                })
                    .then(location => {
                        // setIsUpdated(true)
                        // setCurrentLocationDetails({
                        //   latitude: location.latitude,
                        //   longitude: location.longitude,
                        //   latitudeDelta: 0.0922,
                        //   longitudeDelta: 0.0421,
                        // })
                    })
                    .catch(error => {
                        const { code, message } = error;
                    })
            }
        }, 10);
        onPressSelectLanguage();
    }, [isShowLanguage])

    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
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
    const requestLocationPermission2 = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                    {
                        title: 'Location Access Required',
                        message: 'This App needs to Access your location',
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
    const updateLanguageInfo = (info) => {
        setIsGetLables(true);
        setLanguageInfoId(info)
        setState({
            ...state,
            languageId: info,
        });
        setIsShowLanguageList(false);
    }
    const onPressContinue = () => {
        if(registerLoading){
            return;
        }
        console.log('mobileNumber.lengthmobileNumber.lengthmobileNumber.length', userMobileNumber.length)
        if (userMobileNumber == '') {
            Alert.alert('', errorNumer, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userMobileNumber.length < 10) {
            Alert.alert('', 'Please enter vaild mobile number', [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (state.languageId == '') {
            Alert.alert('', languageAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userName == '') {
            Alert.alert('', errorName, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userRoleId == '') {
            Alert.alert('', selectRole, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (!checkBoxSelected) {
            Alert.alert('', termsAndConditions, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userMobileNumber != '' && userName != '' && state.languageId != '' && userRoleId != '' && checkBoxSelected) {
            console.log("sinup",{ mobileNo: userMobileNumber, language: state.languageId, roleId: userRoleId, profilePicPath: userProfileImage, userName: userName, referalCode: referalCode, deviceToken: pushDeviceToken })
 
           setregisterLoading(true);
            generateOTP({
                variables: { mobileNo: userMobileNumber, language: state.languageId, roleId: userRoleId, profilePicPath: userProfileImage, userName: userName, referalCode: referalCode, deviceToken: pushDeviceToken}
            })
                .then(res => {
                    setregisterLoading(false);
                    console.log(res.data.generateOTP);
                    navigation.navigate('OTPVerficationScreen', { mobileNo: userMobileNumber, userName: userName, userId: res.data.generateOTP.userId, profileImage: userProfileImage, referalCode: referalCode })
                })
                .catch(e => {
                    setregisterLoading(false);

                    Alert.alert('Error', e.message, [{
                        text: 'OK', onPress: () => {
                            return;
                        },
                    },
                    ]);
                    console.log('errer ------------------', e.message);
                });
        }
    }
    const updateValues = (isLoading) => {
        setIsGetLables(false);
        setLoadingIndicator(isLoading);
    }
    const updateReferalValues = (isLoading) => {
        console.log('updateReferalValuesupdateReferalValuesupdateReferalValues ------------------');
        setIsReferalApi(false);
        setLoadingIndicator(isLoading);
    }
    const updateReferalText = (data) => {
        console.log('updateReferalTextupdateReferalText ------------------', data);
        setIsReferalApi(false);
        if (data.MessageContent == 'Invalid Referal Code') {
            Alert.alert('', data.MessageContent, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
            setIsReferal(false);
        }
        else {
            setIsReferal(true);
        }
    }
    const updateLableText = (data) => {
        setIsGetLables(false)
        console.log('data ------------------', data);
        var loginScreenLabels = data.getAppLabels.allLabels.LoginScreen;
        var sortScreenLabels = data.getAppLabels.allLabels.Sort;
        var profileScreenLabels = data.getAppLabels.allLabels.ProfileDetails;
        var personalDetailsScreenLabels = data.getAppLabels.allLabels.PersonalDetails;
        var farmDetailsScreenLabels = data.getAppLabels.allLabels.FarmDetails;
        var locationScreenLabels = data.getAppLabels.allLabels.MyLocation;
        var sellScreenLabels = data.getAppLabels.allLabels.Sell;
        var buyScreenLabels = data.getAppLabels.allLabels.Buy;
        var enquiryScreenLabels = data.getAppLabels.allLabels.Enquiry;
        var footerScreenLabels = data.getAppLabels.allLabels.Footer;
        var dashboardScreenLabels = data.getAppLabels.allLabels.DashboardScreen;

        setDeleteAccount(profileScreenLabels.DeleteAccountLabel)
        setDeleteMessage1(profileScreenLabels.DeleteAccountMessage1)
        setDeleteMessage2(profileScreenLabels.DeleteAccountMessage2)
        setDeleteMessage3(profileScreenLabels.DeleteAccountMessage3)
        setDeleteMessage4(profileScreenLabels.DeleteAccountMessage4)

        setEnterLocation(personalDetailsScreenLabels.MandiratesLocationValidation)
        setNoEnquiry(enquiryScreenLabels.NoEnquiry)
        setQuickSearch(dashboardScreenLabels.QuickSearch)
        setCheckRate(personalDetailsScreenLabels.CheckRates)
        setAreYouSure(profileScreenLabels.LogoutMsg)
        setViewMore(dashboardScreenLabels.ViewMore)
        setMandiratesSuccess(personalDetailsScreenLabels.MandiratesSuccess)
        setEnquiries(enquiryScreenLabels.Enquiries)
        setSellerList(sellScreenLabels.SellerList)
        setLotAddedOn(enquiryScreenLabels.Lotaddedon)
        setExpectedon(enquiryScreenLabels.Expectedon)
        setShowInterest(enquiryScreenLabels.ShowInterest)
        setEnquiryAddedOn(enquiryScreenLabels.Enquiryaddedon)
        setViewEnquiries(enquiryScreenLabels.ViewEnquiries)
        setEditEnquiry(enquiryScreenLabels.EditEnquiry)
        setDeleteEnquiryText(enquiryScreenLabels.DeleteEnquiry)
        setViewResponses(enquiryScreenLabels.ViewResponses)
        setDeleteEnquiryAlert(enquiryScreenLabels.DeleteEnquiryAlert)
        setUpdateSuccess(buyScreenLabels.BidSuccessMsg)
        setEnquiryMessage(enquiryScreenLabels.EnquirySuccessMsg)

        setSellerText(dashboardScreenLabels.Seller)
        setEmptyNotification(dashboardScreenLabels.NotificationNotAvailableLabel)
        setNotificationTitle(dashboardScreenLabels.NotificationLabel)
        setActivity(dashboardScreenLabels.MyActivityLabel)
        setEnquiryText(dashboardScreenLabels.EnquiryLabel)

        setNoMandi(personalDetailsScreenLabels.NoMandiRates)
        setDeleteAddress(locationScreenLabels.DeleteAddress)
        setLogoutYes(locationScreenLabels.YesButton)
        setLogoutCancel(locationScreenLabels.CancelButton)
        setNoLods(sellScreenLabels.NoLot)
        setNoBids(buyScreenLabels.NoBids)

        setWatchVideo(dashboardScreenLabels.WatchVideo)

        setGetStart(loginScreenLabels.GetStarted)
        setWelcomeText(loginScreenLabels.Header);
        setContinueText(loginScreenLabels.Continue);
        setEnterPhoneNumebr(loginScreenLabels.MobilePlaceholder)
        setEnterYourName(loginScreenLabels.NamePlaceholder)
        setErrorNumer(loginScreenLabels.MobileValidation)
        setErrorName(loginScreenLabels.NameValidation)
        setLoginandSignup(loginScreenLabels.SignUp);
        setContinueText(loginScreenLabels.Continue)
        setChooseLanguage(loginScreenLabels.Language);
        setOtpVerification(loginScreenLabels.OTPHeader);
        setEnterOtp(loginScreenLabels.OTPEnter);
        setDidntReceive(loginScreenLabels.OTPRetry);
        setApplyText(loginScreenLabels.Apply);
        setReferenceText(loginScreenLabels.EnterReferenceCode);
        setAppliedReference(loginScreenLabels.AppliedYourReferenceCode);
        setRoleAlert(loginScreenLabels.RolePlaceholder)
        setSelectRole(loginScreenLabels.RolePlaceholder);
        setLoginLabel(loginScreenLabels.LogIn)
        
        setSortBy(sortScreenLabels.Sortby)

        setProfileText(profileScreenLabels.Profile)
        setEditProfileText(profileScreenLabels.EditProfile)
        setPersonalInformation(profileScreenLabels.PersonalInfo)
        setLocationDetail(profileScreenLabels.LocationDetails)
        setFarmDetails(profileScreenLabels.FarmDetails)
        setLogout(profileScreenLabels.Logout)
        setNext(profileScreenLabels.Next)
        setHelpLine(profileScreenLabels.HelpLine)

        setNameText(personalDetailsScreenLabels.Name)
        setGender(personalDetailsScreenLabels.Gender)
        setDateOfBirth(personalDetailsScreenLabels.DateOfBirth)
        setMobileNumber(personalDetailsScreenLabels.MobileNumber)
        setEmailId(personalDetailsScreenLabels.Email)
        setPreferredRole(personalDetailsScreenLabels.PreferredRole)
        setNameAlert(personalDetailsScreenLabels.NameMandatory)
        setGenderAlert(personalDetailsScreenLabels.GenderMandatory)
        setDobAlert(personalDetailsScreenLabels.DOBMandatory)
        setMobileAlert(personalDetailsScreenLabels.MobileNumberMandatory)
        setEmailAlert(personalDetailsScreenLabels.EmailMandatory)
        setLanguageAlert(personalDetailsScreenLabels.LanguageMandatory)
        setMaleText(personalDetailsScreenLabels.Male)
        setFemaleText(personalDetailsScreenLabels.Female)
        setOtherText(personalDetailsScreenLabels.Other)
        setPreferredLanguage(personalDetailsScreenLabels.PreferredLanguage)
        setMandiRate(personalDetailsScreenLabels.UploadMandiRates)
        setProfileImage(personalDetailsScreenLabels.ProfileImage)
        setBrowseFile(personalDetailsScreenLabels.BrowseFile)
        setUseCamera(personalDetailsScreenLabels.UseCamera)
        setLocationMandi(personalDetailsScreenLabels.Location)
        setUploaDMandi(personalDetailsScreenLabels.Upload)
        setMandiRates(personalDetailsScreenLabels.MandiRates)
        setRealmandiRates(personalDetailsScreenLabels.Getrealtimemandirates)
        setChangeProfile(personalDetailsScreenLabels.ChangeProfile)

        setCultivableText(farmDetailsScreenLabels.CultivableLand)
        setIrrigationText(farmDetailsScreenLabels.Irrigation)
        setGroundWaterText(farmDetailsScreenLabels.Groundwater)
        setSprinklerText(farmDetailsScreenLabels.Sprinkler)
        setBorewellText(farmDetailsScreenLabels.Borewell)
        setOrganicText(farmDetailsScreenLabels.OrganicFarm)
        setToolsText(farmDetailsScreenLabels.ToolsAvailableforRent)
        setLivestockText(farmDetailsScreenLabels.Livestock)
        setExpertText(farmDetailsScreenLabels.ExpertAdviceNeeded)


        setUserState(locationScreenLabels.State)
        setDistrict(locationScreenLabels.District)
        setTaluk(locationScreenLabels.Taluk)
        setVillage(locationScreenLabels.Village)
        setDoorNo(locationScreenLabels.Door)
        setPincode(locationScreenLabels.Pincode)
        setPlaceholderState(locationScreenLabels.StateMandatory)
        setPlaceholderDistrict(locationScreenLabels.DistrictMandatory)
        setPlaceholderTaluk(locationScreenLabels.TalukMandatory)
        setPlaceholderTown(locationScreenLabels.TownMandatory)
        setPlaceholderVillage(locationScreenLabels.VillageMandatory)
        setPlaceholderDoorNo(locationScreenLabels.DoorMandatory)
        setPlaceholderPinCode(locationScreenLabels.PinMandatory)
        setSelectAddress(locationScreenLabels.DeliveryAddressMandatory)
        setDeleteAddresAlert(locationScreenLabels.DeleteAddressConfirm)

        setDeliverAddress(sellScreenLabels.ProductLocation)
        setAddNewAddress(sellScreenLabels.AddNewAddress)
        setNoAddress(sellScreenLabels.AddNotAvailable)
        setMyAddress(sellScreenLabels.MyAddress)
        setType(sellScreenLabels.Type)
        setPlaceholderType(sellScreenLabels.SelectType)
        setListMyProduct(sellScreenLabels.ListProduct)
        setGradeText(sellScreenLabels.Grade)
        setGradePlaceholder(sellScreenLabels.SelectGrade)
        setAvailableQuality(sellScreenLabels.AvailableQuantity)
        setAvailableQualityPlaceholdery(sellScreenLabels.SelectQuantity)
        setWeightPlaceholder(sellScreenLabels.Weight)
        setOrganic(sellScreenLabels.Organic)
        setPer(sellScreenLabels.Per)
        setAcres(sellScreenLabels.CultivatedArea)
        setAcresPlaceholder(sellScreenLabels.SelectCultivatedArea)
        setProductPrice(sellScreenLabels.AskingPrice)
        setLots(sellScreenLabels.Lots)
        setQuantityText(sellScreenLabels.Quantity)
        setMinAmountPerGvtAlert(sellScreenLabels.MSPValidationMessage)
        setPickupAddress(sellScreenLabels.PickupLocation)

        setProductPricePlaceholder(sellScreenLabels.SelectAskingPrice)
        setSaveLot(sellScreenLabels.SaveLot)
        setGradeAlert(sellScreenLabels.GradeMandatory)
        setQuantityAlert(sellScreenLabels.AvailableQuantityMandatory)
        setWeightAlert(sellScreenLabels.WeightMandatory)
        setWeightUnitAlert(sellScreenLabels.AvailableQuantityUnitMandatory)
        setAcreAlert(sellScreenLabels.CultivatedAreaMandatory)
        setPriceAlert(sellScreenLabels.AskingPriceMandatory)
        setSuccessText(sellScreenLabels.Success)
        setSuccessLot(sellScreenLabels.SuccessMsg)
        setViewLot(sellScreenLabels.ViewLot)
        setBackHome(sellScreenLabels.BacktoHome)
        setStatusText(sellScreenLabels.Status)
        setPlaceBit(sellScreenLabels.PlaceBid)
        setEditLot(sellScreenLabels.EditLot)
        setDeleteLotInfo(sellScreenLabels.DeleteLot)
        setDeleteLotAlert(sellScreenLabels.DeleteLotConfirmation)
        setComingSoon(sellScreenLabels.NoCategory)
        
        setBitsText(buyScreenLabels.BidProduct)
        setSuccessBid(buyScreenLabels.BidSuccess)
        setRequiredQuantity(buyScreenLabels.RequiredQuantity)
        setBidPrice(buyScreenLabels.BidPrice)
        setBidView(buyScreenLabels.ViewBid)
        setStepText(buyScreenLabels.STEP)
        setSaveAddresst(buyScreenLabels.Save)
        setVillageString(buyScreenLabels.Village)
        setBitsTitle(buyScreenLabels.Bids)
        setEditBits(buyScreenLabels.EditBid)
        setDeleteBits(buyScreenLabels.DeleteBid)
        setBidPricePlaceholder(buyScreenLabels.BidPriceMandatory)
        setUpdateon(buyScreenLabels.Updatedon)
        setUpdateLot(buyScreenLabels.UpdateLot)
        setUpdateBit(buyScreenLabels.UpdateBid)
        setDeleteBidAlert(buyScreenLabels.DeleteBidConfirmation)
        setBids(buyScreenLabels.Bids)
        setCheckQuantityAlert(buyScreenLabels.CheckQuantityAlert)
        setApproveErrorMsg(buyScreenLabels.ApproveErrorMsg)
        setAreYouSureAccept(buyScreenLabels.ApproveConfirmMsg)
        setAreYouSureDecline(buyScreenLabels.DeclineConfirmMsg)
        setBidText(buyScreenLabels.Bids)

        setEnquireText(enquiryScreenLabels.EnquireNow)
        setBuyText(enquiryScreenLabels.BuyNow)
        setSellText(enquiryScreenLabels.SellNow)
        setNewEnquriyText(enquiryScreenLabels.NewEnquiry)
        setDeliverOn(enquiryScreenLabels.DeliverOn)
        setPlaceEnquiry(enquiryScreenLabels.PlaceEnquiry)
        setDeliverOnAlert(enquiryScreenLabels.DeliveryDateMandatory)
        setEnquirySuccess(enquiryScreenLabels.SuccessEnquiry)
        setViewExpert(enquiryScreenLabels.ViewEnquiry)
        setMyExpert(enquiryScreenLabels.MyEnquiry)
        setAlertRequiredQuantity(enquiryScreenLabels.RequiredQuantityMandatory)
        setBiddedOn(enquiryScreenLabels.Biddedon)
        setPickup(enquiryScreenLabels.PickUpAddress)

        setHome(footerScreenLabels.Home)
        setBuy(footerScreenLabels.Buy)
        setSell(footerScreenLabels.Sell)
        setBids(footerScreenLabels.Bids)

    }
    const onPressSelectLanguage = () => {
        navigation.navigate('LanguageListScreen', {
            onReturn: (item) => {
                console.log('itemitemitem', item);
                setIsFetch(false);
                let languageTemp = item.languageId
                setState({
                    ...state,
                    languageId: item.languageId,
                });
                updateLanguage(languageTemp)
            },
            isEnterNumber: true,
        })
        // navigation.navigate('LanguageListScreen')
    }
    const updateLanguage = (languageTemp) => {
        console.log('languageTemplanguageTemplanguageTemplanguageTemp', languageTemp);
        setLanguageInfoId(languageTemp)
        setTimeout(async () => {
            setIsGetLables(true);
        }, 500);
    }
    const onPressShowList = () => {
        setModalVisible(true);

    }
    const handleSelectItem = (item, index) => {
        setUserRole(item.Name)
        setUserRoleId(item.Id)
        setModalVisible(false);
    }
    const updateLoading = (isloading) => {
        setIsFetch(true);
        console.log('updateLoading 1111  ----- ', isloading)
        setLoadingIndicator((isloading == undefined) ? false : isloading);
    }
    const updateDate = (list) => {
        console.log('listlist 11111  ----- ', list)
        setIsFetch(true);
        setArrayOfItems(list);
    }
    const showActionSheet = () => {
        this.ActionSheet.show()
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
                    // setPath(Platform.OS === "android" ? ('file://' + response.assets[0].uri) : response.assets[0].uri)
                    // setIsProfile(true)
                    // setIsDefaultPic(false)
                    setProfileImageUrl(response.assets[0].uri)
                    uploadImage(Platform.OS === "android" ? ('file://' + response.assets[0].uri) : response.assets[0].uri);
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
        let isStoragePermitted = await requestExternalWritePermission();
        if (isCameraPermitted && isStoragePermitted) {
            ImagePicker.launchCamera(options, (res) => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    console.log('User tapped custom button: ', res.customButton);
                    alert(res.customButton);
                } else {
                    // setPath(Platform.OS === "android" ? ('file://' + res.assets[0].uri) : res.assets[0].uri)
                    // setIsProfile(true)
                    // setIsDefaultPic(false)
                    // setImage_url(res.assets[0].uri)
                    setProfileImageUrl(res.assets[0].uri)
                    uploadImage(res.assets[0].uri);
                }
            });
        }
    };
    const access = new Credentials({
        accessKeyId: "366C9B5CDA3A8A07C6AE",
        secretAccessKey: "gL9Gy80fmJie38u8MsdalXWzOAasVwjxqXKKkZYm",
    });

    const s3 = new S3({
        credentials: access,
		endpoint: 'https://s3.filebase.com', 
        region: "us-east-1",
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
        // var urlaws = await request();
        // let image_file = await fetch(imageUrl)
        //     .then((r) => r.blob())
        //     .then(
        //         (blobFile) =>
        //             new File([blobFile], uuid, {
        //                 type: 'image/jpg',
        //             }),
        //     );
        // console.log('url -----------', image_file)

        const profileImage=await uploadImageToStorage(imageUrl);
        setTimeout(async () => {
            // const res = await fetchUploadUrl(urlaws, image_file);
            setUserProfileImage(profileImage)
           
            setLoadingIndicator(false)
        }, 100);
    }
    const onPressCheckReferalCode = () => {
        if (referalCode.length < 4) {
            Alert.alert('', 'Please enter valid referal code', [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            setIsReferalApi(true)
        }
    }
    const onPressTerms = () => {
        if(privacyPolicy != ''){
            Linking.openURL(privacyPolicy)
        }
    }
    const updatePolicyLoading = (isloading) => {
        setIsFetchPolicy(false);
    }
    const updatePolicyDate = (privacyPolicyInfo) => {
        setIsFetchPolicy(true);
        setPrivacyPolicy(privacyPolicyInfo)
    }

    const navigateLoginScreen = () => {
        navigation.navigate('LoginScreen')
    }

    const toggleSwitch = () =>  setIsToggleEnabled(previousState => !previousState)

    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
                {(!isFetchPolicy) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'policy'}
                    updateLoading={updatePolicyLoading}
                    updateDate={updatePolicyDate} />
            )}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                style={styles.scroll_view}>
                <View style={[styles.scroll_view, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ImageBackground style={{ width: imageWidth, height: imageHeight }}
                        source={images.HEADINGBACKGROUNDIMAGE}>
                        <TouchableOpacity style={styles.language_select}
                            onPress={onPressSelectLanguage}>
                            <Image style={styles.language_icon}
                                source={images.LANGUAGEICON}></Image>
                        </TouchableOpacity>
                    </ImageBackground>
                    <Text style={styles.text_welcome}>{welcomeText}</Text>
                    {/* <View style={styles.view_line}>
                        <View style={[styles.line_view, { marginRight: 10, }]}></View>
                        <Text style={styles.text_login}>{loginandSignup}</Text>
                        <View style={[styles.line_view, { marginLeft: 10, }]}></View>
                    </View> */}
                    <View style={{marginTop:10,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{ color: colors.text_Color, fontFamily: fonts.MONTSERRAT_MEDIUM, }}>
                            {alreadyRegister}?</Text>
                        <TouchableOpacity onPress={navigateLoginScreen}>
                            <Text style={{ color: "red", paddingHorizontal: 5, textAlign: 'center' }}>{loginLabel}</Text></TouchableOpacity>
                    </View>

                    <View style={[styles.view_top,{marginTop:10}]}>
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

                        <Text style={styles.text_name}>{profileImage}</Text>
                    </View>

                    <View style={styles.view_textInput}>
                        <Text style={styles.text_code}>{' + 91'}</Text>
                        <TextInput style={[styles.textInput_view, { width: '80%', }]}
                            placeholder={enterPhoneNumebr}
                            placeholderTextColor={colors.text_Color}
                            value={userMobileNumber}
                            maxLength={10}
                            onChangeText={setUserMobileNumber}
                            keyboardType='numeric'
                        />
                    </View>
                    <View style={styles.view_textInput}>
                        <TextInput style={styles.textInput_view}
                            placeholder={enterYourName}
                            placeholderTextColor={colors.text_Color}
                            value={userName}
                            onChangeText={setUserName}
                            keyboardType='default'
                        />
                    </View>
                    <View style={styles.view_textInput}>
                        <TextInput style={[styles.textInput_view, { position: 'absolute', left: 0, width: '80%', }]}
                            editable={false}
                            placeholder={roleAlert}
                            placeholderTextColor={colors.text_Color}
                            value={userRole}
                            onChangeText={setUserRole}
                            keyboardType='default'
                        />
                        <Image style={styles.image_dropDown}
                            source={images.DROPDOWNARROWICON} />
                        <TouchableOpacity style={{ width: '100%', height: '100%', }}
                            onPress={onPressShowList}>
                        </TouchableOpacity>
                    </View>

                    {/* <View style={styles.referralToggleView}>
                        <Text style={{ textAlign:"center", color: colors.text_Color, fontFamily: fonts.MONTSERRAT_MEDIUM, }}>{referralCode}</Text>
                        <Switch
                           trackColor={{false: '', true: ''}}
                           thumbColor={isToggleEnabled ? 'green' : '#fff'}
                           ios_backgroundColor="#3e3e3e"
                           onValueChange={toggleSwitch}
                           value={isToggleEnabled}/>
                    </View>

                    {( isToggleEnabled && !isReferal) && (
                        <View style={styles.view_textInput1}>
                            <TextInput style={[styles.textInput_view, { width: '65%', }]}
                                placeholder={referenceText}
                                placeholderTextColor={colors.text_Color}
                                value={referalCode}
                                maxLength={16}
                                onChangeText={setReferalCode}
                                keyboardType='default'
                            />
                            <TouchableOpacity style={{ width: 80, height: 30, borderRadius: 4, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 10, backgroundColor: 'rgba(1, 165, 82, 0.2)' }}
                                onPress={onPressCheckReferalCode}>
                                <Text style={styles.text_apply}>{applyText}</Text>
                            </TouchableOpacity>
                        </View>
                    )} */}
                    {(isReferal) && (
                        <View style={[styles.view_textInput1, { borderColor: colors.landing_background }]}>
                            <Image style={{ marginLeft: 10, width: 20, height: 20, backgroundColor: colors.white_color, borderRadius: 10, }}
                                source={images.TICKICON}>
                            </Image>
                            <Text style={[styles.text_apply, { marginLeft: 10, width: '80%', }]}>{appliedReference}</Text>
                        </View>
                    )}
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', }}>
                    <TouchableOpacity style={{ marginLeft: 35, marginRight: 5, width: 30, height: 30, }}
                        onPress={() =>
                            setCheckBoxSelected(!checkBoxSelected)}>
                        <Image style={{ width: 30, height: 30 }}
                            source={(checkBoxSelected) ? images.SELECTEDBOX : images.UNSELECTEDBOX}>

                        </Image>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', }}>
                        <Text style={[styles.subTextStyle]}>
                            I agree to the

                        </Text>
                        <TouchableOpacity style={{ justifyContent: 'center', }}
                            onPress={onPressTerms}>
                            <Text style={[styles.terms_text]}> {'Terms & conditions'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* <View style={{flexDirection:"row"}}>
                        <Text style={{marginLeft:36, color: colors.text_Color, fontFamily: fonts.MONTSERRAT_MEDIUM, }}>
                            {alreadyRegister}?</Text>
                        <TouchableOpacity onPress={navigateLoginScreen}>
                            <Text style={{ color: "red", paddingHorizontal: 5, textAlign: 'center' }}>{singinText}</Text></TouchableOpacity>
                    </View> */}
            </ScrollView>
            <View style={{ marginTop: 20, width: '100%', height: 45, alignItems: 'center' }}>
                <TouchableOpacity style={styles.continue_touch}
                    onPress={onPressContinue}>
              {registerLoading?   <ActivityIndicator size="small" color={colors.white_color} />:<Text style={styles.continue_text}>{continueText}</Text>}      
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%', height: 25, }} />
            {(isShowLanguageList) && (
                <View style={styles.overlay}>
                    <TouchableOpacity style={styles.close_view}
                        onPress={() => setIsShowLanguageList(false)}>
                        <Text style={styles.close_text}>{'X'}</Text>
                    </TouchableOpacity>
                    <View style={styles.view_languageList}>
                        <LanguageSelectionComponent
                            isEnterNumber={true}
                            onPressContinue={updateLanguageInfo} />
                    </View>
                </View>
            )}
            {(!isFetch) && (
                <Query query={GETROLES_QUERY} variables={{ languageId: state.languageId }}>
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
            {(isGetLables) && (
                <Query query={lableQuery} variables={{ languageId: state.languageId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateValues(true);
                            return null
                        };
                        if (error) {
                            updateValues(false);
                            return null;
                        }
                        if (!data) {
                            updateValues(false);
                            return null;
                        }
                        updateLableText(data);
                        return null;
                    }}
                </Query>
            )}
            {(isReferalApi) && (
                <Query query={REFERALCODE_QUERY} variables={{ referalCode: referalCode }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateReferalValues(true);
                            return null
                        };
                        if (error) {
                            console.log('errorerrorerror', error)
                            updateReferalValues(false);
                            return null;
                        }
                        if (!data) {
                            updateReferalValues(false);
                            return null;
                        }
                        console.log('datadatadatadatadatadatadata', data)
                        updateReferalText(data.checkReferalCode);
                        return null;
                    }}
                </Query>
            )}
            {(modalVisible) && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Pressable style={styles.popup_view}
                        onPress={() => setModalVisible(!modalVisible)}>
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
                        </View>
                    </Pressable>
                </Modal>
            )}
            <ActionSheet
                ref={o => this.ActionSheet = o}
                title={'Choose type'}
                options={['Choose Library', 'Choose Camera', 'cancel']}
                cancelButtonIndex={2}
                onPress={(index) =>
                    selectActionSheet(index)
                }
            />
            {loadingIndicator && <Loading />}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center' ,
        backgroundColor: colors.background_color,
    },
    scroll_view: {
        flex: 1,
    },
    language_select: {
        width: 40,
        height: 40,
        position: 'absolute',
        top: 30,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    language_icon: {
        width: 20,
        height: 20,
    },
    text_welcome: {
        marginTop: 25,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 20,
        color: colors.text_Color,
    },
    view_line: {
        marginTop: 20,
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text_login: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 10,
        color: '#777777',
    },
    line_view: {
        width: '20%',
        height: 1,
        backgroundColor: '#ededed',
    },
    view_textInput: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 40,
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: 4,
    },
    view_textInput1: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30,
        width: '80%',
        height: 40,
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: 4,
    },
    textInput_view: {
        marginLeft: 10,
        width: '95%',
        height: 40,
        fontSize: 14,
        color: colors.text_Color,
        padding: 1,
    },
    text_code: {
        width: 40,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: colors.text_Color,
    },
    overlay: {
        alignItems: 'center',
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
    },
    view_languageList: {
        width: '100%',
        height: '75%',
        overflow: 'hidden',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        position: 'absolute',
        bottom: 0,
    },
    close_view: {
        marginTop: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'black'
    },
    close_text: {
        fontSize: 18,
        color: colors.white_color
    },
    continue_text: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        textAlign: 'center',
        fontSize: 18,
        color: colors.white_color
    },
    continue_touch: {
        width: '80%',
        height: 45,
        justifyContent: 'center',
        backgroundColor: colors.landing_background,
        borderRadius: 4,
    },
    view_top: {
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_profileImage: {
        marginTop: 15,
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    image_user: {
        width: 100,
        height: 100,
        backgroundColor: colors.white_color,
        borderRadius: 50,
    },
    touch_editProfile: {
        position: 'absolute',
        bottom: 5,
        right: 2,
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        borderRadius: 13,

    },
    popup_view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lite_black,
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
        flex: 1,
        flexDirection: "column",
        height: 40,
    },
    task_title: {
        flex: 1,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        margin: 5,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    image_dropDown: {
        width: 14,
        height: 7,
        position: 'absolute',
        right: 10,
    },
    text_apply: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 12,
        color: colors.landing_background,
        padding: 1,
    },
    terms_text: {
        marginTop: 2,
        marginLeft: 2,
        color: '#4B7BEC',
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
    },
    subTextStyle: {
        marginVertical: 10,
        fontSize: 12,
        color: colors.text_Color,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
    },
    referralToggleView: {
        flexDirection: 'row',
        marginTop: 30,
        width: '80%',
        alignItems:"center",
        justifyContent:"space-between"
    }
});

export default EnterMobileNumberScreen;


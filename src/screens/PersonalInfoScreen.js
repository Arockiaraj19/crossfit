import { useMutation } from '@apollo/react-hooks';
import { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import gql from 'graphql-tag';
import moment from "moment";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Query, graphql } from 'react-apollo';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, PermissionsAndroid, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import DatePicker from 'react-native-date-picker';
import EncryptedStorage from 'react-native-encrypted-storage';
import * as ImagePicker from "react-native-image-picker";
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import { getUserProfileImage } from '../helpers/AppManager';
import uploadImageToStorage from '../helpers/uploadImage';

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
mutation ($Id: ID!, $name: String!, $gender: ID!, $dob: String!, $emailId: String!, $preferredLanguageId: ID!, $primaryRoleId: ID!){
    updateUserProfile(Id: $Id , name: $name, gender: $gender, dob: $dob, emailId: $emailId, preferredLanguageId: $preferredLanguageId, primaryRoleId: $primaryRoleId) 
   
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

const lableQuery = gql`
query getAppLabels($languageId: ID!) {
    getAppLabels(languageId: $languageId) 
  }
`;

const PersonalInfoScreen = ({ navigation }) => {

    // useEffect(() => {
    //     setIsProfile();

    //     return () => {
    //         removeIsProfile();
    //     }
    // }, []);

    // const setIsProfile = async () => {
    //     await EncryptedStorage.setItem('isProfile', "true");
    // }
    // const removeIsProfile = async () => {
    //     EncryptedStorage.removeItem('isProfile');
    // }

    const {

        setGetStart,

        setWelcomeText,

        setLoginandSignup,

        setContinueText,

        setEnterPhoneNumebr,

        setEnterYourName,

        setChooseLanguage,

        setOtpVerification,

        setEnterOtp,

        setDidntReceive,

        setErrorNumer,

        setErrorName,

        setDeliverAddress,

        setAddNewAddress,

        setNoAddress,

        setMyAddress,

        setType,

        setUserState,

        setDistrict,

        setTaluk,

        setVillage,

        setDoorNo,

        setPincode,

        setNext,

        setPlaceholderType,

        setPlaceholderState,

        setPlaceholderDistrict,

        setPlaceholderTaluk,

        setPlaceholderTown,

        setPlaceholderVillage,

        setPlaceholderDoorNo,

        setPlaceholderPinCode,

        setSelectAddress,

        setListMyProduct,

        setGradeText,

        setGradePlaceholder,

        setAvailableQuality,

        setAvailableQualityPlaceholdery,

        setWeightPlaceholder,

        setAcres,

        setAcresPlaceholder,

        setProductPrice,

        setProductPricePlaceholder,

        setSaveLot,
        setGradeAlert,
        setQuantityAlert,
        setWeightAlert,
        setAcreAlert,
        setPriceAlert,
        setSuccessText,
        setSuccessLot,
        setViewLot,
        setBackHome,
        setStatusText,
        setPlaceBit,
        setBitsText,
        setWeightUnitAlert,
        setSuccessBid,
        setRequiredQuantity,
        setBidPrice,
        setBidView,
        setStepText,
        saveAddress,
        setSaveAddresst,
        setVillageString,
        setBitsTitle,
        setEditBits,
        setDeleteBits,
        setEnquireText,
        setBuyText,
        setSellText,
        setNewEnquriyText,
        setDeliverOn,
        setPlaceEnquiry,
        setDeliverOnAlert,
        setProfileText,
        setEditProfileText,
        personalInformation,
        setPersonalInformation,
        setLocationDetail,
        setFarmDetails,
        setLogout,

        setNameText,

        setGender,

        setDateOfBirth,

        setMobileNumber,

        setEmailId,

        setPreferredLanguage,

        setPreferredRole,

        setNameAlert,

        setGenderAlert,

        setDobAlert,

        setMobileAlert,

        setEmailAlert,

        setLanguageAlert,

        setRoleAlert,

        setMaleText,

        setFemaleText,

        setOtherText,
        setCultivableText,
        setIrrigationText,
        setGroundWaterText,
        setSprinklerText,
        setBorewellText,
        setOrganicText,
        setToolsText,
        setLivestockText,
        setExpertText,
        setEnquirySuccess,
        setViewExpert,
        setMyExpert,
        setAlertRequiredQuantity,
        setBiddedOn,
        setPickup,
        setEditLot,
        setDeleteLotInfo,
        setSortBy,
        setBidPricePlaceholder,
        setUpdateon,
        setUpdateLot,
        setUpdateBit,
        setDeleteBidAlert,
        setDeleteLotAlert,
        setDeleteAddresAlert,
        setOrganic,
        setPer,
        setSelectRole,
        setHome,
        setBuy,
        setSell,
        setBids,
        setLots,
        setWatchVideo,
        setMandiRate,
        setProfileImage,
        setBrowseFile,
        setUseCamera,
        setLocationMandi,
        setUploaDMandi,
        setMandiRates,
        setRealmandiRates,

        setQuantityText,
        setApplyText,
        setReferenceText,
        setAppliedReference,
        setCheckQuantityAlert,


        setEnquiries,
        setSellerList,
        setLotAddedOn,
        setExpectedon,
        setShowInterest,
        setEnquiryAddedOn,
        setViewEnquiries,
        setEditEnquiry,
        setDeleteEnquiryText,
        setViewResponses,
        setDeleteEnquiryAlert,
        setDeleteAddress,
        setLogoutYes,
        setLogoutCancel,
        setNoMandi,
        setNoLods,
        setNoBids,
        changeProfile, setChangeProfile,

        setCheckRate,
        setQuickSearch,
        setSellerText,
        setViewMore,
        setAreYouSure,
        setMandiratesSuccess,
        setEnterLocation,
        setNoEnquiry,
        setUpdateSuccess,
        setEnquiryMessage,

        setHelpLine,
        setMinAmountPerGvtAlert,
        setApproveErrorMsg,
        setPickupAddress,
        setComingSoon,
        setAreYouSureAccept,
        setAreYouSureDecline,
        setDeleteAccount,
        setDeleteMessage1,
        setDeleteMessage2,
        setDeleteMessage3,
        setDeleteMessage4,

        setEmptyNotification,
        setNotificationTitle,
        setActivity,
        setBidText,
        setEnquiryText,
        setLoginLabel

    } = useContext(AuthContext);

    // const updateLableText = async (data) => {
    //     setIsGetLables(false)
    //     console.log('data ------------------', data);
    //     var loginScreenLabels = data.getAppLabels.allLabels.LoginScreen;
    //     var sortScreenLabels = data.getAppLabels.allLabels.Sort;
    //     var profileScreenLabels = data.getAppLabels.allLabels.ProfileDetails;
    //     var personalDetailsScreenLabels = data.getAppLabels.allLabels.PersonalDetails;
    //     var farmDetailsScreenLabels = data.getAppLabels.allLabels.FarmDetails;
    //     var locationScreenLabels = data.getAppLabels.allLabels.MyLocation;
    //     var sellScreenLabels = data.getAppLabels.allLabels.Sell;
    //     var buyScreenLabels = data.getAppLabels.allLabels.Buy;
    //     var enquiryScreenLabels = data.getAppLabels.allLabels.Enquiry;
    //     var footerScreenLabels = data.getAppLabels.allLabels.Footer;
    //     var dashboardScreenLabels = data.getAppLabels.allLabels.DashboardScreen;

    //     setDeleteAccount(profileScreenLabels.DeleteAccountLabel)
    //     setDeleteMessage1(profileScreenLabels.DeleteAccountMessage1)
    //     setDeleteMessage2(profileScreenLabels.DeleteAccountMessage2)
    //     setDeleteMessage3(profileScreenLabels.DeleteAccountMessage3)
    //     setDeleteMessage4(profileScreenLabels.DeleteAccountMessage4)

    //     setEnterLocation(personalDetailsScreenLabels.MandiratesLocationValidation)
    //     setNoEnquiry(enquiryScreenLabels.NoEnquiry)
    //     setQuickSearch(dashboardScreenLabels.QuickSearch)
    //     setCheckRate(personalDetailsScreenLabels.CheckRates)
    //     setAreYouSure(profileScreenLabels.LogoutMsg)
    //     setViewMore(dashboardScreenLabels.ViewMore)
    //     setMandiratesSuccess(personalDetailsScreenLabels.MandiratesSuccess)
    //     setEnquiries(enquiryScreenLabels.Enquiries)
    //     setSellerList(sellScreenLabels.SellerList)
    //     setLotAddedOn(enquiryScreenLabels.Lotaddedon)
    //     setExpectedon(enquiryScreenLabels.Expectedon)
    //     setShowInterest(enquiryScreenLabels.ShowInterest)
    //     setEnquiryAddedOn(enquiryScreenLabels.Enquiryaddedon)
    //     setViewEnquiries(enquiryScreenLabels.ViewEnquiries)
    //     setEditEnquiry(enquiryScreenLabels.EditEnquiry)
    //     setDeleteEnquiryText(enquiryScreenLabels.DeleteEnquiry)
    //     setViewResponses(enquiryScreenLabels.ViewResponses)
    //     setDeleteEnquiryAlert(enquiryScreenLabels.DeleteEnquiryAlert)
    //     setUpdateSuccess(buyScreenLabels.BidSuccessMsg)
    //     setEnquiryMessage(enquiryScreenLabels.EnquirySuccessMsg)

    //     setSellerText(dashboardScreenLabels.Seller)
    //     setEmptyNotification(dashboardScreenLabels.NotificationNotAvailableLabel)
    //     setNotificationTitle(dashboardScreenLabels.NotificationLabel)
    //     setActivity(dashboardScreenLabels.MyActivityLabel)
    //     setEnquiryText(dashboardScreenLabels.EnquiryLabel)

    //     setNoMandi(personalDetailsScreenLabels.NoMandiRates)
    //     setDeleteAddress(locationScreenLabels.DeleteAddress)
    //     setLogoutYes(locationScreenLabels.YesButton)
    //     setLogoutCancel(locationScreenLabels.CancelButton)
    //     setNoLods(sellScreenLabels.NoLot)
    //     setNoBids(buyScreenLabels.NoBids)

    //     setWatchVideo(dashboardScreenLabels.WatchVideo)

    //     setGetStart(loginScreenLabels.GetStarted)
    //     setWelcomeText(loginScreenLabels.Header);
    //     setContinueText(loginScreenLabels.Continue);
    //     setEnterPhoneNumebr(loginScreenLabels.MobilePlaceholder)
    //     setEnterYourName(loginScreenLabels.NamePlaceholder)
    //     setErrorNumer(loginScreenLabels.MobileValidation)
    //     setErrorName(loginScreenLabels.NameValidation)
    //     setLoginandSignup(loginScreenLabels.SignUp);
    //     setContinueText(loginScreenLabels.Continue)
    //     setChooseLanguage(loginScreenLabels.Language);
    //     setOtpVerification(loginScreenLabels.OTPHeader);
    //     setEnterOtp(loginScreenLabels.OTPEnter);
    //     setDidntReceive(loginScreenLabels.OTPRetry);
    //     setApplyText(loginScreenLabels.Apply);
    //     setReferenceText(loginScreenLabels.EnterReferenceCode);
    //     setAppliedReference(loginScreenLabels.AppliedYourReferenceCode);
    //     setRoleAlert(loginScreenLabels.RolePlaceholder)
    //     setSelectRole(loginScreenLabels.RolePlaceholder);
    //     setLoginLabel(loginScreenLabels.LogIn)

    //     setSortBy(sortScreenLabels.Sortby)

    //     setProfileText(profileScreenLabels.Profile)
    //     setEditProfileText(profileScreenLabels.EditProfile)
    //     setPersonalInformation(profileScreenLabels.PersonalInfo)
    //     setLocationDetail(profileScreenLabels.LocationDetails)
    //     setFarmDetails(profileScreenLabels.FarmDetails)
    //     setLogout(profileScreenLabels.Logout)
    //     setNext(profileScreenLabels.Next)
    //     setHelpLine(profileScreenLabels.HelpLine)

    //     setNameText(personalDetailsScreenLabels.Name)
    //     setGender(personalDetailsScreenLabels.Gender)
    //     setDateOfBirth(personalDetailsScreenLabels.DateOfBirth)
    //     setMobileNumber(personalDetailsScreenLabels.MobileNumber)
    //     setEmailId(personalDetailsScreenLabels.Email)
    //     setPreferredRole(personalDetailsScreenLabels.PreferredRole)
    //     setNameAlert(personalDetailsScreenLabels.NameMandatory)
    //     setGenderAlert(personalDetailsScreenLabels.GenderMandatory)
    //     setDobAlert(personalDetailsScreenLabels.DOBMandatory)
    //     setMobileAlert(personalDetailsScreenLabels.MobileNumberMandatory)
    //     setEmailAlert(personalDetailsScreenLabels.EmailMandatory)
    //     setLanguageAlert(personalDetailsScreenLabels.LanguageMandatory)
    //     setMaleText(personalDetailsScreenLabels.Male)
    //     setFemaleText(personalDetailsScreenLabels.Female)
    //     setOtherText(personalDetailsScreenLabels.Other)
    //     setPreferredLanguage(personalDetailsScreenLabels.PreferredLanguage)
    //     setMandiRate(personalDetailsScreenLabels.UploadMandiRates)
    //     setProfileImage(personalDetailsScreenLabels.ProfileImage)
    //     setBrowseFile(personalDetailsScreenLabels.BrowseFile)
    //     setUseCamera(personalDetailsScreenLabels.UseCamera)
    //     setLocationMandi(personalDetailsScreenLabels.Location)
    //     setUploaDMandi(personalDetailsScreenLabels.Upload)
    //     setMandiRates(personalDetailsScreenLabels.MandiRates)
    //     setRealmandiRates(personalDetailsScreenLabels.Getrealtimemandirates)
    //     setChangeProfile(personalDetailsScreenLabels.ChangeProfile)

    //     setCultivableText(farmDetailsScreenLabels.CultivableLand)
    //     setIrrigationText(farmDetailsScreenLabels.Irrigation)
    //     setGroundWaterText(farmDetailsScreenLabels.Groundwater)
    //     setSprinklerText(farmDetailsScreenLabels.Sprinkler)
    //     setBorewellText(farmDetailsScreenLabels.Borewell)
    //     setOrganicText(farmDetailsScreenLabels.OrganicFarm)
    //     setToolsText(farmDetailsScreenLabels.ToolsAvailableforRent)
    //     setLivestockText(farmDetailsScreenLabels.Livestock)
    //     setExpertText(farmDetailsScreenLabels.ExpertAdviceNeeded)


    //     setUserState(locationScreenLabels.State)
    //     setDistrict(locationScreenLabels.District)
    //     setTaluk(locationScreenLabels.Taluk)
    //     setVillage(locationScreenLabels.Village)
    //     setDoorNo(locationScreenLabels.Door)
    //     setPincode(locationScreenLabels.Pincode)
    //     setPlaceholderState(locationScreenLabels.StateMandatory)
    //     setPlaceholderDistrict(locationScreenLabels.DistrictMandatory)
    //     setPlaceholderTaluk(locationScreenLabels.TalukMandatory)
    //     setPlaceholderTown(locationScreenLabels.TownMandatory)
    //     setPlaceholderVillage(locationScreenLabels.VillageMandatory)
    //     setPlaceholderDoorNo(locationScreenLabels.DoorMandatory)
    //     setPlaceholderPinCode(locationScreenLabels.PinMandatory)
    //     setSelectAddress(locationScreenLabels.DeliveryAddressMandatory)
    //     setDeleteAddresAlert(locationScreenLabels.DeleteAddressConfirm)

    //     setDeliverAddress(sellScreenLabels.ProductLocation)
    //     setAddNewAddress(sellScreenLabels.AddNewAddress)
    //     setNoAddress(sellScreenLabels.AddNotAvailable)
    //     setMyAddress(sellScreenLabels.MyAddress)
    //     setType(sellScreenLabels.Type)
    //     setPlaceholderType(sellScreenLabels.SelectType)
    //     setListMyProduct(sellScreenLabels.ListProduct)
    //     setGradeText(sellScreenLabels.Grade)
    //     setGradePlaceholder(sellScreenLabels.SelectGrade)
    //     setAvailableQuality(sellScreenLabels.AvailableQuantity)
    //     setAvailableQualityPlaceholdery(sellScreenLabels.SelectQuantity)
    //     setWeightPlaceholder(sellScreenLabels.Weight)
    //     setOrganic(sellScreenLabels.Organic)
    //     setPer(sellScreenLabels.Per)
    //     setAcres(sellScreenLabels.CultivatedArea)
    //     setAcresPlaceholder(sellScreenLabels.SelectCultivatedArea)
    //     setProductPrice(sellScreenLabels.AskingPrice)
    //     setLots(sellScreenLabels.Lots)
    //     setQuantityText(sellScreenLabels.Quantity)
    //     setMinAmountPerGvtAlert(sellScreenLabels.MSPValidationMessage)
    //     setPickupAddress(sellScreenLabels.PickupLocation)

    //     setProductPricePlaceholder(sellScreenLabels.SelectAskingPrice)
    //     setSaveLot(sellScreenLabels.SaveLot)
    //     setGradeAlert(sellScreenLabels.GradeMandatory)
    //     setQuantityAlert(sellScreenLabels.AvailableQuantityMandatory)
    //     setWeightAlert(sellScreenLabels.WeightMandatory)
    //     setWeightUnitAlert(sellScreenLabels.AvailableQuantityUnitMandatory)
    //     setAcreAlert(sellScreenLabels.CultivatedAreaMandatory)
    //     setPriceAlert(sellScreenLabels.AskingPriceMandatory)
    //     setSuccessText(sellScreenLabels.Success)
    //     setSuccessLot(sellScreenLabels.SuccessMsg)
    //     setViewLot(sellScreenLabels.ViewLot)
    //     setBackHome(sellScreenLabels.BacktoHome)
    //     setStatusText(sellScreenLabels.Status)
    //     setPlaceBit(sellScreenLabels.PlaceBid)
    //     setEditLot(sellScreenLabels.EditLot)
    //     setDeleteLotInfo(sellScreenLabels.DeleteLot)
    //     setDeleteLotAlert(sellScreenLabels.DeleteLotConfirmation)
    //     setComingSoon(sellScreenLabels.NoCategory)

    //     setBitsText(buyScreenLabels.BidProduct)
    //     setSuccessBid(buyScreenLabels.BidSuccess)
    //     setRequiredQuantity(buyScreenLabels.RequiredQuantity)
    //     setBidPrice(buyScreenLabels.BidPrice)
    //     setBidView(buyScreenLabels.ViewBid)
    //     setStepText(buyScreenLabels.STEP)
    //     setSaveAddresst(buyScreenLabels.Save)
    //     setVillageString(buyScreenLabels.Village)
    //     setBitsTitle(buyScreenLabels.Bids)
    //     setEditBits(buyScreenLabels.EditBid)
    //     setDeleteBits(buyScreenLabels.DeleteBid)
    //     setBidPricePlaceholder(buyScreenLabels.BidPriceMandatory)
    //     setUpdateon(buyScreenLabels.Updatedon)
    //     setUpdateLot(buyScreenLabels.UpdateLot)
    //     setUpdateBit(buyScreenLabels.UpdateBid)
    //     setDeleteBidAlert(buyScreenLabels.DeleteBidConfirmation)
    //     setBids(buyScreenLabels.Bids)
    //     setCheckQuantityAlert(buyScreenLabels.CheckQuantityAlert)
    //     setApproveErrorMsg(buyScreenLabels.ApproveErrorMsg)
    //     setAreYouSureAccept(buyScreenLabels.ApproveConfirmMsg)
    //     setAreYouSureDecline(buyScreenLabels.DeclineConfirmMsg)
    //     setBidText(buyScreenLabels.Bids)

    //     setEnquireText(enquiryScreenLabels.EnquireNow)
    //     setBuyText(enquiryScreenLabels.BuyNow)
    //     setSellText(enquiryScreenLabels.SellNow)
    //     setNewEnquriyText(enquiryScreenLabels.NewEnquiry)
    //     setDeliverOn(enquiryScreenLabels.DeliverOn)
    //     setPlaceEnquiry(enquiryScreenLabels.PlaceEnquiry)
    //     setDeliverOnAlert(enquiryScreenLabels.DeliveryDateMandatory)
    //     setEnquirySuccess(enquiryScreenLabels.SuccessEnquiry)
    //     setViewExpert(enquiryScreenLabels.ViewEnquiry)
    //     setMyExpert(enquiryScreenLabels.MyEnquiry)
    //     setAlertRequiredQuantity(enquiryScreenLabels.RequiredQuantityMandatory)
    //     setBiddedOn(enquiryScreenLabels.Biddedon)
    //     setPickup(enquiryScreenLabels.PickUpAddress)

    //     setHome(footerScreenLabels.Home)
    //     setBuy(footerScreenLabels.Buy)
    //     setSell(footerScreenLabels.Sell)
    //     setBids(footerScreenLabels.Bids)

    //     await EncryptedStorage.setItem('languageId', userLanguageId);



    // }
    const {

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
        languageAlert,
        roleAlert,

        selectRole,
    } = useContext(AuthContext);
    const [updateloading, setUpdateLoading] = React.useState(false);
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
    const [updateUserProfile, { loading }] = useMutation(UPDATEUSERPROFILE_QUERY);
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

    const [updateUserProfileImage, { }] = useMutation(UPDATEPROFILEIMAGE_QUERY);
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
    const [isGetLables, setIsGetLables] = React.useState(false);
    const access = new Credentials({
        accessKeyId: "AKIASVAYFY3SML3QPD5N",
        secretAccessKey: "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",
    });

    const s3 = new S3({
        credentials: access,
        region: "ap-south-1", //"us-west-2"
        signatureVersion: "v4",
    });


    const handleChooseCamera = async () => {
        const isCameraPermitted = await requestCameraPermission()
        const isStoragePermitted = await requestExternalWritePermission()
        if (isCameraPermitted && isStoragePermitted) {
            ImagePicker.launchCamera(option, (res) => {
                if (res.didCancel) {

                } else if (res.error) {

                } else if (res.customButton) {

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

    const handleChoosePhoto = async () => {

        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: false,
                quality: 0.3
            },
            (response) => {
                if (response.didCancel) { }
                else {
                    setProfileImageUrl(response.assets[0].uri)
                    uploadImage(Platform.OS === "android" ? ('file://' + response.assets[0].uri) : response.assets[0].uri);
                }
            })
    }


    const uploadImage = async (imageUrl) => {
        setLoadingIndicator(true)
        const profileImage = await uploadImageToStorage(imageUrl);
        // var urlaws = await request();
        // let image_file = await fetch(imageUrl)
        //     .then((r) => r.blob())
        //     .then(
        //         (blobFile) =>
        //             new File([blobFile], uuid, {
        //                 type: 'image/jpg',
        //             }),
        //     );
        setTimeout(async () => {
            // const res = await fetchUploadUrl(urlaws, image_file);
            // let profileImage = res.url.split('?')[0];
            updateUserProfileImage({
                variables: { Id: userId, ProfilePicPath: profileImage }
            })
                .then(() => {

                    setLoadingIndicator(false)
                    setProfileImageUrl(profileImage);
                    setTimeout(async () => {
                        try {
                            await EncryptedStorage.setItem('ProfileImage', profileImage);
                        } catch (e) {

                        }
                    }, 100);
                })
                .catch(() => {
                    setLoadingIndicator(false)
                });
        }, 100);
    }


    useEffect(() => {
        setIsFetch(true);
        let isActive = true;
        setTimeout(async () => {
            let profileImage = await getUserProfileImage();
            setProfileImageUrl(profileImage)
        }, 10);
        return () => {
            isActive = false;
        };
    }, [])

    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressSaveProfile = async () => {
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

            setUpdateLoading(true);

            if (loading) {
                setLoadingIndicator(true)
            }
            console.log('updateUserProfile', { Id: parseInt(userId), name: userName, gender: parseInt(userGender), dob: dobformat, emailId: userEmail, preferredLanguageId: parseInt(userLanguageId), primaryRoleId: parseInt(userRoleId) })
            updateUserProfile({
                variables: { Id: parseInt(userId), name: userName, gender: parseInt(userGender), dob: dobformat, emailId: userEmail, preferredLanguageId: parseInt(userLanguageId), primaryRoleId: parseInt(userRoleId) }
            })
                .then(async (res) => {
                    console.log('res ------------------', res);

                    setUpdateLoading(false);
                    await EncryptedStorage.setItem('userName', userName);

                    await EncryptedStorage.setItem("languageId", userLanguageId);
                    Alert.alert('Success', "Profile updated successfully", [{
                        text: 'OK', onPress: () => {
                            removeIsProfile();
                            navigation.goBack();

                            return;
                        },
                    },
                    ]);
                    // if(languageInfoId !=userLanguageId){
                    //     setHomeFetch(true)
                    //     navigation.navigate('HomeScreen');
                    //    } else {
                    //     navigation.goBack();
                    //    }
                })
                .catch(e => {
                    setUpdateLoading(false);
                    setLoadingIndicator(false)
                    console.log('error ------------------', e.message);
                });
        }
    }
    const GetUserProfileInfo = graphql(GETUSERDETAIL_QUERY)(props => {
        const { error, loading } = props.data;
        console.log(props.data);
        console.log(loading, error, props.data?.getUserProfile, "what is the user Data");

        if (error) {

            setIsFetch(false);

            return <View />;
        }

        if (!loading) {
            // 
            if (props.data?.getUserProfile != undefined) {
                console.log('propspropspropspropspropsprops', props.data.getUserProfile)
                setTimeout(async () => {
                    updateValue(props.data.getUserProfile);
                }, 500);
                return <View />;

            }
            return <View />;
        }
        return <View />;
    });
    const updateValue = async (UserProfile) => {
        setIsFetchRole(false)
        let genderInfo = (UserProfile.GenderId != null) ? ((UserProfile.GenderId == 1) ? 'male' : (UserProfile.GenderId == 2) ? 'female' : 'others') : '';

        setLoadingIndicator(false)
        setIsFetch(false);
        setUserId(UserProfile.UserId);
        setUserName(UserProfile.UserName);
        setUserMobile(UserProfile.MobileNo);
        setUserEmail((UserProfile.Email != null) ? UserProfile.Email : '');
        setUserBirthDate((UserProfile.DOB != null) ? moment(Date.parse(UserProfile.DOB)).format("DD - MMMM - YYYY") : dateOfBirth);
        setUserRole((UserProfile.PrimaryRoleName != null) ? UserProfile.PrimaryRoleName : '');
        setUserRoleId((UserProfile.PrimaryRole != null) ? UserProfile.PrimaryRole : '');
        setUserLanguage((UserProfile.PreferredLanguage != null) ? UserProfile.PreferredLanguage.toString() == "1" ? "English" : UserProfile.PreferredLanguage.toString() == "2" ? "தமிழ்" : UserProfile.PreferredLanguage.toString() == "3" ? "മലയാളം" : "ಕನ್ನಡ" : '');
        setUserLanguageId((UserProfile.PreferredLanguage != null) ? UserProfile.PreferredLanguage : 0);
        setUserGender((UserProfile.GenderId != null) ? UserProfile.GenderId : 0);
        setIsGenderType(genderInfo);
        setDobformat((UserProfile.DOB != null) ? UserProfile.DOB : '')
        // setLoginToken(res.data.updateUserProfile?.token);





    }
    const onPressSelectGender = (type) => {


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

                setUserLanguage(item.language);
                setUserLanguageId(item.languageId);
                console.log(item);
                //   RNRestart.restart();
            },
        })
    }
    const onPressSelectRole = () => {

        setModalVisible(true);
        setIsPopupType('Role')
    }
    const updateLoading = (isloading) => {
        setIsFetchRole(true);
        setLoadingIndicator((isloading == undefined) ? false : isloading);
    }
    const updateDate = (list) => {
        list.map((listInfo) => {
            if (listInfo.Id == userRoleId) {
                setUserRole(listInfo.Name)
            }

        })
        setArrayOfItems(list);
    }
    const handleSelectItem = (item) => {
        setUserRole(item.Name)
        setUserRoleId(item.Id)
        setModalVisible(false);
    }
    const updateValues = (isLoading) => {
        if (isLoading == false) {
            setIsGetLables(false);
        }


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
                                    <TouchableOpacity style={[styles.view_buttonSelect, { marginLeft: 10, }]}
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
                        {/* <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{preferredLanguage}</Text>
                            <TouchableOpacity style={styles.view_box}
                                onPress={onPressSelectLanguage}>
                                <Text style={styles.text_dateOfBirth}>{userLanguage}</Text>
                            </TouchableOpacity>
                        </View> */}
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
                    <Pressable style={[styles.popup_view, { justifyContent: ((isPopupType == 'Role') ? 'center' : 'flex-end'), }]}
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
                    {updateloading ? <ActivityIndicator size="small" color={colors.white_color} /> : <Text style={styles.text_edit}>{saveAddress}</Text>}
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
            {/* {(isGetLables) && (
                <Query query={lableQuery} variables={{ languageId: userLanguageId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateValues(true);
                            return null
                        };
                        if (error) {
                            Alert.alert('Error', error.message, [{
                                text: 'OK', onPress: () => {


                                    return;
                                },
                            },
                            ]);
                            setUpdateLoading(false);
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
            )} */}
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


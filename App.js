/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState, useRef, createContext } from 'react';
import {
  Image,
  StyleSheet,
  View,
  Platform,
  Text,
  Alert,
  Linking,
  Button,
  BackHandler,
  TouchableOpacity
} from 'react-native';
import Root from './src/navigation/routes';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './src/components/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import TabNavigator from './src/screens/TabNavigator';
import { colors, fonts, images } from './src/core';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'


import LanguageListScreen from './src/screens/LanguageListScreen';
import DeliveryAddressScreen from './src/screens/DeliveryAddressScreen';
import AddNewAddressScreen from './src/screens/AddNewAddressScreen';
import AddProductLotScreen from './src/screens/AddProductLotScreen';
import LotAddSuccessScreen from './src/screens/LotAddSuccessScreen';
import ViewLotListScreen from './src/screens/ViewLotListScreen';
import BidsDetailListScreen from './src/screens/BidsDetailListScreen';
import PlaceBitInfoScreen from './src/screens/PlaceBitInfoScreen';
import BidPlacedDetailScreen from './src/screens/BidPlacedDetailScreen';
import SelectStateScreen from './src/screens/SelectStateScreen';
import SelectDistrictScreen from './src/screens/SelectDistrictScreen';
import SelectCityScreen from './src/screens/SelectCityScreen';
import SelectAddressScreen from './src/screens/SelectAddressScreen';
import EditBidsInfoScreen from './src/screens/EditBidsInfoScreen';
import UpdateBidsInfoScreen from './src/screens/UpdateBidsInfoScreen';
import AddNewEnquiryScreen from './src/screens/AddNewEnquiryScreen';
import ProfileDetailScreen from './src/screens/ProfileDetailScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import FarmDetailsScreen from './src/screens/FarmDetailsScreen';
import EnquirySuccessScreen from './src/screens/EnquirySuccessScreen';
import EnquiryListScreen from './src/screens/EnquiryListScreen';
import BidsProductsScreen from './src/screens/BidsProductsScreen';
import ViewLotDetailsScreen from './src/screens/ViewLotDetailsScreen';
import UploadMandiRatesScreen from './src/screens/UploadMandiRatesScreen';
import MandiListDetailScreen from './src/screens/MandiListDetailScreen';
import ViewBidDetailsScreen from './src/screens/ViewBidDetailsScreen';
import UpdateLotInfoScreen from './src/screens/UpdateLotInfoScreen';
import ViewMoreEnquiryListScreen from './src/screens/ViewMoreEnquiryListScreen';
import ViewMoreLotsListScreen from './src/screens/ViewMoreLotsListScreen';
import SellerInfoListScreen from './src/screens/SellerInfoListScreen';
import ViewEnquiryInfoScreen from './src/screens/ViewEnquiryInfoScreen';
import ViewResponseEnquiryScreen from './src/screens/ViewResponseEnquiryScreen';
import UpdateEnquiryScreen from './src/screens/UpdateEnquiryScreen';
import DeleteAccountScreen from './src/screens/DeleteAccountScreen';
import LoginScreen from './src/screens/LoginScreen';
import VersionCheck from 'react-native-version-check';
import Modal from "react-native-modal";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import NotificationScreen from './src/screens/NotificationScreen';
import messaging from '@react-native-firebase/messaging';
import { firebase } from '@react-native-firebase/app';

import { useDispatch } from 'react-redux';
import { getDashboardData } from './src/features/homeview/controller/home_view_controller';
import { storee } from './src/redux/store'
import { Provider } from 'react-redux'

const lableQuery = gql`
query getAppLabels($languageId: ID!) {
    getAppLabels(languageId: $languageId) 
  }
`;

const Stack = createNativeStackNavigator();

export const TasksDispatchContext = createContext(null);
const App = () => {





  const [isLoading, setIsLoading] = useState(true);
  const [loginToken, setLoginToken] = useState('');
  const [getStart, setGetStart] = useState('Get Started');
  const [welcomeText, setWelcomeText] = useState('Welcome to Cropfit');
  const [loginandSignup, setLoginandSignup] = useState('');
  const [continueText, setContinueText] = useState('Continue');
  const [enterPhoneNumebr, setEnterPhoneNumebr] = useState('Enter your mobile number');
  const [enterYourName, setEnterYourName] = useState('Enter your name');
  const [chooseLanguage, setChooseLanguage] = useState('');
  const [locationAlert, setLocationAlert] = useState('');
  const [otpVerification, setOtpVerification] = useState('');
  const [enterOtp, setEnterOtp] = useState('');
  const [didntReceive, setDidntReceive] = useState('');
  const [errorNumer, setErrorNumer] = useState('Please enter your mobile number');
  const [errorName, setErrorName] = useState('Please enter your name');
  const [languageList, setLanguageList] = useState([]);
  const [buySearchPlaceholder, setBuySearchPlaceholder] = useState('Quick search');
  const [deliverAddress, setDeliverAddress] = useState('Delivery Location');
  const [addNewAddress, setAddNewAddress] = useState('Add a New Address');
  const [noAddress, setNoAddress] = useState('No Address Available');
  const [myAddress, setMyAddress] = useState('My Address');
  const [type, setType] = useState('Type');
  const [userState, setUserState] = useState('State');
  const [district, setDistrict] = useState('District');
  const [taluk, setTaluk] = useState('Taluk');
  const [village, setVillage] = useState('Town');
  const [doorNo, setDoorNo] = useState('Door No / Street');
  const [pincode, setPincode] = useState('Pincode');
  const [next, setNext] = useState('Next');
  const [placeholderType, setPlaceholderType] = useState('Please select type');
  const [placeholderState, setPlaceholderState] = useState('Please select State');
  const [placeholderDistrict, setPlaceholderDistrict] = useState('Please select District');
  const [placeholderTaluk, setPlaceholderTaluk] = useState('Please select Taluk');
  const [placeholderTown, setPlaceholderTown] = useState('Please select Town');
  const [placeholderVillage, setPlaceholderVillage] = useState('Please enter village');
  const [placeholderDoorNo, setPlaceholderDoorNo] = useState('Please enter Door No / Street');
  const [placeholderPinCode, setPlaceholderPinCode] = useState('Please enter Pincode');
  const [selectAddress, setSelectAddress] = useState('Please select delivery address');
  const [listMyProduct, setListMyProduct] = useState('List My Product');
  const [gradeText, setGradeText] = useState('Grade');
  const [gradePlaceholder, setGradePlaceholder] = useState('Select Grade');
  const [availableQuality, setAvailableQuality] = useState('Available Quantity');
  const [availableQualityPlaceholder, setAvailableQualityPlaceholdery] = useState('Enter Quantity');
  const [weightPlaceholder, setWeightPlaceholder] = useState('Weight');
  const [acres, setAcres] = useState('Cultivated acres');
  const [acresPlaceholder, setAcresPlaceholder] = useState('Enter Cultivated acres');
  const [productPrice, setProductPrice] = useState('Asking Price');
  const [productPricePlaceholder, setProductPricePlaceholder] = useState('Enter Asking Price');
  const [saveLot, setSaveLot] = useState('Save Lot');
  const [gradeAlert, setGradeAlert] = useState('Please select grade');
  const [quantityAlert, setQuantityAlert] = useState('Please enter Available Quantity');
  const [weightAlert, setWeightAlert] = useState('Please select weight');
  const [acreAlert, setAcreAlert] = useState('Please enter Cultivated acres');
  const [priceAlert, setPriceAlert] = useState('Please enter Asking Price');
  const [successText, setSuccessText] = useState('Success');
  const [successLot, setSuccessLot] = useState('You`ve Successfully added Lot.');
  const [viewLot, setViewLot] = useState('View Lots');
  const [backHome, setBackHome] = useState('Back to Home');
  const [statusText, setStatusText] = useState('Status');
  const [placeBit, setPlaceBit] = useState('Place Bid');
  const [bitsText, setBitsText] = useState('Bid Product');
  const [weightUnitAlert, setWeightUnitAlert] = useState('Please Select Available Quantity Unit');
  const [successBid, setSuccessBid] = useState('You`ve Successfully added Bid.');
  const [requiredQuantity, setRequiredQuantity] = useState('Required Quantity');
  const [bidPrice, setBidPrice] = useState('Bid Price');
  const [bidView, setBidView] = useState('View Bids');
  const [stepText, setStepText] = useState('STEP');
  const [saveAddress, setSaveAddresst] = useState('Save');
  const [villageString, setVillageString] = useState('Village');
  const [bitsTitle, setBitsTitle] = useState('Bids');
  const [editBits, setEditBits] = useState('Edit Bid');
  const [deleteBits, setDeleteBits] = useState('Delete Bid');
  const [enquireText, setEnquireText] = useState('Enquire Now');
  const [buyText, setBuyText] = useState('Buy Now');
  const [sellText, setSellText] = useState('Sell Now');
  const [newEnquriyText, setNewEnquriyText] = useState('New Enquiry');
  const [deliverOn, setDeliverOn] = useState('Deliver On');
  const [placeEnquiry, setPlaceEnquiry] = useState('Place Enquiry');
  const [deliverOnAlert, setDeliverOnAlert] = useState('Please enter deliver on date');
  const [profileText, setProfileText] = useState('Profile');
  const [editProfileText, setEditProfileText] = useState('Edit Profile');
  const [personalInformation, setPersonalInformation] = useState('Personal Information');
  const [locationDetail, setLocationDetail] = useState('Location Details');
  const [farmDetails, setFarmDetails] = useState('Farm Details');
  const [logout, setLogout] = useState('Logout');
  const [nameText, setNameText] = useState('Name');
  const [gender, setGender] = useState('Gender');
  const [dateOfBirth, setDateOfBirth] = useState('Date of Birth');
  const [mobileNumber, setMobileNumber] = useState('Mobile Number');
  const [emailId, setEmailId] = useState('Email Id');
  const [preferredLanguage, setPreferredLanguage] = useState('Preferred Language');
  const [preferredRole, setPreferredRole] = useState('Preferred Role');
  const [nameAlert, setNameAlert] = useState('Please enter your name');
  const [genderAlert, setGenderAlert] = useState('Please select your gender');
  const [dobAlert, setDobAlert] = useState('Please enter your Date of birth');
  const [mobileAlert, setMobileAlert] = useState('Please enter your mobile');
  const [emailAlert, setEmailAlert] = useState('Please enter your email');
  const [languageAlert, setLanguageAlert] = useState('Please select language');
  const [roleAlert, setRoleAlert] = useState('Please select Role');
  const [maleText, setMaleText] = useState('Male');
  const [femaleText, setFemaleText] = useState('Female');
  const [otherText, setOtherText] = useState('Other');
  const [cultivableText, setCultivableText] = useState('Cultivable Land in acres');
  const [irrigationText, setIrrigationText] = useState('Irrigation');
  const [groundWaterText, setGroundWaterText] = useState('Ground water');
  const [sprinklerText, setSprinklerText] = useState('Sprinkler');
  const [borewellText, setBorewellText] = useState('Borewell');
  const [organicText, setOrganicText] = useState('Organic Farm');
  const [toolsText, setToolsText] = useState('Tools Available for Rent');
  const [livestockText, setLivestockText] = useState('Livestock');
  const [expertText, setExpertText] = useState('Expert Advice Needed');
  const [enquirySuccess, setEnquirySuccess] = useState('You`ve Successfully Place Enquiry.');
  const [viewExpert, setViewExpert] = useState('View Enquiry');
  const [myExpert, setMyExpert] = useState('My Enquiry');
  const [alertRequiredQuantity, setAlertRequiredQuantity] = useState('Please enter Required Quantity ');
  const [biddedOn, setBiddedOn] = useState('Bidded on : ');
  const [pickup, setPickup] = useState('PICKUP ADDRESS');
  const [editLot, setEditLot] = useState('Edit Lot');
  const [deleteLotInfo, setDeleteLotInfo] = useState('Delete Lot');
  const [sortBy, setSortBy] = useState('Sort By');
  const [bidPricePlaceholder, setBidPricePlaceholder] = useState('Enter Bid Price');
  const [updateon, setUpdateon] = useState('Updated on');
  const [updateLot, setUpdateLot] = useState('Update Lot');
  const [updateBit, setUpdateBit] = useState('Update Bid');
  const [deleteBidAlert, setDeleteBidAlert] = useState('Are you sure you want to delete Bid?');
  const [deleteLotAlert, setDeleteLotAlert] = useState('Are you sure you want to delete Lot?');
  const [deleteAddressAlert, setDeleteAddresAlert] = useState('Are you sure you want to delete address?');
  const [organic, setOrganic] = useState('Organic');
  const [per, setPer] = useState('Per');
  const [selectRole, setSelectRole] = useState('Please select role');
  const [home, setHome] = useState('Home');
  const [buy, setBuy] = useState('Buy');
  const [sell, setSell] = useState('Sell');
  const [bids, setBids] = useState('Bids');
  const [lots, setLots] = useState('Lots');
  const [watchVideo, setWatchVideo] = useState('Watch Video');
  const [mandiRate, setMandiRate] = useState('Upload Mandi Rates');
  const [profileImage, setProfileImage] = useState('Profile Image');
  const [browseFile, setBrowseFile] = useState('Browse File');
  const [useCamera, setUseCamera] = useState('Use Camera');
  const [locationMandi, setLocationMandi] = useState('Location');
  const [uploaDMandi, setUploaDMandi] = useState('Upload');
  const [mandiRates, setMandiRates] = useState('Mandi Rates');
  const [realmandiRates, setRealmandiRates] = useState('Get real time mandi rates');
  const [languageId, setLanguageId] = useState('1');
  const [languageInfoId, setLanguageInfoId] = useState('1');
  const [quantityText, setQuantityText] = useState('Quantity');
  const [applyText, setApplyText] = useState('Apply');
  const [referenceText, setReferenceText] = useState('Enter Reference Code');
  const [appliedReference, setAppliedReference] = useState('Applied Your Reference Code');
  const [checkQuantityAlert, setCheckQuantityAlert] = useState('Required quantity should be less than or equal to available quantity');
  const [acceptBit, setAcceptBit] = useState('Accept');
  const [declineBit, setDeclineBit] = useState('Decline');
  const [enquiries, setEnquiries] = useState('Enquiries');
  const [sellerList, setSellerList] = useState('Seller List');
  const [lotAddedOn, setLotAddedOn] = useState('Lot added on');
  const [expectedon, setExpectedon] = useState('Expected on');
  const [showInterest, setShowInterest] = useState('Show Interest');
  const [enquiryAddedOn, setEnquiryAddedOn] = useState('Enquiry added on');
  const [viewEnquiries, setViewEnquiries] = useState('View Enquiries');
  const [editEnquiry, setEditEnquiry] = useState('Edit Enquiry');
  const [deleteEnquiryText, setDeleteEnquiryText] = useState('Delete Enquiry');
  const [viewResponses, setViewResponses] = useState('View Responses');
  const [deleteEnquiryAlert, setDeleteEnquiryAlert] = useState('Are you sure you want to delete Enquiry?');
  const [deleteAddress, setDeleteAddress] = useState('Delete');
  const [logoutYes, setLogoutYes] = useState('Yes');
  const [logoutCancel, setLogoutCancel] = useState('Cancel');
  const [noMandi, setNoMandi] = useState('No Mandi Rate is available');
  const [noLods, setNoLods] = useState('No lot created');
  const [noBids, setNoBids] = useState('No bids available');
  const [changeProfile, setChangeProfile] = useState('Change Profile Photo');
  const [isBackOption, setIsBackOption] = useState('no');
  const [checkRate, setCheckRate] = useState('Check Rates');
  const [quickSearch, setQuickSearch] = useState('Quick Search');
  const [buyerText, setBuyerText] = useState('Buyer');
  const [sellerText, setSellerText] = useState('Seller');
  const [viewMore, setViewMore] = useState('View more');
  const [areYouSure, setAreYouSure] = useState('Are you sure you would like to logout your account?');
  const [mandiratesSuccess, setMandiratesSuccess] = useState('Mandi rates are successfully uploaded');
  const [enterLocation, setEnterLocation] = useState('Please enter location');
  const [noEnquiry, setNoEnquiry] = useState('No enquiry available');
  const [enquiryMessage, setEnquiryMessage] = useState('Interest posted successfully, The buyer will call you soon');
  const [updateSuccess, setUpdateSuccess] = useState('Updated Successfully');
  const [termsAndConditions, setTermsAndConditions] = useState('Please accept Terms & Conditions');
  const [helpLine, setHelpLine] = useState('Contact Helpline');
  const [approveErrorMsg, setApproveErrorMsg] = useState('There is shortage of goods, sorry for the inconvenience. Please contact helpline.');
  const [pushDeviceToken, setPushDeviceToken] = useState('');
  const [deleteAccount, setDeleteAccount] = useState('Delete account');
  const [deleteMessage1, setDeleteMessage1] = useState('Are you sure, you want to Delete your account');
  const [deleteMessage2, setDeleteMessage2] = useState('Are you sure, you want to Delete your account');
  const [deleteMessage3, setDeleteMessage3] = useState('Are you sure, you want to Delete your account');
  const [deleteMessage4, setDeleteMessage4] = useState('Are you sure, you want to Delete your account');

  const [isGetLanguageLabel, setIsGetLanguageLabel] = useState(false);
  const [minAmountPerGvtAlert, setMinAmountPerGvtAlert] = useState('Amount should be greater than the MSP value: ');
  const [pickupAddress, setPickupAddress] = useState('Pickup Location');
  const [comingSoon, setComingSoon] = useState('Coming Soon');
  const [areYouSureAccept, setAreYouSureAccept] = useState('Are you sure, you want to Approve?');
  const [areYouSureDecline, setAreYouSureDecline] = useState('Are you sure, you want to Decline?');
  const [enableLogin, setEnableLogin] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false);
  const [forceUpdateDetail, setForceUpdate] = useState(null)
  const [mandiTitle, setMandiTitle] = useState('Title');
  const [share, setShare] = useState('Share');
  const [welcome, setWelcome] = useState('Welcome')
  const [dontHaveAccountText, setNewAccountText] = useState(`Don't have an account!`);
  const [singUpText, setSignUp] = useState('Sign up')
  const [enterMandiTitle, setEnterMandiTitle] = useState('Please enter title')
  const [toastText1, setToastText1] = useState('Hello')
  const [toastText2, setToastText2] = useState('welcome to cropfit')
  const [alreadyRegister, setAlreadyRegister] = useState('Already have an account');
  const [singinText, setSignInText] = useState('Sign In')
  const [isShowLanguage, setIsShowLanguage] = useState(false)
  const [quantityLabel, setQuantityLabel] = useState('Quantity')
  const [notificationTitle, setNotificationTitle] = useState('Notification')
  const [emptyNotification, setEmptyNotification] = useState('No Notification is Available')
  const [notificationLength, setNotificationLength] = useState()
  const [activeNotification, setActiveNotification] = useState(false)
  const [myActivity, setActivity] = useState('My Activity')
  const [bidText, setBidText] = useState('Bid')
  const [enquiryText, setEnquiryText] = useState('Enquiry')
  const [loginLabel, setLoginLabel] = useState('Log In')
  const [lotText, setLotText] = useState('Lot')
  const [userNotExist, setuserNotExist] = useState('User not registered')
  const [homeReload, setHomeFetch] = useState(false)
  const [referralCode, setReferralCode] = useState('Have Referral Code')

  const store = {
    mandiTitle,
    setMandiTitle,
    enableLogin,
    setEnableLogin,
    pushDeviceToken,
    setPushDeviceToken,
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
    enquiryMessage, setEnquiryMessage,
    updateSuccess, setUpdateSuccess,
    termsAndConditions, setTermsAndConditions,
    minAmountPerGvtAlert, setMinAmountPerGvtAlert,
    helpLine, setHelpLine,
    approveErrorMsg, setApproveErrorMsg,
    pickupAddress, setPickupAddress,
    comingSoon, setComingSoon,
    areYouSureAccept, setAreYouSureAccept,
    areYouSureDecline, setAreYouSureDecline,
    deleteAccount, setDeleteAccount,
    deleteMessage1, setDeleteMessage1,
    deleteMessage2, setDeleteMessage2,
    deleteMessage3, setDeleteMessage3,
    deleteMessage4, setDeleteMessage4,
    share, setShare,
    deleteMessage4, setDeleteMessage4,
    welcome, setWelcome,
    dontHaveAccountText, setNewAccountText,
    singUpText, setSignUp,
    enterMandiTitle, setEnterMandiTitle,
    toastText1, setToastText1,
    toastText2, setToastText2,
    alreadyRegister, setAlreadyRegister,
    singinText, setSignInText,
    isShowLanguage, setIsShowLanguage,
    quantityLabel, setQuantityLabel,
    emptyNotification, setEmptyNotification,
    notificationTitle, setNotificationTitle,
    notificationLength, setNotificationLength,
    activeNotification, setActiveNotification,
    myActivity, setActivity,
    bidText, setBidText,
    enquiryText, setEnquiryText,
    loginLabel, setLoginLabel,
    lotText, setLotText,
    userNotExist, setuserNotExist,
    homeReload, setHomeFetch,
    referralCode, setReferralCode,
  };


  useEffect(() => {
    console.log("useEffect");
    checkVersion()
  }, [])

  const checkVersion = async () => {
    try {
      const updateNeeded = await VersionCheck.needUpdate()
      console.log("updateNeeded", updateNeeded)
      if (updateNeeded && updateNeeded?.isNeeded) {
        setModalVisible(true)

        setForceUpdate(updateNeeded)
      }
    } catch (err) {
      console.log(err)
    }
  }


  const handleForceUpdate = async () => {
    if (forceUpdateDetail?.isNeeded) {
      const isSupported = await Linking.canOpenURL(forceUpdateDetail?.storeUrl)
      if (isSupported) {
        BackHandler.exitApp();
        await Linking.openURL(forceUpdateDetail?.storeUrl)
        return;
      }
      return;
    }
    return;
  }
  // const dispatchRedux = useDispatch();
  // useEffect(() => {
  //   dispatchRedux(getDashboardData());
  // }, [])
  const initialLoginState = {
    isLoading: true,
    userToken: null,
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  console.log("what is the login token");
  console.log(loginToken);
  const client = new ApolloClient({
    link: new HttpLink({
      uri: 'http://cropfitindia.org/',
      headers: {
        authorization: loginToken,
      },
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })


  const loginReducer = (prevState, action) => {
    // if (action.type == "REFRESH") {
    //   setLanguage();
    // }

    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          type: 'RETRIEVE_TOKEN',

        };
      case 'LOGIN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          type: 'LOGIN',
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userToken: null,
          isLoading: false,
          type: 'LOGOUT',
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          type: 'REGISTER',
        };
    }
  };


  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
      getFcmToken();
    }
  }


  const getFcmToken = async () => {
    try {
      const fcmToken = await messaging().getToken()
      if (fcmToken) {
        setPushDeviceToken(fcmToken)
        await EncryptedStorage.setItem('pushToken', fcmToken);
        console.log('tokentokentokentokentoken', fcmToken)
      } else {
        console.log("[FCMService] User does not have a devices token")
      }
    } catch (error) {
      console.log("[FCMService] getToken Rejected", error)
    }
  }

  useEffect(() => {
    requestUserPermission()
  }, [])

  useEffect(() => {
    setTimeout(async () => {
      setLanguage();
    }, 2000);

  }, [])
  const setLanguage = async () => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;

    let userToken = '';
    let selectedLanguage = '';
    let LoginTrue;
    try {
      userToken = await EncryptedStorage.getItem("access_token");
    } catch (e) {
      console.log(e);
    }
    try {
      selectedLanguage = await EncryptedStorage.getItem("languageId");
    } catch (e) {
      console.log(e);
    }
    console.log('userTokenuserTokenuserToken', userToken);
    console.log('selectedLanguageselectedLanguageselectedLanguageselectedLanguage', selectedLanguage);
    setLoginToken(userToken);
    // if ((userToken !== null) && (userToken !== undefined)) {
    // }
    if (selectedLanguage === (Platform.OS === 'ios' ? undefined : null)) {
      setLanguageInfoId('1');
      setIsGetLanguageLabel(true);
    }
    else {
      setLanguageInfoId(selectedLanguage);
      setIsGetLanguageLabel(true);
    }
    setIsLoading(false);
  }

  const updateValues = () => {
    setIsGetLanguageLabel(false);
  }
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image style={styles.logo_image}
          source={images.CROPFITWHITELOGO} />
      </View>
    );
  }
  const updateLableText = (data) => {
    console.log('data ---------------------------', data.getAppLabels);
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

    setNoMandi(personalDetailsScreenLabels.NoMandiRates)
    setDeleteAddress(locationScreenLabels.DeleteAddress)
    setLogoutYes(locationScreenLabels.YesButton)
    setLogoutCancel(locationScreenLabels.CancelButton)
    setNoLods(sellScreenLabels.NoLot)
    setNoBids(buyScreenLabels.NoBids)

    setWatchVideo(dashboardScreenLabels.WatchVideo)
    setSellerText(dashboardScreenLabels.Seller)
    setWelcome(dashboardScreenLabels.WelcomeText)
    setEmptyNotification(dashboardScreenLabels.NotificationNotAvailableLabel)
    setNotificationTitle(dashboardScreenLabels.NotificationLabel)
    setActivity(dashboardScreenLabels.MyActivityLabel)
    setEnquiryText(dashboardScreenLabels.EnquiryLabel)

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
    setAlreadyRegister(loginScreenLabels.AlreadyhasAccount)
    setSignInText(loginScreenLabels.SignIn)
    setNewAccountText(loginScreenLabels.NoAccountText)
    setSignUp(loginScreenLabels.SignUpAlone)
    setLoginLabel(loginScreenLabels.LogIn)
    setuserNotExist(loginScreenLabels.UserNotRegistered)

    setSortBy(sortScreenLabels.Sortby)

    setProfileText(profileScreenLabels.Profile)
    setEditProfileText(profileScreenLabels.EditProfile)
    setPersonalInformation(profileScreenLabels.PersonalInfo)
    setLocationDetail(profileScreenLabels.LocationDetails)
    setFarmDetails(profileScreenLabels.FarmDetails)
    setLogout(profileScreenLabels.Logout)
    setNext(profileScreenLabels.Next)
    setHelpLine(profileScreenLabels.HelpLine)
    setMandiTitle(profileScreenLabels.Title)
    setEnterMandiTitle(profileScreenLabels.TitleMandatory)

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
    setComingSoon(sellScreenLabels.NoCategory)
    setLotText(sellScreenLabels.Lots)
    // setShare()

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
    setMinAmountPerGvtAlert(sellScreenLabels.MSPValidationMessage)
    setPickupAddress(sellScreenLabels.PickupLocation)

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

  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#008000' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 14
        }}
      />
    ),

    error: (props) => (
      <ErrorToast
        style={{ borderLeftColor: '#FF0000' }}
        {...props}
        text1Style={{
          fontSize: 16
        }}
        text2Style={{
          fontSize: 14
        }}
      />
    ),
    toastPopup: ({ text1, text2, onPress }) => (

      <View style={[styles.toastBox, { borderLeftColor: '#008000', width: '90%', backgroundColor: colors.white_color, borderRadius: 7 }]}>
        <TouchableOpacity onPress={onPress} style={{ flex: 1, flexDirection: "row", alignItems: "center", padding: 10 }}>
          <View>
            <Image style={{ width: 37, height: 50, }}
              source={images.CROPFITBLACKLOGO}>
            </Image>
          </View>
          <View style={{ paddingHorizontal: 10, width: '90%' }}>
            <Text style={{ fontSize: 17 }}>{text1}</Text>
            <View >
              <Text style={{ fontSize: 15 }}>{text2}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  };
  return (
    <Provider store={storee}>
      <ApolloProvider client={client}>
        <AuthContext.Provider value={store} >
          <TasksDispatchContext.Provider value={dispatch}>
            {!isModalVisible ? <NavigationContainer
              onStateChange={(state) => {
                if (!state) return;

              }}>
              {(loginToken !== (Platform.OS === 'ios' ? undefined : null) && loginToken !== '') ?
                <Stack.Navigator>
                  <Stack.Screen
                    name="TabNavigator"
                    component={TabNavigator}
                    options={{ headerShown: false, gestureEnabled: false }}
                  />
                  <Stack.Screen
                    name="LanguageListScreen"
                    component={LanguageListScreen}
                    options={{
                      headerShown: false,
                      presentation: 'transparentModal',
                    }}
                  />
                  <Stack.Screen
                    name="DeliveryAddressScreen"
                    component={DeliveryAddressScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="AddNewAddressScreen"
                    component={AddNewAddressScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="AddProductLotScreen"
                    component={AddProductLotScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="LotAddSuccessScreen"
                    component={LotAddSuccessScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewLotListScreen"
                    component={ViewLotListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="BidsDetailListScreen"
                    component={BidsDetailListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="PlaceBitInfoScreen"
                    component={PlaceBitInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="BidPlacedDetailScreen"
                    component={BidPlacedDetailScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SelectStateScreen"
                    component={SelectStateScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SelectDistrictScreen"
                    component={SelectDistrictScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SelectCityScreen"
                    component={SelectCityScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SelectAddressScreen"
                    component={SelectAddressScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="EditBidsInfoScreen"
                    component={EditBidsInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="UpdateBidsInfoScreen"
                    component={UpdateBidsInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="AddNewEnquiryScreen"
                    component={AddNewEnquiryScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ProfileDetailScreen"
                    component={ProfileDetailScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="PersonalInfoScreen"
                    component={PersonalInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="FarmDetailsScreen"
                    component={FarmDetailsScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="EnquirySuccessScreen"
                    component={EnquirySuccessScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="EnquiryListScreen"
                    component={EnquiryListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="BidsProductsScreen"
                    component={BidsProductsScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewLotDetailsScreen"
                    component={ViewLotDetailsScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="UploadMandiRatesScreen"
                    component={UploadMandiRatesScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="MandiListDetailScreen"
                    component={MandiListDetailScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewBidDetailsScreen"
                    component={ViewBidDetailsScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="UpdateLotInfoScreen"
                    component={UpdateLotInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewMoreEnquiryListScreen"
                    component={ViewMoreEnquiryListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewMoreLotsListScreen"
                    component={ViewMoreLotsListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="SellerInfoListScreen"
                    component={SellerInfoListScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewEnquiryInfoScreen"
                    component={ViewEnquiryInfoScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="ViewResponseEnquiryScreen"
                    component={ViewResponseEnquiryScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="UpdateEnquiryScreen"
                    component={UpdateEnquiryScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="DeleteAccountScreen"
                    component={DeleteAccountScreen}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name='NotificationScreen'
                    component={NotificationScreen}
                    options={{
                      headerShown: false
                    }}
                  />
                </Stack.Navigator>
                : <Root />
              }
              {(isGetLanguageLabel) && (
                <Query query={lableQuery} variables={{ languageId: languageInfoId }}>
                  {({ loading, error, data }) => {
                    if (loading) {
                      () =>
                        updateValues();
                      return null
                    };
                    if (error) {
                      updateValues();
                      return null;
                    }
                    if (!data) {
                      updateValues();
                      return null;
                    }
                    updateLableText(data);
                    return null;
                  }}
                </Query>
              )}
              <Toast config={toastConfig} />
            </NavigationContainer> :
              // Show Force Updating Modal for Update new App Version is available!
              <View style={styles.containerModal}>
                <Modal
                  isVisible={isModalVisible}
                  slideInUp
                  // propagateSwipe
                  style={styles.modalContainer}
                  backdropColor="#000"
                  backdropOpacity={0.5}
                >
                  <View style={styles.modalContent}>
                    <View>
                      <Text style={{ fontFamily: fonts.MONTSERRAT_REGULAR, fontSize: 16 }}>
                        {`New App Version ${forceUpdateDetail?.latestVersion} Available`}</Text>
                    </View>
                    <View style={{ paddingVertical: 10 }}>
                      <TouchableOpacity
                        onPress={() => handleForceUpdate()}
                        style={{ backgroundColor: '#339933', padding: 13, borderRadius: 5, alignItems: "center" }}
                      >
                        <Text
                          style={{ fontFamily: fonts.MONTSERRAT_REGULAR, fontSize: 16, color: "#fff" }}
                        >{`Update Now`}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              </View>
            }
          </TasksDispatchContext.Provider>
        </AuthContext.Provider>
      </ApolloProvider>
    </Provider>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.landing_background,
  },
  logo_image: {
    width: 100,
    height: 126,
  },
  containerModal: {
    flex: 1,
    width: '90%',
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: '90%',
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
  },
  toastBox: {
    borderLeftWidth: 5,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default App;

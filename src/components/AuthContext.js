import { createContext, useState, } from 'react';

const initAuthContext = {
    languageId: '',
    setLanguageId: () => { },
    loginToken: true,
    setLoginToken: () => { },
    getStart: '',
    setGetStart: () => { },
    loginToken: '',
    setLoginToken: () => { },
    welcomeText: '',
    setWelcomeText: () => { },
    loginandSignup: '',
    setLoginandSignup: () => { },
    continueText: '',
    setContinueText: () => { },
    enterPhoneNumebr: '',
    setEnterPhoneNumebr: () => { },
    enterYourName: '',
    setEnterYourName: () => { },
    enterYourName: '',
    setEnterYourName: () => { },
    chooseLanguage: '',
    setChooseLanguage: () => { },
    locationAlert: '',
    setLocationAlert: () => { },
    otpVerification: '',
    setOtpVerification: () => { },
    enterOtp: '',
    setEnterOtp: () => { },
    didntReceive: '',
    setDidntReceive: () => { },
    errorNumer: '',
    setErrorNumer: () => { },
    errorName: '',
    setErrorName: () => { },
    languageList: [],
    setLanguageList: () => { },
    buySearchPlaceholder: '',
    setBuySearchPlaceholder: () => { },
    deliverAddress: '',
    setDeliverAddress: () => { },
    addNewAddress: '',
    setAddNewAddress: () => { },
    noAddress: '',
    setNoAddress: () => { },
    myAddress: '',
    setMyAddress: () => { },
    type: '',
    setType: () => { },
    userState: '',
    setUserState: () => { },
    district: '',
    setDistrict: () => { },
    taluk: '',
    setTaluk: () => { },
    village: '',
    setVillage: () => { },
    doorNo: '',
    setDoorNo: () => { },
    pincode: '',
    setPincode: () => { },
    next: '',
    setNext: () => { },
    placeholderType: '',
    setPlaceholderType: () => { },
    placeholderState: '',
    setPlaceholderState: () => { },
    placeholderDistrict: '',
    setPlaceholderDistrict: () => { },
    placeholderTaluk: '',
    setPlaceholderTaluk: () => { },
    placeholderTown: '',
    setPlaceholderTown: () => { },
    placeholderVillage: '',
    setPlaceholderVillage: () => { },
    placeholderDoorNo: '',
    setPlaceholderDoorNo: () => { },
    placeholderPinCode: '',
    setPlaceholderPinCode: () => { },
    selectAddress: '',
    setSelectAddress: () => { },
    listMyProduct: '',
    setListMyProduct: () => { },
    gradeText: '',
    setGradeText: () => { },
    gradePlaceholder: '',
    setGradePlaceholder: () => { },
    availableQuality: '',
    setAvailableQuality: () => { },
    availableQualityPlaceholder: '',
    setAvailableQualityPlaceholdery: () => { },
    weightPlaceholder: '',
    setWeightPlaceholder: () => { },
    acres: '',
    setAcres: () => { },
    acresPlaceholder: '',
    setAcresPlaceholder: () => { },
    productPrice: '',
    setProductPrice: () => { },
    productPricePlaceholder: '',
    setProductPricePlaceholder: () => { },
    saveLot: '',
    setSaveLot: () => { },
    gradeAlert: '',
    setGradeAlert: () => { },
    quantityAlert: '',
    setQuantityAlert: () => { },
    weightAlert: '',
    setWeightAlert: () => { },
    acreAlert: '',
    setAcreAlert: () => { },
    priceAlert: '',
    setPriceAlert: () => { },
    successText: '',
    setSuccessText: () => { },
    successLot: '',
    setSuccessLot: () => { },
    viewLot: '',
    setViewLot: () => { },
    backHome: '',
    setBackHome: () => { },
    statusText: '',
    setStatusText: () => { },
    placeBit: '',
    setPlaceBit: () => { },
    bitsText: '',
    setBitsText: () => { },
    weightUnitAlert: '',
    setWeightUnitAlert: () => { },
    successBid: '',
    setSuccessBid: () => { },
    requiredQuantity: '',
    setRequiredQuantity: () => { },
    bidPrice: '',
    setBidPrice: () => { },
    bidView: '',
    setBidView: () => { },
    stepText: '',
    setStepText: () => { },
    saveAddress: '',
    setSaveAddresst: () => { },
    villageString: '',
    setVillageString: () => { },
    bitsTitle: '',
    setBitsTitle: () => { },
    editBits: '',
    setEditBits: () => { },
    deleteBits: '',
    setDeleteBits: () => { },
    enquireText: '',
    setEnquireText: () => { },
    buyText: '',
    setBuyText: () => { },
    sellText: '',
    setSellText: () => { },
    newEnquriyText: '',
    setNewEnquriyText: () => { },
    deliverOn: '',
    setDeliverOn: () => { },
    placeEnquiry: '',
    setPlaceEnquiry: () => { },
    deliverOnAlert: '',
    setDeliverOnAlert: () => { },
    profileText: '',
    setProfileText: () => { },
    editProfileText: '',
    setEditProfileText: () => { },
    personalInformation: '',
    setPersonalInformation: () => { },
    locationDetail: '',
    setLocationDetail: () => { },
    farmDetails: '',
    setFarmDetails: () => { },
    logout: '',
    setLogout: () => { },
    nameText: '',
    setNameText: () => { },
    gender: '',
    setGender: () => { },
    dateOfBirth: '',
    setDateOfBirth: () => { },
    mobileNumber: '',
    setMobileNumber: () => { },
    emailId: '',
    setEmailId: () => { },
    preferredLanguage: '',
    setPreferredLanguage: () => { },
    preferredRole: '',
    setpreferredRole: () => { },

    nameAlert: '',
    setNameAlert: () => { },
    genderAlert: '',
    setGenderAlert: () => { },
    dobAlert: '',
    setDobAlert: () => { },
    mobileAlert: '',
    setMobileAlert: () => { },
    emailAlert: '',
    setEmailAlert: () => { },
    languageAlert: '',
    setLanguageAlert: () => { },
    roleAlert: '',
    setRoleAlert: () => { },
    maleText: '',
    setMaleText: () => { },
    femaleText: '',
    setFemaleText: () => { },
    otherText: '',
    setOtherText: () => { },
    cultivableText: '',
    setCultivableText: () => { },
    irrigationText: '',
    setIrrigationText: () => { },
    groundWaterText: '',
    setGroundWaterText: () => { },
    sprinklerText: '',
    setSprinklerText: () => { },
    borewellText: '',
    setBorewellText: () => { },
    organicText: '',
    setOrganicText: () => { },
    toolsText: '',
    setToolsText: () => { },
    livestockText: '',
    setLivestockText: () => { },
    expertText: '',
    setExpertText: () => { },
    enquirySuccess: '',
    setEnquirySuccess: () => { },
    viewExpert: '',
    setViewExpert: () => { },
    myExpert: '',
    setMyExpert: () => { },
    alertRequiredQuantity: '',
    setAlertRequiredQuantity: () => { },
    biddedOn: '',
    setBiddedOn: () => { },
    pickup: '',
    setPickup: () => { },
    editLot: '',
    setEditLot: () => { },
    deleteLotInfo: '',
    setDeleteLotInfo: () => { },
    sortBy: '',
    setSortBy: () => { },
    bidPricePlaceholder: '',
    setBidPricePlaceholder: () => { },
    updateon: '',
    setUpdateon: () => { },
    updateLot: '',
    setUpdateLot: () => { },
    updateBit: '',
    setUpdateBit: () => { },
    deleteBidAlert: '',
    setDeleteBidAlert: () => { },
    deleteLotAlert: '',
    setDeleteLotAlert: () => { },
    deleteAddressAlert: '',
    setDeleteAddresAlert: () => { },
    organic: '',
    setOrganic: () => { },
    per: '',
    setPer: () => { },
    selectRole: '',
    setSelectRole: () => { },

    home: '',
    setHome: () => { },
    buy: '',
    setBuy: () => { },
    sell: '',
    setSell: () => { },
    bids: '',
    setBids: () => { },
    lots: '',
    setLots: () => { },
    watchVideo: '',
    setWatchVideo: () => { },
    mandiRate: '',
    setMandiRate: () => { },
    profileImage: '',
    setProfileImage: () => { },

    browseFile: '',
    setBrowseFile: () => { },
    useCamera: '',
    setUseCamera: () => { },
    locationMandi: '',
    setLocationMandi: () => { },
    uploaDMandi: '',
    setUploaDMandi: () => { },
    mandiRates: '',
    setMandiRates: () => { },
    realmandiRates: '',
    setRealmandiRates: () => { },
    languageInfoId: '',
    setLanguageInfoId: () => { },
    quantityText: '',
    setQuantityText: () => { },
    applyText: '',
    setApplyText: () => { },
    referenceText: '',
    setReferenceText: () => { },
    appliedReference: '',
    setAppliedReference: () => { },
    checkQuantityAlert: '',
    setCheckQuantityAlert: () => { },
    acceptBit: '',
    setAcceptBit: () => { },
    declineBit: '',
    setDeclineBit: () => { },
    enquiries: '',
    setEnquiries: () => { },
    sellerList: '',
    setSellerList: () => { },
    lotAddedOn: '',
    setLotAddedOn: () => { },
    expectedon: '',
    setExpectedon: () => { },
    showInterest: '',
    setShowInterest: () => { },
    enquiryAddedOn: '',
    setEnquiryAddedOn: () => { },
    viewEnquiries: '',
    setViewEnquiries: () => { },
    editEnquiry: '',
    setEditEnquiry: () => { },
    deleteEnquiryText: '',
    setDeleteEnquiryText: () => { },
    viewResponses: '',
    setViewResponses: () => { },
    deleteEnquiryAlert: '',
    setDeleteEnquiryAlert: () => { },
    deleteAddress: '',
    setDeleteAddress: () => { },
    logoutYes: '',
    setLogoutYes: () => { },
    logoutCancel: '',
    setLogoutCancel: () => { },
    noMandi: '',
    setNoMandi: () => { },
    noLods: '',
    setNoLods: () => { },
    noBids: '',
    setNoBids: () => { },
    changeProfile: '',
    setChangeProfile: () => { },
    isBackOption: '',
    setIsBackOption: () => { },

    checkRate: '',
    setCheckRate: () => { },
    quickSearch: '',
    setQuickSearch: () => { },
    buyerText: '',
    setBuyerText: () => { },
    sellerText: '',
    setSellerText: () => { },
    viewMore: '',
    setViewMore: () => { },
    areYouSure: '',
    setAreYouSure: () => { },
    mandiratesSuccess: '',
    setMandiratesSuccess: () => { },
    enterLocation: '',
    setEnterLocation: () => { },
    noEnquiry: '',
    setNoEnquiry: () => { },
    enquiryMessage: '',
    setEnquiryMessage: () => { },
    updateSuccess: '',
    setUpdateSuccess: () => { },
    termsAndConditions: '',
    setTermsAndConditions: () => { },
     minAmountPerGvtAlert: '',
    setMinAmountPerGvtAlert: () => { },
    helpLine: '',
    setHelpLine: () => { },
    approveErrorMsg: '',
    setApproveErrorMsg: () => { },
    pickupAddress: '',
    setPickupAddress: () => { },
    comingSoon:'',
    setComingSoon: () => { },
    areYouSureAccept: '',
    setAreYouSureAccept: () => { },
    areYouSureDecline: '',
    setAreYouSureDecline: () => { },
    pushDeviceToken: '',
    setPushDeviceToken: () => { },

    deleteAccount: '',
    setDeleteAccount: () => { },
    deleteMessage1: '',
    setDeleteMessage1: () => { },
    deleteMessage2: '',
    setDeleteMessage2: () => { },
    deleteMessage3: '',
    setDeleteMessage3: () => { },
    deleteMessage4: '',
    setDeleteMessage4: () => { },
    enableLogin : false,
    setEnableLogin : () => {},
    share : '',
    setShare : () => {}
};


export const AuthContext = createContext({ initAuthContext });

const AuthProvider = ({ children }) => {

    const [pushDeviceToken, setPushDeviceToken] = useState('');
    const [languageId, setLanguageId] = useState('1');
    const [isLoading, setIsLoading] = useState(true);
    const [loginToken, setLoginToken] = useState('');
    const [getStart, setGetStart] = useState('Get Started');
    const [welcomeText, setWelcomeText] = useState('Welcome to Cropfit');
    const [loginandSignup, setLoginandSignup] = useState('');
    const [continueText, setContinueText] = useState('');
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
    const [buySearchPlaceholder, setBuySearchPlaceholder] = useState('');
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
    const [weightUnitAlert, setWeightUnitAlert] = useState('Please Select Available QuantityUnit');
    const [acreAlert, setAcreAlert] = useState('Please enter Cultivated acres');
    const [priceAlert, setPriceAlert] = useState('Please enter Asking Price');
    const [successText, setSuccessText] = useState('Success');
    const [successLot, setSuccessLot] = useState('You`ve Successfully added Lot.');
    const [viewLot, setViewLot] = useState('View Lot');
    const [backHome, setBackHome] = useState('Back to Home');
    const [statusText, setStatusText] = useState('Status');
    const [placeBit, setPlaceBit] = useState('Place Bid');
    const [bitsText, setBitsText] = useState('Bid Product');
    const [successBid, setSuccessBid] = useState('You`ve Successfully added Bid.');
    const [requiredQuantity, setRequiredQuantity] = useState('Required Quantity');
    const [bidPrice, setBidPrice] = useState('Bid Price');
    const [bidView, setBidView] = useState('View Bid');
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
    const [lotAddedOn, setLotAddedOn] = useState('Lot added on:');
    const [expectedon, setExpectedon] = useState('Expected on');
    const [showInterest, setShowInterest] = useState('Show Interest');
    const [enquiryAddedOn, setEnquiryAddedOn] = useState('Enquiry added on:');
    const [viewEnquiries, setViewEnquiries] = useState('View Enquiries');
    const [editEnquiry, setEditEnquiry] = useState('Edit Enquiry');
    const [deleteEnquiryText, setDeleteEnquiryText] = useState('Delete Enquiry');
    const [viewResponses, setViewResponses] = useState('View Responses');
    const [deleteEnquiryAlert, setDeleteEnquiryAlert] = useState('Are you sure you want to delete Enquiry?');
    const [noMandi, setNoMandi] = useState('No Mandi Rate is available');

    const [deleteAddress, setDeleteAddress] = useState('Delete');
    const [logoutYes, setLogoutYes] = useState('Yes');
    const [logoutCancel, setLogoutCancel] = useState('Cancel');
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
    const [minAmountPerGvtAlert, setMinAmountPerGvtAlert] = useState('Amount should be greater than the MSP value: ');
    const [helpLine, setHelpLine] = useState('Contact Helpline');
    const [approveErrorMsg, setApproveErrorMsg] = useState('There is shortage of goods, sorry for the inconvenience. Please contact helpline.');
    const [pickupAddress, setPickupAddress] = useState('Pickup Location');
    const [comingSoon, setComingSoon] = useState('Coming Soon');
    const [areYouSureAccept, setAreYouSureAccept] = useState('Are you sure, you want to Accept?');
    const [areYouSureDecline, setAreYouSureDecline] = useState('Are you sure, you want to Decline?');
    const [deleteAccount, setDeleteAccount] = useState('Delete account');
    const [deleteMessage1, setDeleteMessage1] = useState('Are you sure, you want to Delete your account');
    const [deleteMessage2, setDeleteMessage2] = useState('Are you sure, you want to Delete your account');
    const [deleteMessage3, setDeleteMessage3] = useState('Are you sure, you want to Delete your account');
    const [deleteMessage4, setDeleteMessage4] = useState('Are you sure, you want to Delete your account');
    const [share, setShare] = useState('Share');

    const authContext = {
        ...initAuthContext,
        languageId,
        setLanguageId,
        isLoading,
        setIsLoading,
        loginToken,
        setLoginToken,
        loginToken,
        setLoginToken,
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
        weightUnitAlert,
        setWeightUnitAlert,
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
        pickup,
        setPickup,
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
        enquiryMessage, 
        setEnquiryMessage,
        updateSuccess, setUpdateSuccess,
        termsAndConditions, setTermsAndConditions,
        minAmountPerGvtAlert, setMinAmountPerGvtAlert,
        helpLine, setHelpLine,
        approveErrorMsg, setApproveErrorMsg,
        pickupAddress, setPickupAddress,
        comingSoon, setComingSoon,
        areYouSureAccept, setAreYouSureAccept,
        areYouSureDecline, setAreYouSureDecline,
        pushDeviceToken, setPushDeviceToken,
        deleteAccount, setDeleteAccount,
        deleteMessage1, setDeleteMessage1,
        deleteMessage2, setDeleteMessage2,
        deleteMessage3, setDeleteMessage3,
        deleteMessage4, setDeleteMessage4,
        share, setShare,
    };

    return (
        <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;

import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppState, Image, ImageBackground, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/AuthContext';
import HeaderComponents from '../../../components/HeaderComponents';
import { colors, images } from '../../../core';

import { graphql } from 'react-apollo';

import LinearGradient from 'react-native-linear-gradient';

import { useMutation } from '@apollo/react-hooks';
import messaging from '@react-native-firebase/messaging';
import EncryptedStorage from 'react-native-encrypted-storage';
import Toast from 'react-native-toast-message';
import { getUserName } from '../../../helpers/AppManager';
import { sendDataToServer } from '../../../helpers/QueryFetching';
import { USERINFORMATIONLOG_QUERY } from '../../../helpers/Schema';
import BannerComponent from '../components/banner_component';
import { GET_ENQUIRY_QUERY, HOMEPAGEDETAIL_QUERY } from '../query/home_screen_query';
import styles from '../style/home_screen_style';





const HomeScreen = ({ navigation, route }) => {
    const {
        watchVideo,
        enquiries,
        lots,
        mandiRates,
        realmandiRates,
        checkRate,
        viewMore,
        sellerText,
        mandiRate,
        welcome,
        myActivity,
        bidText,
        enquiryText,

        lotText,
        homeReload,
        setHomeFetch,
    } = useContext(AuthContext);
    const appState = useRef(AppState.currentState);
    const [loading, setLoading] = React.useState(false);
    const [isFetch, setIsFetch] = React.useState(false);

    const [userName, setUserName] = useState('');
    const [notification, setNotification] = useState()
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const [state, setState] = React.useState({
        listOfCropfit: [],
        listOfLots: [],
        listOfEnquiry: [],
        listOfAdvertisements: [],
        listOfVideos: [],
        listOfCropfitClinic: [],
        message: '',
        applink: '',

    });
    const [enquiryDetail, { }] = useMutation(GET_ENQUIRY_QUERY);
    const { uploadData: handleUserInfromation, loading: userInformationLoading, error: userInformationError, data: userInformationData } = sendDataToServer(USERINFORMATIONLOG_QUERY)

    useEffect(() => {
        getName()
    }, [userName])


    useEffect(() => {
        if (homeReload) {
            EncryptedStorage.setItem('reloadBuy', "true");
            EncryptedStorage.setItem('reloadSell', "true");
            setLoading(true);
            setIsFetch(true)
        }
    }, [homeReload])


    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                setIsFetch(true)
                // setBackgroundFetch(true)
                console.log('App has come to the foreground- homescreen!');
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        userEntryCounts().then(({ data }) => {
            console.log("userInformationLog", data)
        }).catch(err => console.log(err))
    }, [])

    const userEntryCounts = async () => {
        return await handleUserInfromation({ variables: {} })
    }


    useEffect(() => {
        if (notification) {
            showToast('toastPopup', notification.notification.title, notification.notification.body, handleToastClick)
        }

    }, [notification])

    const getName = () => {
        setTimeout(async () => {
            let name = await getUserName()
            console.log(name);
            setUserName(name)
        }, 200);
    }
    //-------------------Notification listener------------
    onNotificationListeners = () => {
        // //--------------------foreground notification msg----------------
        messaging().onMessage(remoteMessage => {
            setNotification(remoteMessage);
        });
    }
    useFocusEffect(
        React.useCallback(() => {
            setIsFetch(true);
            let isActive = true;
            setTimeout(async () => {
                let name = await getUserName()
                setUserName(name)
            }, 200)
            return () => {
                isActive = false;
            };
        }, [])

    );

    const handleToastClick = () => {
        Toast.hide()
        if (notification) {
            navigationDetail(notification.data)
        }
    }
    const showToast = (type, text1, text2, handleToastClick) => {

        Toast.show({
            type,
            text1,
            text2,
            onPress: handleToastClick
        });
    }
    //----------------navigate the page while click the notification-----------
    navigationDetail = async (data) => {
        if (data?.redirectPage == 'lotDetail') {
            navigation.navigate('ViewLotDetailsScreen', { lotId: data?.notificationId, updateNotificationId: data.id, notificationViewed: true });
        } else if (data?.redirectPage == 'enquiryDetail') {
            const item = await enquiryDetail({ variables: { id: data?.notificationId } })
            if (item && item.data && item.data.getenquiriesById && item.data.getenquiriesById.length > 0) {
                console.log("enquiry", data);
                navigation.navigate('ViewResponseEnquiryScreen', { details: item.data.getenquiriesById[0], updateNotificationId: data.id, notificationViewed: true })
            }
        }
    }
    useEffect(() => {
        //  setTimeout(async () => {
        onNotificationListeners();
        //  },3000)

        setState({
            ...state,
            listOfCropfit: [],
            listOfLots: [],
            listOfEnquiry: [],
            listOfAdvertisements: [],
            listOfCropfitClinic: [],
        });
        setIsFetch(true);
        setLoading(true);
    }, [])


    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        console.log("profileScreen");
        navigation.navigate('ProfileDetailScreen')
    }
    const updateValue = (homeDetailList) => {

        setLoading(false)
        setIsFetch(false);
        setHomeFetch(false)
        console.log('homeDetailList.CropfithomeDetailList.Cropfit', homeDetailList)
        setState({
            ...state,
            listOfCropfit: homeDetailList.getDashboardData.Cropfit,
            listOfLots: homeDetailList.getDashboardData.Lots,
            listOfEnquiry: homeDetailList.getDashboardData.Enquiry,
            listOfAdvertisements: homeDetailList.getDashboardData.Advertisements,
            listOfVideos: homeDetailList.getDashboardData.Videos,
            listOfCropfitClinic: homeDetailList.getDashboardData.CropfitClinic,
            message: homeDetailList.getReferalCode.MessageContent,
            applink: homeDetailList.getReferalCode.ApplicationUrl,
        });
        setTimeout(async () => {
            try {
                if (homeDetailList.getDashboardData.HelpLine && homeDetailList.getDashboardData.HelpLine.length > 0
                    && homeDetailList.getDashboardData.HelpLine[0].ContactDetails) {
                    await EncryptedStorage.setItem('helpLineNumber', homeDetailList.getDashboardData.HelpLine[0].ContactDetails);
                }

            } catch (e) {
                console.log('error ---------------', e)
            }
        }, 100);
    }
    const GetHomeDetailComponent = graphql(HOMEPAGEDETAIL_QUERY)(props => {
        const { error, data, loading } = props.data;
        if (error) {
            setIsFetch(false);
            { console.log('errorerrorerror', error) }
            return <View />;
        }
        if (!loading) {
            if (props.data?.getDashboardData != undefined) {
                setTimeout(async () => {
                    updateValue(props.data);
                }, 500);
                return <View />;

            }
            return <View />;
        }
        return <View />;
    });

    const onPressMondiDetail = () => {
        navigation.navigate('MandiListDetailScreen')
    }
    const onPressUploadMondi = () => {
        navigation.navigate('UploadMandiRatesScreen');
    }
    const onPressOpenWeb = (urslString) => {
        Linking.openURL(urslString);
    }


    const LocalImageSize = ({ uri, desiredHeight }) => {
        const [desiredWeight, setDesiredWeight] = React.useState(0)
        Image.getSize(uri, (width, height) => {
            setDesiredWeight(desiredHeight / height * width)
        })
        return (
            <Image
                source={images.BANNERREFERFRIEND}
                style={{
                    marginLeft: 20,
                    marginBottom: 5,
                    height: desiredHeight,
                    width: desiredWeight,
                }}
            />
        )
    }
    const RemoteBidsImage = ({ uri, desiredHeight }) => {
        const [desiredWeight, setDesiredWeight] = React.useState(0)
        Image.getSize(uri, (width, height) => {
            setDesiredWeight(desiredHeight / height * width)
        })
        return (
            <Image
                source={{ uri }}
                style={{
                    height: desiredHeight,
                    width: desiredWeight,
                }}
            />
        )
    }
    const onPressViewMoreLots = () => {
        navigation.navigate('ViewMoreLotsListScreen')
    }
    const onPressViewMoreEnquiries = () => {
        navigation.navigate('ViewMoreEnquiryListScreen')
    }
    const ResizeImage = ({ uri, desiredHeight }) => {
        const [desiredWeight, setDesiredWeight] = React.useState(0)
        Image.getSize(uri, (width, height) => {
            setDesiredWeight(desiredHeight / height * width)
        })
        return (
            <Image
                source={{ uri }}
                style={{
                    backgroundColor: 'transparent',
                    height: desiredHeight,
                    width: desiredWeight,
                }}
            />
        )
    }
    const onPressLotDetails = (item) => {
        navigation.navigate('SellerInfoListScreen', { details: item })
    }
    const onPressEnquiryDetails = (item) => {
        navigation.navigate('ViewEnquiryInfoScreen', { details: item })
    }
    const onPressMakeCall = (mobileNumber) => {
        if (mobileNumber != '') {
            Linking.openURL(`tel:${mobileNumber}`)
        }
    }

    const handleNavigateViewLot = () => {
        navigation.navigate('ViewLotListScreen', { isProfile: true })
    }

    const handleNavigateViewBid = () => {
        navigation.navigate('BidsProductsScreen', { isProfile: true });
    }

    const handleNavigateViewEnquiry = () => {
        navigation.navigate('EnquiryListScreen', { isProfile: true });
    }

    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={`${welcome} ${userName}`}
                    isHome={true}
                    isBackButton={false}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            {(isFetch) && (
                <View>
                    <GetHomeDetailComponent />
                </View>
            )}
            <ScrollView style={{ width: '100%', height: '80%', }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}>
                <View style={{ width: '100%', marginBottom: 50, alignItems: 'center' }}>

                    <BannerComponent listOfCropfit={state.listOfCropfit} message={state.message} applink={state.applink} />


                    <View style={[styles.myActivity, { flexDirection: "column", padding: 20 }]}>
                        <View style={{ flexDirection: "row" }}>
                            <LinearGradient
                                start={{ x: 0, y: 0 }}
                                locations={[0.5, 1]}
                                end={{ x: 1, y: 1 }}
                                colors={['#2BAE38', '#1AE22E']}
                                style={[styles.linearGradient, { marginLeft: 0 }]}
                            >
                                <Image
                                    style={{ height: 25, width: 25 }}
                                    source={images.ACTIVITYWHITE}
                                />
                            </LinearGradient>
                            <View style={{ alignItems: "center", justifyContent: "center" }}>
                                <Text style={styles.activity_text}>{myActivity}</Text>
                            </View>
                        </View>
                        <View style={{ marginVertical: 15, flexDirection: "row", justifyContent: "space-between" }}>
                            <TouchableOpacity
                                onPress={handleNavigateViewLot}
                                style={{ width: 90, height: 100 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0.5 }}
                                    locations={[0, 0.90]}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#8B0000', '#c8333b']}
                                    style={[styles.activity_linearGradient, { marginLeft: 0, borderRadius: 5 }]}
                                >
                                    <Image
                                        style={{ height: 60, width: 60 }}
                                        source={images.MYACTIVITYLOTIMAGE}
                                    />
                                </LinearGradient>
                                <View style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: "#F3E8EA", padding: 5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={styles.activity_btn_text}>{lotText}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleNavigateViewEnquiry}
                                style={{ width: 90, height: 100 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0.5 }}
                                    locations={[0.5, 0.90]}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#006d5b', '#339966']}

                                    style={[styles.activity_linearGradient, { marginLeft: 0, borderRadius: 5 }]}
                                >
                                    <Image
                                        style={{ height: 45, width: 45 }}
                                        source={images.ACTIVITYENQUIRY}
                                    />
                                </LinearGradient>
                                <View style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: "#CDFFCD", padding: 5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={styles.activity_btn_text}>{enquiryText}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleNavigateViewBid}
                                style={{ width: 90, height: 100 }}>
                                <LinearGradient
                                    start={{ x: 0, y: 0.5 }}
                                    locations={[0.5, 0.90]}
                                    end={{ x: 1, y: 1 }}
                                    colors={['#ff6600', '#ff9966']}
                                    style={[styles.activity_linearGradient, { marginLeft: 0, borderRadius: 5 }]}
                                >
                                    <Image
                                        style={{ height: 45, width: 45 }}
                                        source={images.ACTIVITYBID}
                                    />
                                </LinearGradient>
                                <View style={{ borderBottomLeftRadius: 5, borderBottomRightRadius: 5, backgroundColor: "#FFD580", padding: 5, alignItems: "center", justifyContent: "center" }}>
                                    <Text style={styles.activity_btn_text}>{bidText}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 120, marginTop: 25, overflow: 'hidden', }}>
                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#b8fcd9', '#01a552']} style={{ width: '100%', height: 120, flexDirection: 'row', alignItems: 'center', backgroundColor: '#e2f3f0' }}>
                            <Image style={{ marginLeft: 15, width: 40, height: 40, }}
                                source={images.RUPEESICON}>
                            </Image>
                            <View style={{ marginLeft: 15, width: '40%', height: '100%', justifyContent: 'center', }}>
                                <Text style={styles.text_MandiRate}>{mandiRates}</Text>
                                <Text style={styles.text_real}>{realmandiRates}</Text>
                            </View>
                            <View style={{ marginLeft: 15, marginRight: 5, width: 150, height: '100%', justifyContent: 'center', }}>
                                <View style={{ width: 150, height: 50, justifyContent: 'center', }}>
                                    <TouchableOpacity style={styles.view_checkRate}
                                        onPress={() => {
                                            onPressMondiDetail()
                                        }}>
                                        <Text style={styles.text_checkRate}>{checkRate}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: 150, height: 50, justifyContent: 'center', }}>
                                    <TouchableOpacity style={styles.view_checkRate}
                                        onPress={() => {
                                            onPressUploadMondi()
                                        }}>
                                        <Text style={styles.text_checkRate}>{mandiRate}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                    <View style={styles.lotBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40, marginTop: 20, }}>
                            <LinearGradient colors={['#f3e0b9', '#ecaa25']} style={styles.linearGradient}>
                                <Image style={{ width: 15, height: 24, }}
                                    source={images.LOTSICON}>
                                </Image>
                            </LinearGradient>
                            <Text style={styles.text_Lot}>{lots}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, width: '100%', height: 220, }}>
                            {state.listOfLots.length >= 1 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressLotDetails(state.listOfLots[0])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                                            <ResizeImage
                                                uri={state.listOfLots[0].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfLots[0].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfLots[0].DataCount + ' ' + sellerText}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {state.listOfLots.length >= 2 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressLotDetails(state.listOfLots[1])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center' }}>
                                            <ResizeImage
                                                uri={state.listOfLots[1].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfLots[1].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfLots[1].DataCount + ' ' + sellerText}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, width: '100%', height: 220, }}>
                            {state.listOfLots.length >= 3 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressLotDetails(state.listOfLots[2])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                                            <ResizeImage
                                                uri={state.listOfLots[2].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfLots[2].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfLots[2].DataCount + ' ' + sellerText}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {state.listOfLots.length >= 4 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE', }}
                                    onPress={() =>
                                        onPressLotDetails(state.listOfLots[3])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center' }}>
                                            <ResizeImage
                                                uri={state.listOfLots[3].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfLots[3].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfLots[3].DataCount + ' ' + sellerText}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 20, width: '100%', height: 65, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginTop: 10, width: '88%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: colors.line_background }}
                                onPress={onPressViewMoreLots}>
                                <Text style={styles.text_viewMore}>{viewMore}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.lotBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40, marginTop: 20, }}>
                            <LinearGradient colors={['#f3e0b9', '#ecaa25']} style={styles.linearGradient}>
                                <Image style={{ width: 15, height: 24, }}
                                    source={images.LOTSICON}>
                                </Image>
                            </LinearGradient>
                            <Text style={styles.text_Lot}>{enquiries}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, width: '100%', height: 220, }}>
                            {state.listOfEnquiry.length >= 1 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressEnquiryDetails(state.listOfEnquiry[0])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                                            <ResizeImage
                                                uri={state.listOfEnquiry[0].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfEnquiry[0].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfEnquiry[0].DataCount + ' ' + enquiries}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {state.listOfEnquiry.length >= 2 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressEnquiryDetails(state.listOfEnquiry[1])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center' }}>
                                            <ResizeImage
                                                uri={state.listOfEnquiry[1].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfEnquiry[1].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfEnquiry[1].DataCount + ' ' + enquiries}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 10, width: '100%', height: 220, }}>
                            {state.listOfEnquiry.length >= 3 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                                    onPress={() =>
                                        onPressEnquiryDetails(state.listOfEnquiry[2])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                                            <ResizeImage
                                                uri={state.listOfEnquiry[2].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfEnquiry[2].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfEnquiry[2].DataCount + ' ' + enquiries}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                            {state.listOfEnquiry.length >= 4 && (
                                <TouchableOpacity style={{ width: '40%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE', }}
                                    onPress={() =>
                                        onPressEnquiryDetails(state.listOfEnquiry[3])}>
                                    <View>
                                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center' }}>
                                            <ResizeImage
                                                uri={state.listOfEnquiry[3].ImageURL}
                                                desiredHeight={70}
                                            />
                                        </View>
                                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                            <Text style={styles.text_LotTitle}>{state.listOfEnquiry[3].Name}</Text>
                                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                                <Text style={styles.text_seller}>{state.listOfEnquiry[3].DataCount + ' ' + enquiries}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 20, width: '100%', height: 65, justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginTop: 10, width: '88%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: colors.line_background }}
                                onPress={onPressViewMoreEnquiries}>
                                <Text style={styles.text_viewMore}>{viewMore}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {(state.listOfAdvertisements.length > 0) && (

                        <View style={{ flexDirection: 'row', width: '100%', height: 130, marginTop: 25, overflow: 'hidden', backgroundColor: '#263c85' }}>
                            <View style={{ width: '70%', height: '100%' }}>
                                <Text style={styles.text_premium}>{state.listOfAdvertisements[0].Name}</Text>
                                <Text style={styles.text_successful}>{state.listOfAdvertisements[0].Description}</Text>
                                <TouchableOpacity style={styles.view_click}
                                    onPress={() => {
                                        onPressOpenWeb(state.listOfAdvertisements[0].Url)
                                    }
                                    }>
                                    <Text style={styles.text_Clcik}>{'Click Here'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '30%', height: '100%', backgroundColor: '#00a5eb' }}>
                                <View style={styles.sharpEdge}>
                                </View>
                                <View style={{ width: '120%', height: '100%', position: 'absolute', left: -20, top: 0, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={styles.text_day}>{state.listOfAdvertisements[0].ValidDays}</Text>
                                    <Text style={styles.text_Bonus}>{state.listOfAdvertisements[0].ValidInformation}</Text>
                                </View>

                            </View>
                        </View>
                    )}
                    {(state.listOfCropfitClinic.length > 0) && (
                        <View style={{ width: '100%', height: 180, justifyContent: 'center', alignItems: 'center', marginTop: 25, overflow: 'hidden', }}>

                            <View style={{ borderRadius: 12, width: '90%', height: 180, overflow: 'hidden', backgroundColor: '#ddeefe' }}>
                                <View style={{ width: '90%', height: '80%', marginVertical: 30, marginHorizontal: 10 }}>
                                    <Image style={{ width: 160, height: 120, marginLeft: 1 }}
                                        source={images.CROPCLINIC}>
                                    </Image>
                                </View>
                                <View style={{ width: '50%', alignSelf: 'flex-end', marginVertical: -230 }}>
                                    <Text style={[styles.text_clinic, { marginTop: 55 }]}>{state.listOfCropfitClinic[0].Header}</Text>
                                    <Text style={[styles.text_clinic_content, { marginTop: 10 }]}>{state.listOfCropfitClinic[0].Name}</Text>
                                    <TouchableOpacity style={{ marginTop: 30, marginLeft: 50, justifyContent: 'center', alignItems: 'center', width: 100, height: 40, backgroundColor: colors.lite_naviBlue, borderRadius: 20 }}
                                        onPress={() =>
                                            onPressMakeCall(state.listOfCropfitClinic[0].ContactDetails)}>
                                        <Text style={styles.text_clickhere}>{'Click here'}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}
                    <View style={styles.lotBox}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40, marginTop: 20, marginBottom: 20 }}>
                            <LinearGradient colors={['#d26477', '#cb1e53']} style={styles.linearGradient}>
                                <Image style={{ width: 24, height: 24, }}
                                    source={images.VIDEOSICON}>
                                </Image>
                            </LinearGradient>
                            <Text style={styles.text_Lot}>{watchVideo}</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginTop: 10, width: '100%', height: 200, }}>
                            {(state.listOfVideos.length > 0) && (
                                <ImageBackground style={{ width: '100%', height: 200, borderRadius: 6, backgroundColor: colors.line_background }}
                                    source={{ uri: state.listOfVideos[0].ImageURL }}>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 200, }}
                                        onPress={() => {
                                            onPressOpenWeb(state.listOfVideos[0].Url)
                                        }
                                        }>
                                        <Image style={{ width: 40, height: 40 }}
                                            source={images.PLAYICON}>
                                        </Image>
                                    </TouchableOpacity>
                                </ImageBackground>
                            )}
                        </View>

                    </View>
                </View>
                {/* <VersionComponent /> */}
            </ScrollView>
            {/* {loading && <Loading />} */}
        </View>
    );
};


export default HomeScreen;


import { useMutation } from '@apollo/react-hooks';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native';
import gql from 'graphql-tag';
import moment from 'moment';
import React, { createRef, useContext, useEffect, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import { handlePhoneCall } from '../helpers/AppManager';
import { MOBILENUMBERAUDIT_QUERY } from '../helpers/Schema';
const SHOWINTERESTENQUIRY_QUERY = gql`
mutation ($enquiryId: ID!){
    enquiryInterest(enquiryId: $enquiryId) 
  }
`;

const NOTIFICATIONSTATUS_QUERY = gql`
mutation ($id: ID!){
    UpdateNotificationStatus(id: $id)
}
`

const ViewResponseEnquiryScreen = ({ navigation, route }) => {
    const {
        viewResponses,
        updateon,
    } = useContext(AuthContext);

    const [isFetch, setIsFetch] = useState(true);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [arrayOfEnquiries, setArrayOfEnquiries] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const flatList = createRef();
    const [enquiryInterest, { loading, error, data }] = useMutation(SHOWINTERESTENQUIRY_QUERY);
    const [NotificationStatus, { }] = useMutation(NOTIFICATIONSTATUS_QUERY);
    const { getData: getMobileView, loading: mobileViewLoading, error: mobileViewErr, data: mobileViewData } = useMutation(MOBILENUMBERAUDIT_QUERY)
    const [item, setItem] = useState(null)

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setIsFetch(false);
            setLoadingIndicator(true);
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {
        if (route?.params?.updateNotificationId) {
            console.log(route?.params?.updateNotificationId);
            NotificationStatus({
                variables: { id: route?.params?.updateNotificationId }
            }).then((res) => {
                console.log("res", res);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [route?.params?.notificationViewed])

    const onPressBack = () => {
        navigation.goBack();
    }
    const updateLoading = (isloading) => {
        setIsFetch(true);
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        setLoadingIndicator(false);
        console.log('listlistlistlist', list);
        setIsFetch(true);
        setLoadingIndicator(false);
        var tempArray = list.showInterestedEnquiries;
        if (tempArray.length == 0) {
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
            var templist = tempArray
            var bidsTemp = [];
            templist.map((bidInfo, i) => {
                var tempInfo = bidInfo;
                tempInfo.isSelected = (i == 0) ? true : false;
                bidsTemp.push(tempInfo)
            })
            setArrayOfEnquiries(bidsTemp);
        }
    }
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("MMM, DD YYYY")
        return momentObj
    }

    // useEffect(() => {
    //     if (mobileViewData != undefined) {
    //         (async () => {
    //             await handlePhoneCall(item.MobileNo, navigation, mobileViewData.allowtoViewMobileNo)
    //         })()
    //     }
    // }, [mobileViewData])

    const onPressMakeCall = async (item) => {
        setItem(item);
        analytics().logEvent(
            "call", {
            transactiontype: "Enquiry", transactionid: item.Id, screen: "ViewResponseEnquiryScreen", number: item.MobileNo
        }
        );
        await handlePhoneCall(item.MobileNo, navigation);
        return await getMobileView({ variables: { transactiontype: "Enquiry", transactionid: item.Id } })
        // handlePhoneCall(item.MobileNo,navigation)
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
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{viewResponses}</Text>
                </View>
            </View>
            <View style={styles.view_top}>
                <Image style={styles.image_category}
                    source={{ uri: route?.params.details.CommodityChildImageURL }}
                    resizeMode={'contain'}>
                </Image>
                <View style={styles.view_text}>
                    <Text style={styles.text_name}>{route?.params.details.CommodityChild}</Text>
                </View>
            </View>
            <View style={{ width: '100%', height: '77%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.view_box}>
                    <FlatList
                        ref={(ref) => { this.flatList = ref; }}
                        style={{ flex: 1, marginBottom: 10, }}
                        data={arrayOfEnquiries}
                        keyExtractor={(x, i) => i}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                                    <View style={styles.view_detailInner}>
                                        <Text style={styles.label_date}>{updateon + ' ' + dateConvert(item.CreatedOn)}</Text>
                                        <View style={{ width: '100%', }}>
                                            <View style={{ width: '100%', flexDirection: 'row', }}>
                                                {(item.ProfilePicImageURL == '') && (
                                                    <Image style={styles.profile_image}
                                                        source={images.EMPTYPROFILEICON} />
                                                )}
                                                {(item.ProfilePicImageURL != '') && (
                                                    <Image style={styles.profile_image}
                                                        source={{ uri: item.ProfilePicImageURL }} />
                                                )}
                                                <View style={styles.view_user}>
                                                    <Text style={styles.text_userName}>{item.UserName}</Text>
                                                    <View style={{ width: '100%', }}>
                                                        <View style={styles.view_rating}>
                                                            <Image style={{ width: 14, height: 14, tintColor: 'yellow' }}
                                                                source={images.STARICON}></Image>
                                                            <Text style={styles.text_rating}>{(item.Rating == '') ? '0.0' : item.Rating}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={{ marginLeft: 5, marginTop: 10, width: 50, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                                    <TouchableOpacity style={{ width: 40, height: 40 }}
                                                        onPress={() =>
                                                            onPressMakeCall(item)
                                                        }>
                                                        <Image style={{ width: 40, height: 40 }}
                                                            source={images.PHONEICON}>
                                                        </Image>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                            <Text style={[styles.text_location, { marginLeft: 15, marginRight: 15, color: colors.text_Color, marginBottom: 10, }]}>{item.AddressInfo}</Text>
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />
                </View>
            </View>
            {(!isFetch) && (
                <DataFetchComponents
                    selectedId={route.params.details.Id}
                    isType={'ViewResponse'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
            {loadingIndicator && <Loading />}
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
    view_top: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f0efef'
    },
    image_category: {
        marginLeft: 20,
        width: 100,
        height: 80,
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_text: {
        width: '65%',
        justifyContent: 'center',
        height: 80,
    },
    text_name: {
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 16,
        color: colors.text_Color,
    },
    view_box: {
        width: '90%',
        height: '95%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
        shadowColor: 'lightgray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    view_main: {
        alignItems: 'center',
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#01a552',
        // shadowColor: 'lightgray',
        // shadowOffset: {
        //     width: 0,
        //     height: 0,
        // },
        // shadowOpacity: 1,
        // shadowRadius: 10,
        // elevation: 5,

    },
    view_detailInner: {
        marginTop: 15,
        width: '92%',
        borderRadius: 6,
        backgroundColor: '#d2f2e2',
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 7
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    view_topInner: {
        width: '100%',
        height: 90,
        borderRadius: 6,
        backgroundColor: '#01a552',
        overflow: 'hidden',
    },
    view_circule: {
        marginTop: -50,
        marginLeft: '40%',
        width: '150%',
        height: 500,
        borderRadius: 250,
        backgroundColor: '#d2f2e2'
    },
    view_Detailbox: {
        width: '100%',
        height: 90,
        position: 'absolute',
        right: 0,
    },
    text_date: {
        marginTop: 10,
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: colors.white_color,
    },
    view_weight: {
        height: 24,
        backgroundColor: '#e2e2e2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        position: 'absolute',
        bottom: 5,
        right: 5,
    },
    view_weight: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 5,
        backgroundColor: colors.white_color,
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    text_weight: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5,
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#01a552',
    },
    text_ask: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
        position: 'absolute',
        right: 10,
        top: 50,
    },
    text_price: {
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 14,
        color: colors.text_Color,
        position: 'absolute',
        right: 10,
        top: 63,
    },
    button_placeBit: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    profile_image: {
        marginLeft: 10,
        marginTop: 10,
        borderRadius: 8,
        width: 70,
        height: 70,
    },
    view_user: {
        marginLeft: 10,
        marginTop: 5,
        width: '52%',
        height: 80,
        justifyContent: 'center',
    },
    view_rating: {
        width: 45,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        borderRadius: 4,
        backgroundColor: colors.landing_background
    },
    view_headerBottom: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    text_userName: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: colors.text_Color,
    },
    text_rating: {
        marginLeft: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 10,
        color: colors.white_color,
    },
    text_placeBid: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
    text_location: {
        marginTop: 2,
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.white_color,
    },
    label_date: {
        textAlign: 'center',
        marginTop: 10,
        width: '100%',
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 11,
        color: 'gray'
    },
});

export default ViewResponseEnquiryScreen;


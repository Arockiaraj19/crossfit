import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, Platform, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import moment from "moment";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Loading from '../components/Loading';
import { useMutation } from '@apollo/react-hooks';
import { handlePhoneCall } from '../helpers/AppManager';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import { ALLOWMOBILENUMVIEW_QUERY,MOBILENUMBERAUDIT_QUERY } from '../helpers/Schema';

const GETLOTSBYCOMMODITY_QUERY = gql`
query getLotById($lotId: ID!){
    getLotById(lotId:$lotId) {
        Id
        LotNumber
        AddressInfo
        CommodityChild
        CommodityChildImageURL
        Quantity
        SellerPrice
        GradeValue
        GradeId
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CreatedOn
        Status
    }
  }
`;
const UPDATEBITSTATUS_QUERY = gql`
mutation ($bidId: ID!, $statusId: ID!, $currentLotQuantity: Float!){
    updateBidStatus(bidId: $bidId , statusId: $statusId, currentLotQuantity: $currentLotQuantity) 
    
  }
`;
const EditBidsInfoScreen = ({ navigation, route }) => {

    const {
        bidView,
        bitsText,
        bidPrice,
        placeBit,
        productPrice,
        editBits,
        acceptBit,
        quantityText,
        declineBit,
        updateSuccess,
        areYouSureAccept,
        areYouSureDecline
    } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(true);
    const [loadingIndicator, setLoadingIndicator] = React.useState(true);
    const [bidsDetails, setBidsDetails] = React.useState([]);
    const [updateBidStatus, { loading, error, data }] = useMutation(UPDATEBITSTATUS_QUERY);
    const { getData: getMobileView, loading: mobileViewLoading, error: mobileViewErr, data: mobileViewData } = useMutation(MOBILENUMBERAUDIT_QUERY)
    
    useEffect(() => {
        console.log('route ------------ 11 ', route.params);

    }, [])
    const updateValue = (flag) => {
        setTimeout(async () => {
            setLoadingIndicator(flag)
        }, 500);
    }
    const updateBidsInfo = (data) => {
        console.log('datadatadatadatadata', data.getLotById);
        setBidsDetails(data.getLotById);
        setTimeout(async () => {
            setIsFetching(false);
            setLoadingIndicator(false);
        }, 500);
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressPlaceEdit = () => {
        var bidsInfo = route?.params;
        console.log('bidsInfo -------------', bidsInfo);
        navigation.navigate('UpdateBidsInfoScreen', { details: bidsInfo, isEdit: true })
    }
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }

    // useEffect(() => {
    //     if (mobileViewData != undefined) {
    //         (async () => {
    //             await handlePhoneCall(bidsDetails.MobileNo, navigation, mobileViewData.allowtoViewMobileNo)
    //         })()
    //     }
    // }, [mobileViewData])


    const onPressMakeCall = async() => {
        await handlePhoneCall(bidsDetails.MobileNo, navigation);
        return await getMobileView({ variables: { transactiontype: "Lot", transactionid: bidsDetails.Id }})
        // handlePhoneCall(bidsDetails.MobileNo,navigation)
    }
    const onPressAccept = () => {

        Alert.alert('', areYouSureAccept, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {
                updateBidStatus({
                    variables: { bidId: bidsDetails.Id, statusId: 2,currentLotQuantity: parseFloat(bidsDetails.CurrentLotQuantity) }
                })
                    .then(res => {
                        setLoadingIndicator(false)
                        console.log('res ------------------', res);
                        if (res.data.updateBidStatus == 'Updated Successfully') {
                            Alert.alert('', updateSuccess, [{
                                text: 'Ok',
                                onPress: () => {
                                    onPressBack()
                                    return;
                                },
                            },
                            ]);
                        }
                    })
                    .catch(e => {
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
                return;
            },
        },
        ]);
        
    }
    const onPressDecline = () => {
        Alert.alert('', areYouSureDecline, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {
                updateBidStatus({
                    variables: { bidId: bidsDetails.Id, statusId: 3 ,currentLotQuantity: parseFloat(bidsDetails.CurrentLotQuantity) }
                })
                    .then(res => {
                        setLoadingIndicator(false)
                        console.log('res ------------------', res);
                        if (res.data.updateBidStatus == 'Updated Successfully') {
                            Alert.alert('', updateSuccess, [{
                                text: 'Ok',
                                onPress: () => {
                                    onPressBack()
                                    return;
                                },
                            },
                            ]);
                        }
                    })
                    .catch(e => {
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
                return;
            },
        },
        ]);
       
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={bidView}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={{ width: '100%', height: '90%', alignItems: 'center' }}>
                <View style={styles.view_top}>
                    <Image style={styles.image_category}
                        source={{ uri: route?.params.CommodityChildURL }}
                        resizeMode={'contain'}>
                    </Image>
                    <View style={styles.view_text}>
                        <Text style={styles.text_name}>{route?.params.CommodityChildName}</Text>
                        <Text style={styles.text_description}>{route?.params.AddressInfo}</Text>
                    </View>
                </View>
                <View style={{ width: '100%', height: ((route.params.isAccept) && (route.params.Status == '1')) ? 340 : 300, alignItems: 'center', justifyContent: 'center',}}>
                    <View style={[styles.view_detailInner,{ height: ((route.params.isAccept) && (route.params.Status == '1')) ? 300 : 260} ]}>
                        <View style={styles.view_topInner}>
                            <View style={styles.view_circule}>
                                <View style={{ width: '27%', height: 130, marginLeft: '12%', marginTop: 10, }}>
                                    <Text style={styles.text_ask}>{quantityText}</Text>
                                    <Text style={styles.text_price}>{route?.params.Quantity}</Text>
                                    <Text style={[styles.text_ask, { top: 95 }]}>{productPrice}</Text>
                                    <Text style={[styles.text_price, { top: 108 }]}>{'₹ ' + bidsDetails.SellerPrice }</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.view_Detailbox}>
                            <View style={{ width: '48%', height: '100%', }}>
                                <Text style={styles.text_date}>{dateConvert(route?.params.CreatedOn)}</Text>
                                <Text style={styles.text_location}>{route?.params.AddressInfo}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 100, flexDirection: 'row', }}>
                            {(bidsDetails.ProfilePicImageURL == '') && (
                                <Image style={styles.profile_image}
                                    source={images.EMPTYPROFILEICON} />
                            )}
                            {(bidsDetails.ProfilePicImageURL != '') && (
                                <Image style={styles.profile_image}
                                    source={{ uri: route.params.ProfilePicImageURL }} />
                            )}
                            <View style={styles.view_user}>
                                <Text style={styles.text_userName}>{bidsDetails.UserName}</Text>
                                <View style={{ width: '100%', }}>
                                    <View style={styles.view_rating}>
                                        <Image style={{ width: 14, height: 14, tintColor: 'yellow' }}
                                            source={images.STARICON}></Image>
                                        <Text style={styles.text_rating}>{(bidsDetails.Rating == '') ? '0.0' : bidsDetails.Rating}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginLeft: 5, marginTop: 10, width: 50, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: 40, height: 40 }}
                                    onPress={onPressMakeCall}>
                                    <Image style={{ width: 40, height: 40 }}
                                        source={images.PHONEICON}>
                                    </Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.view_headerBottom}>
                            <View style={[styles.button_placeBit, { position: 'absolute', right: 125, }]}>
                                <Text style={[styles.text_placeBid, { fontSize: 18, }]}>{bidPrice}</Text>
                            </View>
                            <View style={{ width: 120, height: 40, position: 'absolute', bottom: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.landing_background, borderTopLeftRadius: 20, borderBottomLeftRadius: 20, }}>
                                <Text style={[styles.text_askPrice, { color: colors.white_color }]}>{'₹ ' + route?.params.BidPrice}</Text>
                            </View>
                        </View>
                        {((route.params.isAccept) && (route.params.Status == '1')) && (
                            <View style={[styles.view_bottom, { alignItems: 'center', marginBottom: 5, justifyContent: 'space-evenly' }]}>
                                <TouchableOpacity style={{ width: '43%', height: 35, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(1, 165, 82, 0.2)' }}
                                    onPress={() =>
                                        onPressAccept()}>
                                    <Text style={[styles.text_accept, { color: colors.landing_background }]}>{acceptBit}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ width: '43%', height: 35, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(249, 97, 97, 0.2)' }}
                                    onPress={() =>
                                        onPressDecline()}>
                                    <Text style={[styles.text_accept, { color: '#f96161' }]}>{declineBit}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
                {(route.params.isEdit) && (
                    <TouchableOpacity style={[styles.button_placeBit, { height: 35, marginTop: 20, backgroundColor: 'rgba(1, 165, 82, 0.2)', borderRadius: 5, }]}
                        onPress={onPressPlaceEdit}>
                        <Text style={styles.text_placeBid}>{editBits}</Text>
                    </TouchableOpacity>
                )}
                {/* <TouchableOpacity style={[styles.button_placeBit, { height: 35, marginTop: 20, backgroundColor: '#fbc5c5', borderRadius: 5, }]}
                    onPress={onPressPlaceDelete}>
                    <Text style={[styles.text_placeBid, { color: '#f43939' }]}>{deleteBits}</Text>
                </TouchableOpacity> */}
            </View>
            {(isFetching) && (
                <Query query={GETLOTSBYCOMMODITY_QUERY} variables={{ lotId: route?.params.LotId }}>
                    {({ loading, error, data }) => {
                        console.log('loadingloadingloading', data);
                        if (loading) {
                            () =>
                                updateValue(true);
                            return <View />
                        };
                        if (error) {
                            console.log('errorerrorerrorerror', error);
                            updateValue(false);
                            return <View />;
                        }
                        if (!data) {
                            updateValue(false);
                            return <View />;
                        }
                        updateBidsInfo(data);
                        return <View />
                    }}
                </Query>
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
    view_detailInner: {
        width: '92%',
        height: 300,
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
    view_box: {
        width: '90%',
        height: '100%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
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
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.white_color,
    },
    text_location: {
        marginTop: 2,
        marginLeft: 10,
        height: 60,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
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
    text_weight: {
        marginLeft: 10,
        marginRight: 10,
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
        fontSize: 13,
        color: colors.text_Color,
        position: 'absolute',
        right: 10,
        top: 63,
    },
    button_placeBit: {
        marginRight: 10,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_askPrice: {
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 16,
        color: colors.text_Color,
    },
    profile_image: {
        marginLeft: 10,
        marginTop: 15,
        borderRadius: 8,
        width: 70,
        height: 70,
    },
    view_user: {
        marginLeft: 10,
        marginTop: 10,
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
        height: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        // bottom: 10,
    },
    text_rating: {
        marginLeft: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 10,
        color: colors.white_color,
    },
    text_placeBid: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
    image_category: {
        marginLeft: 20,
        width: 100,
        height: 80,
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_top: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f0efef'
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
    text_description: {
        marginTop: 5,
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.subText_Color,
    },
    text_userName: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: colors.text_Color,
    },
    view_bottom: {
        marginTop: 10,
        width: '100%',
        height: 40,
        flexDirection: 'row',
    },
    text_accept: {
        fontSize: 15,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        color: colors.white_color,
    },
});

export default EditBidsInfoScreen;


import { useMutation } from '@apollo/react-hooks';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native';
import moment from 'moment';
import React, { createRef, useContext, useState } from 'react';
import { FlatList, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import SellerInfoCompnents from '../components/SellerInfoCompnents';
import { colors, fonts, images } from '../core';
import { handlePhoneCall } from '../helpers/AppManager';
import { MOBILENUMBERAUDIT_QUERY } from '../helpers/Schema';
const SellerInfoListScreen = ({ navigation, route }) => {
    const {
        sellerList,
        lotAddedOn,
        productPrice,
        placeBit,
        sellerText,
        quantityText
    } = useContext(AuthContext);

    const [isFetch, setIsFetch] = useState(true);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [arrayOfSellerList, setArrayOfSellerList] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const flatList = createRef();
    const [lotDetails, setLotDetails] = React.useState([]);
    const [audit, { loading: auditLoding, error: auditError, data: auditData }] = useMutation(MOBILENUMBERAUDIT_QUERY);

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

    // useEffect(() => {
    //     if (mobileViewData != undefined) {
    //         (async () => {

    //         })()
    //     }
    // }, [mobileViewData])

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
        var tempArray = list.getLotsByCommodityGroup;
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
                if (i == 0) {
                    setLotDetails(bidInfo);
                }
            })
            if (bidsTemp.length > 1) {
                setArrayOfSellerList(bidsTemp);
            }
        }
    }
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }
    const onPressMakeCall = async () => {
        try {
            console.log("onPressMakeCall");
            analytics().logEvent(
                "call", {
                transactionType: "Lot", transactionId: lotDetails.Id, screen: "SellerInfoListScreen", number: lotDetails.MobileNo
            }
            );
            console.log({ transactionType: "Lot", transactionId: lotDetails.Id });
            await handlePhoneCall(lotDetails.MobileNo, navigation);
            console.log(auditData);
            await audit({ variables: { transactionType: "Lot", transactionId: lotDetails.Id } })
        } catch (error) {
            console.log("onPressMakeCall Error");
            console.log(error);
        }

    }
    const onPressSelectBid = (item) => {
        setLotDetails(item)
        // this.flatList.scrollToOffset({ animated: true, offset: 0 });
        var templist = arrayOfSellerList;
        var bidsTemp = [];
        templist.map((bidInfo, i) => {
            var tempInfo = bidInfo;
            tempInfo.isSelected = (item.Id == bidInfo.Id) ? true : false;
            bidsTemp.push(tempInfo)
            if (item.Id == bidInfo.Id) {
                setLotDetails(bidInfo);
            }
        })
        if (bidsTemp.length > 1) {
            setArrayOfSellerList(bidsTemp);
        }
    }

    const onPressPlaceBit = () => {
        var param = {
            Name: lotDetails.CommodityChild,
            Id: lotDetails.CommodityChildId,
            ImageURL: lotDetails.CommodityChildImageURL,
            MSP: lotDetails.MSP,
        }
        navigation.navigate('DeliveryAddressScreen', { details: param, bidDetail: lotDetails, isType: 'buy' });
    }
    const headerViewInfo = () => {
        return (
            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: '92%', alignItems: 'center', borderRadius: 5, backgroundColor: '#d2f2e2', }}>
                    <View style={styles.view_main}>
                        <Text style={styles.label_date}>{lotAddedOn + ' ' + dateConvert(lotDetails.CreatedOn)}</Text>
                        <View style={[styles.view_price, { flexDirection: 'column', justifyContent: 'space-between', width: '90%', padding: 10, marginTop: 5, marginLeft: 15, marginBottom: 5, }]}>
                            <View style={styles.price_container}>
                                <View >
                                    <Text style={styles.label_price}>{quantityText}</Text>
                                </View>
                                <View style={styles.view_askamounts}>
                                    <Text style={styles.text_askamount}>{`${lotDetails?.Quantity}`}</Text>
                                </View>
                            </View>
                            <View style={styles.price_container}>
                                <View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.label_price}>{productPrice}</Text>
                                </View>
                                <View style={styles.view_askamounts}>
                                    <Text style={styles.text_askamount}>{`₹ ${lotDetails?.SellerPrice} / ${lotDetails?.QuantityCode}`}</Text>
                                </View>
                            </View>

                        </View>
                        <View style={styles.view_name}>
                            <Text style={styles.label_name}>{lotDetails.CommodityChild}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', }}>
                        <View style={{ width: '100%', flexDirection: 'row', }}>
                            {(lotDetails.ProfilePicImageURL == '') && (
                                <Image style={styles.profile_image}
                                    source={images.EMPTYPROFILEICON} />
                            )}
                            {(lotDetails.ProfilePicImageURL != '') && (
                                <Image style={styles.profile_image}
                                    source={{ uri: lotDetails.ProfilePicImageURL }} />
                            )}
                            <View style={styles.view_user}>
                                <View style={{ flexDirection: "row" }}>
                                    <View>
                                        <Text style={styles.text_userName}>{lotDetails.UserName}</Text>
                                        <View style={{ width: '100%', }}>
                                            <View style={styles.view_rating}>
                                                <Image style={{ width: 14, height: 14, tintColor: 'yellow' }}
                                                    source={images.STARICON}></Image>
                                                <Text style={styles.text_rating}>{(lotDetails.Rating == '') ? '0.0' : lotDetails.Rating}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    {/* <TouchableOpacity style={{marginHorizontal:10,alignItems:"center",justifyContent:"center"}}
                                        >
                                        <Image style={{ width: 40, height: 40 }}
                                            source={images.BOOKMARKICON}>
                                        </Image>
                                    </TouchableOpacity> */}
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
                        <Text style={styles.text_location}>
                            {lotDetails.AddressInfo}
                        </Text>
                        <View style={styles.view_headerBottom}>
                            <TouchableOpacity style={styles.button_placeBit}
                                onPress={onPressPlaceBit}>
                                <Text style={styles.text_placeBid}>{placeBit}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
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
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{sellerList}</Text>
                </View>
            </View>
            <View style={styles.view_top}>
                <Image style={styles.image_category}
                    source={{ uri: route?.params.details.ImageURL }}
                    resizeMode={'contain'}>
                </Image>
                <View style={styles.view_text}>
                    <Text style={styles.text_name}>{route?.params.details.Name}</Text>
                </View>
            </View>
            <View style={{ width: '100%', height: '77%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.view_box}>
                    <FlatList
                        ref={(ref) => { this.flatList = ref; }}
                        style={{ flex: 1, marginBottom: 10, }}
                        data={arrayOfSellerList}
                        keyExtractor={(x, i) => i}
                        ListHeaderComponent={arrayOfSellerList.length < 1 ? () => headerViewInfo() : ''}
                        renderItem={({ item, index }) => {
                            return (
                                <SellerInfoCompnents
                                    props={item}
                                    isLot={true}
                                    lotAddedOn={lotAddedOn}
                                    productPrice={productPrice}
                                    quantityText={quantityText}
                                    headerViewInfo={headerViewInfo}
                                    onPressSelectBid={onPressSelectBid} />
                            )
                        }}
                    />
                </View>
            </View>
            {(!isFetch) && (
                <DataFetchComponents
                    selectedId={route.params.details.Id}
                    isType={'SellerList'}
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
    label_date: {
        marginTop: 10,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 11,
        color: colors.white_color
    },
    label_price: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: colors.white_color
    },
    view_name: {
        marginTop: 10,
        height: 30,
        backgroundColor: colors.white_color,
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 15,
    },
    label_name: {
        marginLeft: 15,
        marginRight: 15,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 15,
        color: '#01a552',
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
    text_userName: {
        // marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: colors.text_Color,
    },
    text_city: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 13,
        color: colors.text_Color,
    },
    text_rating: {
        marginLeft: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 10,
        color: colors.white_color,
    },
    text_location: {
        marginTop: 3,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
    },
    view_headerBottom: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
    button_placeBit: {
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_placeBid: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
    price_container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        marginTop: 5
    },
    view_askamounts: {
        width: '60%',
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e7f8f0',
        borderRadius: 4,
    },
    text_askamount: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#000',
    },
    view_price: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 4,
    },
});

export default SellerInfoListScreen;


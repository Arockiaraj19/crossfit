import React, { useContext, useEffect, useState, createRef } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Platform, TouchableOpacity, Linking, Alert } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import HeaderComponents from '../components/HeaderComponents';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import BidsInfoComponents from '../components/BidsInfoComponents';
import Loading from '../components/Loading';
import moment from "moment";
import { handlePhoneCall } from '../helpers/AppManager';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import { ALLOWMOBILENUMVIEW_QUERY } from '../helpers/Schema';

const GETLOTSBYCOMMODITY_QUERY = gql`
query getLotsByCommodityChild($commodityChildId: ID!){
    getLotsByCommodityChild(commodityChildId:$commodityChildId) {
        Id
        LotNumber
        AddressInfo
        CommodityChild
        CommodityChildImageURL
        Quantity
        CultivatedArea
        CultivatedAreaUnit
        IsOrganic
        UnitQuantity
        QuantityCode
        QuantityUnit
        SellerPrice
        GradeValue
        GradeId
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CreatedOn
        Status
        CurrentAvailableQuantity
        QuantityActualCode
    }
  }
`;


const BidsDetailListScreen = ({ navigation, route }) => {
    const {
        bitsText,
        placeBit,
        productPrice,
        gradeText,
        organic,
        quantityText,
    } = useContext(AuthContext);

    const [arrayOfList, setArrayOfList] = React.useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [bidsDetails, setBidsDetails] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(true);
    const flatList = createRef();
    const { getData: getMobileView, loading: mobileViewLoading, error: mobileViewErr, data: mobileViewData } = fetchDataFromServer(ALLOWMOBILENUMVIEW_QUERY)
    const updateValue = (flag) => {
        setTimeout(async () => {
            setLoadingIndicator(true)
        }, 500);
    }
    const updateBidsInfo = (data) => {
        console.log('bidDetailListscreen',data)
        if (data.getLotsByCommodityChild != null) {
            var templist = data.getLotsByCommodityChild;
            var bidsTemp = [];
            templist.map((bidInfo, i) => {
                var tempInfo = bidInfo;
                tempInfo.isSelected = (i == 0) ? true : false;
                bidsTemp.push(tempInfo)
                if (i == 0) {
                    setBidsDetails(bidInfo);
                }
            })
            setTimeout(async () => {
                setIsFetching(false);
                setLoadingIndicator(false);
                setArrayOfList(bidsTemp);
            }, 500);
        }
        else {
            setIsFetching(false);
            setLoadingIndicator(false);
        }
    }
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressSelectBid = (item) => {
        // this.flatList.scrollToOffset({ animated: true, offset: 0 });
        var templist = arrayOfList;
        var bidsTemp = [];
        templist.map((bidInfo, i) => {
            var tempInfo = bidInfo;
            tempInfo.isSelected = (item.Id == bidInfo.Id) ? true : false;
            bidsTemp.push(tempInfo)
            if (item.Id == bidInfo.Id) {
                setBidsDetails(bidInfo);
            }
        })
        setArrayOfList(bidsTemp);
    }

    useEffect(() => {
        if (mobileViewData != undefined) {
            (async () => {
                await handlePhoneCall(bidsDetails.MobileNo, navigation, mobileViewData.allowtoViewMobileNo)
            })()
        }
    }, [mobileViewData])

    const onPressMakeCall = async() => {
        return await getMobileView({ variables: { transactiontype: "Lot", transactionid: bidsDetails.Id }})
    } 

    const onPressPlaceBit = () => {
        navigation.navigate('PlaceBitInfoScreen', { details: route?.params.details, bidsDetails: bidsDetails, addressId: route?.params.addressId, isEdit: false })
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }
    const headerViewInfo = () => {
        return (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                <View style={styles.view_detailInner}>
                    <View style={styles.view_topInner}>
                        <View style={styles.view_circule}>
                            <View style={{ width: '27%', height: 130, marginLeft: '12%', marginTop: 10, }}>
                                <Text style={styles.text_ask}>{quantityText}</Text>
                                <Text style={styles.text_price}>{`${bidsDetails?.CurrentAvailableQuantity ? `${bidsDetails?.CurrentAvailableQuantity} ${bidsDetails?.QuantityCode}` : `${bidsDetails?.Quantity}${bidsDetails?.QuantityCode}`}`}</Text>
                                <Text style={[styles.text_ask, { top: 95 }]}>{productPrice}</Text>
                                <Text style={[styles.text_price, { top: 108 }]}>{`₹ ${bidsDetails.SellerPrice} / ${bidsDetails.QuantityCode}`}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.view_Detailbox}>
                        <View style={{ width: '48%', height: '100%', }}>
                            <Text style={styles.text_date}>{dateConvert(bidsDetails.CreatedOn)}</Text>
                            <Text style={styles.text_grade}>{gradeText + ' : ' + bidsDetails.GradeValue }</Text>
                            {(bidsDetails.IsOrganic == 1) && (
                                <View style={{ marginLeft: 10, marginTop: 5, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 70, height: 20, backgroundColor: '#d2f2e2' }}>
                                    <Text style={styles.text_organic}>{organic}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={{ width: '100%', }}>
                        <View style={{ width: '100%', flexDirection: 'row',}}>
                            {(bidsDetails.ProfilePicImageURL == '') && (
                                <Image style={styles.profile_image}
                                    source={images.EMPTYPROFILEICON} />
                            )}
                            {(bidsDetails.ProfilePicImageURL != '') && (
                                <Image style={styles.profile_image}
                                    source={{ uri: bidsDetails.ProfilePicImageURL }} />
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
                        <Text style={[styles.text_location, { marginLeft: 15, marginRight: 15, color: colors.text_Color, marginBottom: 10,}]}>{bidsDetails.AddressInfo}</Text>
                    
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
                <HeaderComponents
                    headerTitle={bitsText}
                    onPressBack={onPressBack}
                    isBackButton={true}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_top}>
                <Image style={styles.image_category}
                    resizeMode={'contain'}
                    source={{ uri: route?.params.details.ImageURL }}>
                </Image>
                <View style={styles.view_text}>
                    <Text style={styles.text_name}>{route?.params.details.Name}</Text>
                    <Text style={styles.text_description}>{''}</Text>
                </View>
            </View>
            {(arrayOfList != 0) && (
                <View style={styles.view_Inner}>
                    <View style={styles.view_box}>
                        <FlatList
                            ref={(ref) => { this.flatList = ref; }}
                            style={{ flex: 1, marginBottom: 10, }}
                            data={arrayOfList}
                            keyExtractor={(x, i) => i}
                            ListHeaderComponent={arrayOfList.length < 1 ?  () => headerViewInfo() : ''}
                            renderItem={({ item, index }) => {
                                return (
                                    <BidsInfoComponents
                                        props={item}
                                        organic={organic}
                                        gradeText={gradeText}
                                        productPrice={productPrice}
                                        headerViewInfo={headerViewInfo}
                                        onPressSelectBid={onPressSelectBid} />
                                )
                            }}
                        />
                    </View>
                </View>
            )}
            {(isFetching) && (
                <Query query={GETLOTSBYCOMMODITY_QUERY} variables={{ commodityChildId: route?.params.details.Id }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateValue(true);
                            return <View />
                        };
                        if (error) {
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
    text_description: {
        marginTop: 5,
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.subText_Color,
    },
    view_Inner: {
        width: '100%',
        height: '73%',
        alignItems: 'center',
    },
    view_topInner: {
        width: '100%',
        height: 100,
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
    text_userName: {
        marginTop: 5,
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
    text_placeBid: {
        marginLeft: 10, 
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
    view_detailInner: {
        width: '92%',
        // height: 260,
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
    text_organic: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: '#01a552',
    },
    text_grade: {
        marginTop: 5,
        marginLeft: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: colors.white_color,
    },
    text_location: {
        marginTop: 2,
        marginLeft: 10,
        // height: 60,
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
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
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
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        // position: 'absolute',
        marginTop: 5,
        marginBottom: 10,
    },
});

export default BidsDetailListScreen;


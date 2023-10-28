import React, { useEffect, useContext, useState, createRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Platform, FlatList, Alert, Linking, } from 'react-native';
import { colors, fonts, images } from '../core';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import DataFetchComponents from '../components/DataFetchComponents';
import SellerInfoCompnents from '../components/SellerInfoCompnents';
import moment from 'moment';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { handlePhoneCall } from '../helpers/AppManager';
import { fetchDataFromServer, sendDataToServer } from '../helpers/QueryFetching';
import { ALLOWMOBILENUMVIEW_QUERY,MOBILENUMBERAUDIT_QUERY } from '../helpers/Schema';


const SHOWINTERESTENQUIRY_QUERY = gql`
mutation ($enquiryId: ID!){
    enquiryInterest(enquiryId: $enquiryId) 
  }
`;

const ViewEnquiryInfoScreen = ({ navigation, route }) => {
    const {
        viewExpert,
        enquiryAddedOn,
        productPrice,
        showInterest,
        expectedon,
        enquiryMessage,
    } = useContext(AuthContext);

    const [isFetch, setIsFetch] = useState(true);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [arrayOfEnquiries, setArrayOfEnquiries] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const flatList = createRef();
    const [lotDetails, setLotDetails] = React.useState([]);
    const [enquiryInterest, { loading, error, data }] = useMutation(SHOWINTERESTENQUIRY_QUERY);
    const [audit, { loading:auditLoding, error:auditError, data:auditData }] =useMutation(MOBILENUMBERAUDIT_QUERY);

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
    //     console.log("what the mobile data");
    //     console.log(mobileViewData);
    //     console.log("what is the mobile data-error");
    //     console.log(mobileViewErr)
    //     if (mobileViewData != undefined) {
    //         (async () => {
    //             await handlePhoneCall(lotDetails.MobileNo, navigation)
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
        
        setIsFetch(true);
        setLoadingIndicator(false);
        var tempArray = list.getenquiriesByCommodityGroup;
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
            if(bidsTemp.length > 1){
                setArrayOfEnquiries(bidsTemp);
            }  
        }
    }
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("MMM, DD YYYY")
        return momentObj
    }

    const onPressMakeCall = async() => {
        try {
            console.log("onPressMakeCall");
            console.log( { transactionType: "Enquiry", transactionId: lotDetails.Id });
            await handlePhoneCall(lotDetails.MobileNo, navigation);
            console.log(auditData);
       await audit({ variables: { transactionType: "Enquiry", transactionId: lotDetails.Id }})
        } catch (error) {
            console.log("onPressMakeCall Error");
            console.log(error);
        }
    } 

    const onPressSelectBid = (item) => {
        setLotDetails(item)
        // this.flatList.scrollToOffset({ animated: true, offset: 0 });
        var templist = arrayOfEnquiries;
        var bidsTemp = [];
        templist.map((bidInfo, i) => {
            var tempInfo = bidInfo;
            tempInfo.isSelected = (item.Id == bidInfo.Id) ? true : false;
            bidsTemp.push(tempInfo)
            if (item.Id == bidInfo.Id) {
                setLotDetails(bidInfo);
            }
        })
        if(bidsTemp.length > 1){
            setArrayOfEnquiries(bidsTemp);
        }
    }
    const onPressShowInterest = () => {
        enquiryInterest({
            variables: { enquiryId: lotDetails.Id}
        })
            .then(res => {
                setLoadingIndicator(false)
                console.log('res ------------------', res);
                if(res.data?.enquiryInterest == 'Success'){
                    Alert.alert('', enquiryMessage, [{
                        text: 'OK', onPress: () => {
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
    }
    const headerViewInfo = () => {
        return (
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', }}>
                <View style={styles.view_detailInner}>
                    <View style={styles.view_topInner}>
                        <View style={styles.view_circule}>
                            <View style={{ width: '25%', height: 130, marginLeft: '15%', marginTop: 10, }}>
                                <Text style={[styles.text_ask, { top: 70 }]}>{expectedon}</Text>
                                <Text style={[styles.text_price, { top: 90}]}>{dateConvert(lotDetails.DeliveryOn)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.view_Detailbox}>
                        <View style={{ width: '48%', height: '100%', }}>
                            <Text style={styles.text_date}>{lotDetails.CommodityChild }</Text>
                            <View style={styles.view_weight}>
                                <Text style={styles.text_weight}>{lotDetails.UnitQuantity + ' ' + lotDetails.QuantityCode}</Text> 
                            </View>
                        </View>
                    </View>
                    <View style={{ width: '100%', }}>
                        <View style={{ width: '100%', flexDirection: 'row',}}>
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
                                        {/* <TouchableOpacity style={{ marginHorizontal: 10, alignItems: "center", justifyContent: "center" }} >
                                            <Image style={{ width: 40, height: 40 }}
                                                source={images.EMPTYBOOKMARKICON}>
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
                        <Text style={[styles.text_location, { marginLeft: 15, marginRight: 15, color: colors.text_Color, marginBottom: 10,}]}>{lotDetails.AddressInfo}</Text>
                    </View>
                    <View style={styles.view_headerBottom}>
                        <TouchableOpacity style={styles.button_placeBit}
                            onPress={onPressShowInterest}>
                            <Text style={styles.text_placeBid}>{showInterest}</Text>
                        </TouchableOpacity>
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
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{viewExpert}</Text>
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
                        data={arrayOfEnquiries}
                        keyExtractor={(x, i) => i}
                        ListHeaderComponent={arrayOfEnquiries.length <1 ? () => headerViewInfo() : ''}
                        renderItem={({ item, index }) => {
                            return (
                                <SellerInfoCompnents
                                key={index}
                                    props={item}
                                    isLot={false}
                                    lotAddedOn={enquiryAddedOn}
                                    productPrice={expectedon}
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
                    isType={'GetEnquiries'}
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
        // marginTop: 15,
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
        marginBottom: 15,
    },
    text_userName: {
        // marginTop: 5,
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
});

export default ViewEnquiryInfoScreen;


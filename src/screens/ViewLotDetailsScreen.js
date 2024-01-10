import { useMutation } from '@apollo/react-hooks';
import analytics from '@react-native-firebase/analytics';
import { useFocusEffect } from '@react-navigation/native';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { Alert, FlatList, Platform, StyleSheet, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import BidsListComponents from '../components/BidsListComponents';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts } from '../core';
import { handlePhoneCall } from '../helpers/AppManager';
import { MOBILENUMBERAUDIT_QUERY } from '../helpers/Schema';
const GETBIDSBYLOT_QUERY = gql`
query getBidsbyLotId($lotId: ID!){
    getBidsbyLotId(lotId:$lotId) {
        Id
        LotId
        UserAddressId
        BidNumber
        UserId
        AddressInfo
        IsOrganic
        Quantity
        QuantityUnit
        QuantityValue
        QuantityCode
        CommodityChildName
        CommodityChildURL
        AskingPrice
        BidPrice
        LotQuantity
        LotQuantityUnit
        LotQuantityValue
        LotQuantityCode
        CreatedOn
        Status
        StatusValue
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CurrentLotQuantity

    }
  }
`;

const UPDATEBITSTATUS_QUERY = gql`
mutation ($bidId: ID!, $statusId: ID!, $currentLotQuantity: Float!){
    updateBidStatus(bidId: $bidId , statusId: $statusId, currentLotQuantity: $currentLotQuantity) 
    
  }
`;
const UPDATENOTIFICATIONSTATUS_QUERY = gql`
mutation ($id: ID!){
    UpdateNotificationStatus(id: $id)
}
`

const ViewLotDetailsScreen = ({ navigation, route }) => {

    const [arrayOfList, setArrayOfList] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(false);
    const [bidsDetails, setBidsDetails] = React.useState([]);
    const [updateBidStatus, { loading, error, data }] = useMutation(UPDATEBITSTATUS_QUERY);
    const [updateNotificationStatus, { }] = useMutation(UPDATENOTIFICATIONSTATUS_QUERY);
    const { getData: getMobileView, loading: mobileViewLoading, error: mobileViewErr, data: mobileViewData } = useMutation(MOBILENUMBERAUDIT_QUERY)


    const {
        bidView,
        statusText,
        bitsTitle,
        biddedOn,
        productPrice,
        bidPrice,
        pickup,
        editBits,
        deleteBits,
        acceptBit,
        declineBit,
        updateSuccess,
        approveErrorMsg,
        areYouSureAccept,
        areYouSureDecline,
        logoutYes,
        logoutCancel
    } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setLoadingIndicator(true)
            setArrayOfList([]);
            setTimeout(async () => {
                setIsFetch(false);
            }, 500);
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {
        if (route?.params?.updateNotificationId) {
            console.log(route?.params?.updateNotificationId);
            updateNotificationStatus({
                variables: { id: route.params.updateNotificationId }
            }).then((res) => {
                console.log("res", res);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [route?.params?.notificationViewed])

    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const editBidsInfo = (info, isEdit) => {
        var params = info;
        console.log('View lot screen paramsparamsparamsparamsparams', info)
        params.isEdit = isEdit;
        params.isAccept = true
        navigation.navigate('EditBidsInfoScreen', params);
    }
    const onPressBack = () => {
        navigation.goBack();
    }
    const updateSubValue = () => {
        setTimeout(async () => {
            setIsFetch(false)
            setLoadingIndicator(false)
        }, 500);
    }
    const updateBidsInfo = (data) => {
        console.log('ViewLotDetailsScreen updateBidsInfo data', data)

        if (data.getBidsbyLotId != null) {
            var templist = data.getBidsbyLotId;
            templist.map((bidInfo, i) => {
                if (i == 0) {
                    setBidsDetails(bidInfo);
                }
            })
        }

        setTimeout(async () => {
            setIsFetch(true);
            setLoadingIndicator(false)
            setArrayOfList(data.getBidsbyLotId)
        }, 100);
    }
    const onPressAccept = (info) => {
        Alert.alert('', areYouSureAccept, [{
            text: logoutCancel, onPress: () => { return; },
        },
        {
            text: logoutYes,
            onPress: () => {
                console.log('viewlotdetail  infoinfoinfoinfoinfo', { bidId: info.Id, statusId: 2, info })
                if (parseFloat(info.QuantityValue) > parseFloat(info.CurrentLotQuantity)) {
                    Alert.alert('', approveErrorMsg, [{
                        text: 'Ok',
                        onPress: () => {
                            return;
                        },
                    },
                    ]);
                } else {

                    updateBidStatus({
                        variables: { bidId: info.Id, statusId: 2, currentLotQuantity: parseFloat(info.CurrentLotQuantity) }
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
                }
                return;
            },
        },
        ]);

    }

    // useEffect(() => {
    //     if (mobileViewData != undefined) {
    //         (async () => {
    //             await handlePhoneCall(bidsDetails.MobileNo, navigation, mobileViewData.allowtoViewMobileNo)
    //         })()
    //     }
    // }, [mobileViewData])


    const onPressMakeCall = async () => {
        analytics().logEvent(
            "call", {
            transactiontype: "Bid", transactionid: bidsDetails.Id, screen: "ViewLotDetailsScreen", number: bidsDetails.MobileNo
        }
        );
        await handlePhoneCall(bidsDetails.MobileNo, navigation);
        return await getMobileView({ variables: { transactiontype: "Bid", transactionid: bidsDetails.Id } })
        // handlePhoneCall(bidsDetails.MobileNo,navigation)
    }
    const onPressDecline = (info) => {
        Alert.alert('', areYouSureDecline, [{
            text: logoutCancel, onPress: () => { return; },
        },
        {
            text: logoutYes,
            onPress: () => {
                console.log('viewlotdetail', info)
                updateBidStatus({
                    variables: { bidId: info.Id, statusId: 3, currentLotQuantity: parseFloat(info.CurrentLotQuantity) }
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
                    onPressShowLanguage={onPressShowLanguage}
                    otherIcons={true} />
            </View>
            <View style={styles.view_main}>
                <FlatList
                    style={{ flex: 1, marginTop: 10, marginBottom: 20, }}
                    data={arrayOfList}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item, index }) => {
                        return (
                            <BidsListComponents
                                props={item}
                                isBottom={false}
                                isAccept={true}
                                isMyBid={true}
                                biddedOn={biddedOn}
                                productPrice={productPrice}
                                bidPrice={bidPrice}
                                pickup={pickup}
                                editBits={editBits}
                                deleteBits={deleteBits}
                                acceptBit={acceptBit}
                                declineBit={declineBit}
                                onPressAccept={onPressAccept}
                                onPressMakeCall={onPressMakeCall}
                                onPressDecline={onPressDecline}
                                editBidsInfo={editBidsInfo} />
                        )
                    }}
                />

            </View>
            {(!isFetch) && (
                <Query query={GETBIDSBYLOT_QUERY} variables={{ lotId: route.params.lotId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateSubValue(true);
                            return <View />
                        };
                        if (error) {
                            updateSubValue(false);
                            return <View />;
                        }
                        if (!data) {
                            updateSubValue(false);
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
    view_main: {
        width: '100%',
        height: '90%',
    },
    view_status: {
        marginTop: 10,
        width: 160,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 15,
    },
    text_status: {
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: '#444444',
    },
    view_all: {
        marginLeft: 10,
        width: 90,
        height: 30,
        flexDirection: 'row',
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: colors.line_background,
    },
    text_statusAll: {
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#666666',
    },
    image_dropdown: {
        position: 'absolute',
        right: 10,
        width: 10,
        height: 5,
    }
});

export default ViewLotDetailsScreen;


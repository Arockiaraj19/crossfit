import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { images, colors, fonts } from '../core'
import Loading from '../components/Loading'
import { useFocusEffect } from '@react-navigation/native'
import DataFetchComponents from '../components/DataFetchComponents'
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag'
import { AuthContext } from '../components/AuthContext'


const GET_ENQUIRY_QUERY = gql`
mutation($id: ID!){
    getenquiriesById(id:$id) {
        Id
        EnquiryNumber
        UserId
        UserAddressId
        GradeId
        CommodityChild
        CommodityChildImageURL
        AddressInfo
        Quantity
        UnitQuantity
        QuantityUnit
        QuantityCode
        DeliveryOn
        CreatedOn
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        Status
        GradeValue
        ResponseCount
        CommodityGroupId
        CommodityChildId   
    }
  }
`;

const NotificationScreen = ({ navigation }) => {
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [notificationData, setNotification] = useState([])
    const [isEmpty, setIsEmpty] = useState(false);

    const [enquiryNotification, { }] = useMutation(GET_ENQUIRY_QUERY)
    
    const { notificationTitle, emptyNotification,quantityLabel,quantityText, bidPrice } = useContext(AuthContext)

    useEffect(() => {
        setIsFetch(false);
        setLoadingIndicator(true);
    }, [])

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            setIsFetch(false);
            setLoadingIndicator(true);
            return () => {
                isActive = false;
            };
        }, [])
    )

    const onPressBack = () => {
        navigation.goBack();
    }

    const handleClickedNotification = async (data) => {
        try {
            if (data?.RedirectPage === 'lotDetail') {
                navigation.navigate('ViewLotDetailsScreen', { lotId: data?.NotificationId, updateNotificationId: data.Id, notificationViewed: true });
            } else if (data?.RedirectPage === "enquiryDetail") {
                const { data: { getenquiriesById = [] } = {} } = await enquiryNotification({ variables: { id: data?.NotificationId } })
                if (getenquiriesById?.length > 0) {
                    navigation.navigate('ViewResponseEnquiryScreen', { details: getenquiriesById[0], updateNotificationId: data.Id, notificationViewed: true })
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const updateLoading = (isloading) => {
        setIsFetch(true);
        setLoadingIndicator(isloading);
    }

    const updateDate = (list) => {
        console.log("notificationList",list);
        setLoadingIndicator(false);
        setIsFetch(true);
        const tempArray = list;
        if (tempArray?.length == 0) {
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
        }
        setNotification(tempArray);
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
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{notificationTitle}</Text>
                </View>
            </View>

            <View style={styles.view_main}>
                {(isEmpty && isFetch) && (
                    <View style={{marginVertical:20}}>
                        <Text style={styles.text_empty}>{emptyNotification}</Text>
                    </View>
                )}
                <View style={styles.view_table}>
                    <FlatList
                        style={{ marginTop: 10, flex: 1, marginBottom: 10, }}
                        data={notificationData}
                        numColumns={1}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => item.Id}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity onPress={() => handleClickedNotification(item)} style={styles.itemCard}>
                                    <View style={{justifyContent:"center"}}>
                                        <Image style={styles.image_Icon}
                                            source={item.RedirectPage === 'enquiryDetail' ? images?.NOTIFICATIONLOGO : images?.BIDIMAGE  }
                                            resizeMode={'contain'}></Image>
                                    </View>
                                    <View style={{marginLeft:10,width:2,height:60,borderColor:"green",backgroundColor:'green',}}></View>
                                    <View style={{ marginLeft:10,width:'90%'}}>
                                        <Text style={styles.notificationTitle}>{item?.CommodityChild}</Text>
                                       <View style={{}}>
                                       <Text style={styles.notificationBody}>{`${quantityText} : ${item?.Quantity}`}</Text>
                                       {item?.BidPrice && <Text style={styles.notificationBody}>{`${bidPrice} :  ₹ ${item?.BidPrice}`}</Text>}
                                       </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </View>
            </View>

            {(!isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Notification'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
            {loadingIndicator && <Loading />}
        </View>
    )
}

export default NotificationScreen

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
    view_main: {
        alignItems: 'center',
        width: '100%',
    },
    view_table: {
        marginTop: 20,
        width: '90%',
        height: '93%',
        marginBottom:10,
    },
    itemCard: {
        marginHorizontal: 7,
        marginVertical: 5,
        flexDirection: 'row',
        padding: 10,
        borderRadius: 5,
        backgroundColor: colors.white_color,
        shadowColor: "#000000",
        shadowOffset: { width: 1, height: 0 }, // change this for more shadow
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    notificationTitle: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color,
        width: "90%"
    },
    notificationBody: {
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: colors.text_Color
    },
    image_Icon: {
        width: 40,
        height: 40,
        // marginLeft: 20,
    },
    text_empty:{
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color
    }
})
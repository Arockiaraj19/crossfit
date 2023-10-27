import React, { useEffect } from 'react'
import { View, StyleSheet, Pressable, TouchableOpacity, Image, Text, } from 'react-native';
import { colors, fonts,images } from '../core';
import moment from 'moment';
import { useContext } from 'react';
import { AuthContext } from './AuthContext';
const BidsListComponents = ({
    props,
    isBottom,
    isAccept,
    StatuName,
    editBidsInfo,
    biddedOn,
    productPrice,
    bidPrice,
    pickup,
    editBits,
    viewLot,
    onPressViewLot,
    onPressPlaceEdit,
    onPressBitDelete,
    onPressAccept,
    onPressDecline,
    onPressMakeCall,
    deleteBits,
    acceptBit,
    declineBit,
}) => {
    
    const {quantityText,weightPlaceholder} = useContext(AuthContext)

    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }

    return (
        <View style={[styles.container]}>
            <Pressable style={[styles.view_inner, { backgroundColor: (props.Status == '1') ? '#d2f2e2' : ((props.Status == '3') ? '#fbc5c5' : '#d2d6f7') }]}
                >
                <View style={styles.view_header}>
                    <View style={[styles.viewPending, { backgroundColor: (props.Status == '1') ? colors.white_color : ((props.Status == '3') ? '#efa6a6' : '#b4b9e9') }]}>
                        <Text style={[styles.text_pending, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>
                            {/* {(props.Status == '1') ? 'Open' : ((props.Status == '3') ? 'Declined' : ((props.Status == '4') ? 'Partial Bid' : 'Approved'))} */}
                            {StatuName ? StatuName : (props?.Code ? props?.Code :  props?.StatusValue) }
                        </Text>
                    </View>
                    <Text style={styles.task_date}>{biddedOn + ' ' + dateConvert(props.CreatedOn)}</Text>
                </View>
                <View style={styles.view_subInner}>
                    <Image style={[styles.image_view, { borderColor: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}
                        source={{ uri: props.CommodityChildURL }}>
                    </Image>
                    <View style={styles.view_info}>
                        <Text style={styles.task_name}>{props.CommodityChildName}</Text>
                        <View style={{width: '99%', padding: 3, alignItems: 'center',}}>
                       <View style={{width: '100%', marginTop: 5,borderWidth: 1, borderColor: '#fff', borderRadius:4,}}>
                        <View style={[styles.view_price, { height: 35, width: '90%', marginTop: 5, marginLeft: 15, }]}>
                            <View style={{ width: '35%', height: 35, justifyContent: 'center', }}>
                                <Text style={[styles.text_askprice, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{quantityText}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                 <Text style={styles.text_askamount}>{`${weightPlaceholder} : ${props.LotQuantityValue} ${props.LotQuantityCode} `}</Text>
                            </View>
                        </View>
                        <View style={[styles.view_price, { height: 35, width: '90%', marginTop: 5, marginLeft: 15, }]}>
                            <View style={{ width: '35%', height: 35, justifyContent: 'center', }}>
                                <Text style={[styles.text_askprice, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{productPrice}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                <Text style={styles.text_askamount}>{'₹ ' + props.AskingPrice + ' / ' + props.LotQuantityCode}</Text>
                            </View>
                        </View>
                        </View>
                        <View style={{width: '100%', marginTop: 5,borderWidth: 1, borderColor: '#fff', borderRadius:4,}}>
                        <View style={[styles.view_price, { height: 35, width: '90%', marginTop: 5, marginLeft: 15, }]}>
                            <View style={{ width: '35%', height: 35, justifyContent: 'center' }}>
                                 <Text style={[styles.text_askprice, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{quantityText}</Text>    
                            </View>
                            <View style={styles.view_askamount}>
                                 <Text style={styles.text_askamount}>{`${weightPlaceholder} : ${props.QuantityValue} ${props.QuantityCode} `}</Text>
                            </View>
                        </View>
                        <View style={[styles.view_price, { height: 35, width: '90%', marginTop: 5, marginLeft: 15, }]}>
                            <View style={{ width: '35%', height: 35, justifyContent: 'center', }}>
                               <Text style={[styles.text_askprice, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{bidPrice}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                 <Text style={styles.text_askamount}>{'₹ ' + props.BidPrice + ' / ' +  props.QuantityCode}</Text>
                            </View>
                        </View>
                        </View>
                        </View>
                    </View>
                </View>
                <View style={[styles.view_address, { marginBottom: (isBottom) ? 1 : ((isAccept) ? 1 : 15) }]}>
                    <View style={styles.view_pickup}>
                        <Text style={styles.text_pickup}>{pickup}</Text>
                    </View>
                    <Text style={[styles.text_address, {width: (isAccept ? '58%' : '68%') }, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{props.AddressInfo}</Text>
                   {isAccept && <View style={{ marginLeft: 15, marginTop: 10, width: 0, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: 40, height: 40 }}
                            onPress={onPressMakeCall}>
                            <Image style={{ width: 40, height: 40 }}
                                source={images.PHONEICON}>
                            </Image>
                        </TouchableOpacity>
                    </View> }
                </View>
                {isBottom && (
                    <View style={styles.view_bottom}>
                        {((props.Status == '2' || props.Status == '3') ? 
                        <View style={{ width: '100%', height: 100, flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, borderBottomRightRadius: 6, width: '100%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                            onPress={() =>
                                onPressViewLot(props)}>
                            <Text style={styles.text_edit}>{viewLot}</Text>
                        </TouchableOpacity>
                        </View> : <View style={{ width: '100%', height: 100, flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, backgroundColor: (props.Status == '1') ? '#57ae82' : ((props.Status == '3') ? '#bf5d5d' : '#5d67be') }]}
                            onPress={() =>
                                onPressPlaceEdit(props)}>
                            <Text style={styles.text_edit}>{editBits}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.view_edit, { width: '33.4%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                            onPress={() =>
                                onPressViewLot(props)}>
                            <Text style={styles.text_edit}>{viewLot}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomRightRadius: 6, backgroundColor: (props.Status == '1') ? '#97dfbb' : ((props.Status == '3') ? '#e69292' : '#8b95ef') }]}
                            onPress={() =>
                                onPressBitDelete(props, 3)}>
                            <Text style={styles.text_edit}>{deleteBits}</Text>
                        </TouchableOpacity>
                        </View>
                        )}
                        
                    </View>
                )}
                {(isAccept && props.Status == '1') && (
                    <View style={[styles.view_bottom, { alignItems: 'center', marginBottom: 5, justifyContent: 'space-evenly' }]}>
                        <TouchableOpacity style={{ width: '43%', height: 35, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(1, 165, 82, 0.2)' }}
                            onPress={() =>
                                onPressAccept(props)}>
                            <Text style={[styles.text_accept, { color: colors.landing_background }]}>{acceptBit}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: '43%', height: 35, borderRadius: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(249, 97, 97, 0.2)' }}
                            onPress={() =>
                                onPressDecline(props)}>
                            <Text style={[styles.text_accept, { color: '#f96161' }]}>{declineBit}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                {(isAccept && props.Status != '1') && (
                    <View style={{ width: '100%', height: 15, }}>
                    </View>
                )}
            </Pressable>
        </View>
    );
};

export default BidsListComponents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    view_inner: {
        marginTop: 10,
        width: '90%',
        borderRadius: 6,
        // overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 7
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    view_header: {
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        height: 24,
    },
    viewPending: {
        marginLeft: 10,
        maxWidth: 120,
        minWidth: 80,
        height: 30,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        backgroundColor: 'pink',
    },
    text_pending: {
        textAlign: 'center',
        marginLeft: 5,
        marginRight: 7,
        fontSize: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a552',
    },
    task_date: {
        position: 'absolute',
        right: 15,
        fontSize: 10,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: '#01a552',
    },
    view_subInner: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    view_info: {
        width: '78%',
        justifyContent: 'space-evenly',
        marginBottom: 5,
        padding:5
    },
    image_view: {
        marginLeft: 15,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        backgroundColor: colors.white_color,
    },
    task_name: {
        marginLeft: 15,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_BOLD,
        color: colors.text_Color,
    },
    view_price: {
        width: '100%',
    },
    text_askprice: {
        fontSize: 13,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a552',
    },
    view_askamount: {
        height: 32,
        width: '63%',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15ae82',
        borderRadius: 4,
    },
    text_askamount: {
        flexWrap: 'wrap',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 11,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.white_color,
    },
    view_address: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
    },
    view_bottom: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
    },
    view_pickup: {
        marginLeft: 15,
        width: 70,
        height: 30,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white_color,
    },
    text_pickup: {
        fontSize: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        color: '#15ae82',
        textAlign: 'center',
    },
    text_address: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        fontSize: 11,
        width: '68%',
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: '#01a552',
    },
    view_edit: {
        width: '33.3%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_edit: {
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.white_color,
    },
    text_accept: {
        fontSize: 15,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        color: colors.white_color,
    },
});

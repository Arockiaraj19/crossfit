import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground, } from 'react-native';
import { colors, fonts, images } from '../core';
import moment from 'moment';

const SellerInfoCompnents = ({
    props,
    isLot,
    lotAddedOn,
    productPrice,
    headerViewInfo,
    onPressSelectBid,
    quantityText
}) => {

    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format((isLot) ? "DD MMM YYYY" : "MMM, DD YYYY")
        return momentObj
    }
    return (
        <View>
            {props.isSelected ?
                (
                    <View 
                    style={[styles.container,
                    ]}
                    >
                        {headerViewInfo()}
                        
                    </View>
                ) : (

                    <View style={styles.container}>
                        <TouchableOpacity style={[styles.view_main, { backgroundColor: colors.white_color, }]}
                            onPress={() => onPressSelectBid(props)}>
                            <Text style={styles.label_date}>{lotAddedOn + ' ' + dateConvert(props.CreatedOn)}</Text>
                            <Text style={styles.label_price}>{(isLot) ? `${quantityText} : ${props.Quantity}` : `${props.UnitQuantity} ${props.QuantityCode}` }</Text>
                            <Text style={[styles.label_price, { marginTop: 3, }]}>{(isLot) ? `${productPrice} : ₹${props.SellerPrice} / ${props.QuantityCode}` : productPrice + ' ' + dateConvert(props.DeliveryOn)}</Text>
                            <View style={styles.view_name}>
                                <Text style={styles.label_name}><Text style={styles.label_name}>{props.CommodityChild}</Text>
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
        </View>
    );
};

export default SellerInfoCompnents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        // height: 120,
        marginTop: 5,
        marginBottom: 5,
    },
    view_main: {
        alignItems: 'center',
        width: '92%',
        borderRadius: 5,
        shadowColor: 'lightgray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    label_date: {
        marginTop: 10,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 11,
        color: 'gray'
    },
    label_price: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: colors.text_Color,
    },
    view_name: {
        marginTop: 10,
        height: 30,
        backgroundColor: 'lightgray',
        // padding:20,
        justifyContent: 'center',
        marginBottom: 15,
        borderRadius: 15,
    },
    label_name: {
        marginLeft: 15,
        marginRight: 15,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 15,
        color: colors.text_Color,
    },
});

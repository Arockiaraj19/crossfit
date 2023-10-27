import React, { useEffect } from 'react'
import { View, StyleSheet, Text, Pressable } from 'react-native';
import { colors, fonts } from '../core';
import moment from "moment";

const BidsInfoComponents = ({
    props,
    organic,
    productPrice,
    onPressSelectBid,
    gradeText,
    headerViewInfo
}) => {

    const dateConvert=(dateInfo)=> {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }
    return (
        <View>
            {props.isSelected ? (
                <View style={[styles.container,{}]}>
                 {headerViewInfo()}
                </View>
            )  : 
            <Pressable style={[styles.container,{}]}
            onPress={()=> 
                onPressSelectBid(props)}>
            <View style={styles.view_top}>
                <View style={styles.view_topInner}>
                    <View style={styles.view_circule}>
                        <View style={{ width: '27%', height: 90, marginLeft: '12%', marginTop: 50, }}>
                            <Text style={styles.text_grade}>{gradeText + ' : ' + props.GradeValue }</Text>
                            {(props.IsOrganic == 1) && (
                                <View style={ styles.view_organic }>
                                    <Text style={styles.text_organic}>{organic}</Text>
                                </View>
                            )}
                            <Text style={styles.text_ask}>{productPrice}</Text>
                            <Text style={styles.text_price}>{'₹ ' + props.SellerPrice}</Text>
                        </View>
                        
                    </View>
                </View>
            </View>
            <View style={styles.view_box}>
                <View style={{ width: '48%', height: '100%',}}>
                <Text style={styles.text_date}>{ dateConvert(props.CreatedOn)}</Text>
                <Text style={styles.text_location}>{props.AddressInfo}</Text>
               
                <View style={styles.view_weight}>
                    <Text style={styles.text_weight}>{props.Quantity}</Text>
                </View>
                </View>
            </View>
        </Pressable>
            }
        </View>
    );
};

export default BidsInfoComponents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        // height: 120,
        marginTop: 5,
        marginBottom: 5,
        // overflow: 'hidden',
    },
    view_top: { 
        width: '92%', 
        height: 110, 
        borderRadius: 6, 
        backgroundColor: colors.white_color,
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
        height: 110, 
        borderRadius: 6, 
        backgroundColor: colors.white_color,
        overflow: 'hidden', 
    },
    view_circule: { 
        marginTop: -50, 
        marginLeft: '40%', 
        width: '150%', 
        height: 500, 
        borderRadius: 250, 
        backgroundColor: '#e2e2e2' 
    },
    view_box: {
        width: '100%', 
        height: 110, 
        position: 'absolute', 
        right: 0,
    },
    text_date: {
        marginTop: 10,
        marginLeft: 25,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.text_Color,
    },
    text_location: {
        marginTop: 2,
        marginLeft: 25,
        height: 55,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 11,
        color: colors.text_Color,
    },
    view_weight: { 
        height: 24, 
        backgroundColor: '#e2e2e2', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 4, 
        position: 'absolute', 
        bottom: 5, 
        right: 10,
    },
    text_weight: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
    },
    text_ask: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
        position: 'absolute',
        right: 10,
        bottom: 25,
    },
    text_price: {
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 16,
        color: colors.text_Color,
        position: 'absolute',
        right: 10,
        bottom: 5,
    },
    view_organic: {
        position: 'absolute', 
        right: 10, 
        top: 25, 
        borderRadius: 10, 
        justifyContent: 'center', 
        alignItems: 'center',
        width: 55, 
        height: 15, 
        backgroundColor: '#d2f2e2' 
    },
    text_organic: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 11,
        color: '#01a552',
    },
    text_grade: {
        position: 'absolute',
        right: 10,
        top: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 11,
        color: colors.text_Color,
    },
});
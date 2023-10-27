import React, { useEffect } from 'react'
import { View, StyleSheet, Pressable, TouchableOpacity, Image, Text, } from 'react-native';
import { colors, fonts, images } from '../core';
import moment from 'moment';
import Share from 'react-native-share';

const EnquiryInfoComponents = ({
    props,
    bidView,
    availableQuality,
    updateon,
    gradeText,
    DeliveryOn,
    editEnquiry,
    deleteEnquiryText,
    viewResponses,
    onPressLotEdit,
    onPressLotDelete,
    onPressEnquiryDetail,
}) => {

    const dateConvert = (dateInfo, dateformat) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format(dateformat)
        return momentObj
    }
    const onPressEnquiryClick = (info) => {
        if (props.ResponseCount > 0) {
            onPressEnquiryDetail(info)
        }
    }
    const onShareClick=(info)=>{
        console.log(info);
  
        const messageContent = `Item: ${info.CommodityChild}\nQuantity: ${info.Quantity}\nAddress: ${info.AddressInfo}\n`;
         const shareOptions = {
            title: "Lot",
            message: messageContent,
            url: info.CommodityChildImageURL,
            type: 'image/jpeg' || 'image/png',
        }
        Share.open(shareOptions)
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                err && console.log(err);
            }); 
    }
    return (
        <View style={[styles.container]}>
            <Pressable style={[styles.view_inner, { backgroundColor: (props.Status == '1') ? '#d2f2e2' : ((props.Status == '3') ? '#fbc5c5' : '#d2d6f7') }]}
                onPress={() =>
                    onPressEnquiryClick(props)
                }>
                    
                <View style={styles.view_header}>
                <TouchableOpacity style={styles.view_share}
                        onPress={()=>
                        onShareClick(props)}>
                       <Image style={{ width: 20, height: 20 }}
                                source={images.SHAREIMAGE}>
                            </Image>
                    </TouchableOpacity>
                    <Text style={styles.task_date}>{updateon + ' ' + dateConvert(props.CreatedOn, "DD MMM YYYY")}</Text>
                </View>
                <View style={styles.view_subInner}>
                    <View style={styles.view_MainImage}>
                        <View style={styles.view_image}>
                            <Image style={[styles.image_view, { borderColor: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}
                                source={{ uri: props.CommodityChildImageURL }}>
                            </Image>
                        </View>
                    </View>
                    <View style={styles.view_info}>
                        <Text style={styles.task_name}>{props.CommodityChild}</Text>
                        <View style={{margin: 6 , width: '97%' , borderWidth: 1, borderColor: '#fff', borderRadius:4}}>
                        <View style={[styles.view_price, { width: '90%', marginTop: 5, marginLeft: 15, marginBottom: 5, alignItems: 'center', }]}>
                            <View style={{ width: '35%', justifyContent: 'center' }}>
                                <Text style={styles.text_askprice}>{gradeText}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                <Text style={styles.text_askamount}>{props.GradeValue}</Text>
                            </View>
                        </View>
                        <View style={[styles.view_price, { width: '90%', height: 35, marginLeft: 15, marginBottom: 5, alignItems: 'center', }]}>
                            <View style={{ maxWidth: '35%', height: 35, justifyContent: 'center' }}>
                                <Text style={styles.text_askprice}>{availableQuality}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                <Text style={styles.text_askamount}>{props.UnitQuantity + ' ' + props.QuantityCode}</Text>
                            </View>
                        </View>
                        <View style={[styles.view_price, { width: '90%', height: 35, marginLeft: 15, marginBottom: 5, alignItems: 'center', }]}>
                            <View style={{ width: '35%', justifyContent: 'center' }}>
                                <Text style={styles.text_askprice}>{DeliveryOn}</Text>
                            </View>
                            <View style={styles.view_askamount}>
                                <Text style={styles.text_askamount}>{dateConvert(props.DeliveryOn, "MMM, DD YYYY")}</Text>
                            </View>
                        </View>
                        </View>
                    </View>
                </View>
                <View style={styles.view_address}>
                    <Text style={[styles.text_address, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{props.AddressInfo}</Text>
                </View>
                <View style={styles.view_bottom}>
                    <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, backgroundColor: (props.Status == '1') ? '#57ae82' : ((props.Status == '3') ? '#bf5d5d' : '#5d67be') }]}
                        onPress={() =>
                            onPressLotEdit(props)}>
                        <Text style={styles.text_edit}>{editEnquiry}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.view_edit, { width: '33.4%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                        onPress={() =>
                            onPressEnquiryClick(props)}>
                        <Text style={styles.text_edit}>{viewResponses + '(' + props.ResponseCount + ')'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.view_edit, { borderBottomRightRadius: 6, backgroundColor: (props.Status == '1') ? '#97dfbb' : ((props.Status == '3') ? '#e69292' : '#8b95ef') }]}
                        onPress={() =>
                            onPressLotDelete(props)}>
                        <Text style={styles.text_edit}>{deleteEnquiryText}</Text>
                    </TouchableOpacity>
                </View>
            </Pressable>
        </View>
    );
};

export default EnquiryInfoComponents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    view_inner: {
        marginTop: 10,
        width: '96%',
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
    },
    view_share: {
        marginLeft: 5,
    },
    task_date: {
        position: 'absolute',
        right: 15,
        top: 5,
        fontSize: 11,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: '#01a552',
    },
    view_subInner: {
        marginTop: 25,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    view_info: {
        width: '78%',
        justifyContent: 'space-evenly',
    },
    view_MainImage: {
        marginLeft: 15,
        width: 60,
        height: 80,
        alignItems: 'center',
    },
    view_image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.white_color,
    },
    image_view: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    task_name: {
        marginLeft: 15,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_BOLD,
        color: colors.text_Color,
    },
    view_price: {
        flexDirection: 'row',
        width: '100%',
        height: 25,
    },
    text_askprice: {
        width: 80,
        flexWrap: 'wrap',
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a552',
    },
    view_askamount: {
        paddingTop: 5,
        paddingBottom: 5,
        width: '61%',
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15ae82',
        borderRadius: 4,
    },
    text_askamount: {
        marginLeft: 10,
        marginRight: 10,
        fontSize: 11,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.white_color,
    },
    view_address: {
        width: '100%',
        // alignItems: 'center',
        // flexDirection: 'row',
    },
    view_bottom: {
        width: '100%',
        height: 40,
        flexDirection: 'row',
    },
    text_address: {
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 11,
       flexWrap: 'wrap',
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
        textAlign: 'center',
        fontSize: 11,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.white_color,
    },
});


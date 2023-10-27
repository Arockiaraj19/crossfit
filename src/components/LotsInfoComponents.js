import React, { useContext, useEffect } from 'react'
import { View, StyleSheet, Pressable, TouchableOpacity, Image, Text, } from 'react-native';
import { colors, fonts, images } from '../core';
import moment from 'moment';
import Share from 'react-native-share';
import { AuthContext } from './AuthContext';

const LotsInfoComponents = ({
    props,
    bidView,
    organic,
    share,
    StatuName,
    editBidsInfo,
    updateon,
    productPrice,
    pickup,
    editLot,
    deleteLotInfo,
    onPressLotEdit,
    onPressLotDelete,
    onPressLotDetail,
}) => {
    
   const {quantityLabel,quantityText,weightPlaceholder} = useContext(AuthContext)
    const dateConvert = (dateInfo) => {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }
    const onPressLotClick=(info)=> {
        if(props.BidCount > 0){
            onPressLotDetail(info)
        }
    }
    const onShareClick=(info)=>{
        console.log(info);
       
        const messageContent = `Item: ${info.CommodityChild}\nAsking Price: ${info.SellerPrice} / ${info.Quantity}\nAddress: ${info.AddressInfo}\n`
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
            <Pressable style={[styles.view_inner, { backgroundColor: (props.Status == '1') ? '#d2f2e2' : ( (props.Status == '3') ? '#fbc5c5' : '#d2d6f7')}]}
                onPress={() => 
                    onPressLotClick(props)
                    }>
                <View style={styles.view_header}>
                <View style={[styles.viewPending, { backgroundColor: (props.Status == '1') ? colors.white_color : ( (props.Status == '3') ? '#efa6a6' : '#b4b9e9')}]}>
                    {/* {console.log('StatuNameStatuNameStatuName', StatuName)} */}
                    <Text style={[styles.text_pending, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}>
                        {/* {(props.Status == '1') ? 'Open' : ( (props.Status == '3') ? 'Declined' : ((props.Status == '4') ? 'Partially Approved' : 'Approved'))} */}
                        {StatuName ? StatuName : (props?.Code ? props?.Code :  props?.StatusValue) }
                        </Text>
                </View>
                <TouchableOpacity style={styles.view_share}
                        onPress={()=>
                        onShareClick(props)}>
                       <Image style={{ width: 20, height: 20 }}
                                source={images.SHAREIMAGE}>
                            </Image>
                    </TouchableOpacity>
                <Text style={styles.task_date}>{ updateon +' '+ dateConvert(props.CreatedOn)}</Text>
                
                </View>
                <View style={styles.view_subInner}>
                    <View style={styles.view_MainImage}>
                        <View style={styles.view_image}>
                            <Image style={[styles.image_view, { borderColor: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}
                                source={{ uri: props.CommodityChildImageURL }}>
                            </Image>
                        </View>
                        {props.IsOrganic == 1 && (
                            <Text style={styles.text_organic}>{organic}</Text>
                        )}
                    </View>
                    <View style={[styles.view_info,{marginLeft:5}]}>
                        <Text style={styles.task_name}>{props.CommodityChild}</Text>
                        <View></View>
                        <View style={[styles.view_price, {flexDirection:'column',justifyContent:'space-between', width: '90%',padding:10, marginTop: 5, marginLeft: 15, marginBottom: 5, }]}>
                        <View style={styles.price_container}>
                            <View style={{justifyContent: 'center',width:"35%" }}>
                                <Text style={styles.text_askprice}>{quantityText}</Text>
                            </View>
                            <View style={styles.view_askamounts}>
                                <Text style={styles.text_askamount}>{`${weightPlaceholder ? weightPlaceholder  : 'Weight'} : ${props.UnitQuantity} ${props.QuantityCode}`}</Text>
                            </View>
                            </View>
                           
                            <View style={styles.price_container}>
                            <View style={{justifyContent: 'center',width:"35%" }}>
                                <Text style={styles.text_askprice}>{productPrice}</Text>
                            </View>
                            <View style={styles.view_askamounts}>
                                <Text style={styles.text_askamount}>{'₹ ' + props.SellerPrice + ' / ' + ' ' + props.QuantityCode}</Text>
                            </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.view_address}>
                    <View style={styles.view_pickup}>
                        <Text style={styles.text_pickup}>{pickup}</Text>
                    </View>
                    <Text style={[styles.text_address, { color: (props.Status == '1') ? '#01a552' : ((props.Status == '3') ? '#f43939' : '#3b49ca') }]}>{props.AddressInfo}</Text>
                </View>
                {(props.Status == '2') ?
                    <View style={styles.view_bottom}>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, borderBottomRightRadius: 6, width: '50%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                            onPress={() =>
                                onPressLotClick(props)}>
                            <Text style={styles.text_edit}>{bidView + '(' + props.BidCount + ')'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, borderBottomRightRadius: 6, width: '50%', backgroundColor: '#727ddc' }]}
                            onPress={() =>
                                onShareClick(props)}>
                            <Text style={styles.text_edit}>{share}</Text>
                        </TouchableOpacity>
                    </View> : ((props.Status == '4') ? <View style={styles.view_bottom}>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, width: '50%', backgroundColor: (props.IsLotEditable == '0') ? '#d3d3d3' : (props.Status == '1') ? '#57ae82' : ((props.Status == '3') ? '#bf5d5d' : '#5d67be') }]}
                            onPress={() =>
                                props.IsLotEditable == '1' ? onPressLotEdit(props) : undefined}>
                            <Text style={styles.text_edit}>{editLot}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.view_edit, { borderBottomRightRadius: 6, width: '50%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                            onPress={() =>
                                onPressLotClick(props)}>
                            <Text style={styles.text_edit}>{bidView + '(' + props.BidCount + ')'}</Text>
                        </TouchableOpacity>
                    </View> :
                        <View style={styles.view_bottom}>
                            <TouchableOpacity style={[styles.view_edit, { borderBottomLeftRadius: 6, backgroundColor: (props.IsLotEditable == '0') ? '#d3d3d3' : (props.Status == '1') ? '#57ae82' : ((props.Status == '3') ? '#bf5d5d' : '#5d67be') }]}
                                onPress={() =>
                                    props.IsLotEditable == '1' ? onPressLotEdit(props) : undefined}>
                                <Text style={styles.text_edit}>{editLot}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.view_edit, { width: '33.4%', backgroundColor: (props.Status == '1') ? '#7bc9a2' : ((props.Status == '3') ? '#d97f7f' : '#727ddc') }]}
                                onPress={() =>
                                    onPressLotClick(props)}>
                                <Text style={styles.text_edit}>{bidView + '(' + props.BidCount + ')'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.view_edit, { borderBottomRightRadius: 6, backgroundColor: (props.Status == '1') ? '#97dfbb' : ((props.Status == '3') ? '#e69292' : '#8b95ef') }]}
                                onPress={() =>
                                    onPressLotDelete(props)}>
                                <Text style={styles.text_edit}>{deleteLotInfo}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
            </Pressable>
        </View>
    );
};

export default LotsInfoComponents;

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
    view_share: {
        marginLeft: 15,
    },
    view_info: {
        width: '78%',
        justifyContent: 'space-evenly',
        marginBottom: 5,
        borderRadius:4,
        // backgroundColor: "#fff",
        // height: 180
    },
    view_MainImage: {
        marginLeft: 15,
        width: 60,
        height: 120,
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
    text_organic: {
        textAlign: 'center',
        fontSize: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        color: '#01a552',
    },
    task_name: {
        marginLeft: 15,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_BOLD,
        color: colors.text_Color,
    },
    view_price: {
        width: '100%',
        borderWidth: 1,
         borderColor: '#fff',
        borderRadius:4,
    },
    price_container:{
        flexDirection:"row" ,
        justifyContent:'space-between',
        marginTop:5
    },
    text_askprice: {
        flexWrap: 'wrap',
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a552',
    },
    view_askamounts: {
        width: '60%',
        height: 35,
        // position: 'absolute',
        // right: 0,
        // top: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#15ae82',
        borderRadius: 4,
    },
    view_askamount: {
        width: '63%',
        height: 35,
        // position: 'absolute',
        // right: 0,
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
});

// import React, { useEffect } from 'react'
// import { View, StyleSheet, TouchableOpacity, Image, Text, } from 'react-native';
// import { colors, fonts } from '../core';
// import moment from 'moment';
// const LotsInfoComponents = ({
//     props,
//     isMyBid,
//     editBidsInfo
// }) => {

//     const dateConvert=(dateInfo)=> {
//         const date = new Date(dateInfo);
//         let momentObj = moment(date).format("DD MMM YYYY")
//         return momentObj
//     }
//     return (
//         <View style={[styles.container]}>
//             <View style={[styles.view_inner, { backgroundColor: (props.Status == '1') ? '#d2f2e2' : ( (props.Status == '3') ? '#fbc5c5' : '#d2d6f7')}]}>
//                 <View style={styles.view_subInner}>
//                 <View style={styles.view_top}>
//                     <Text style={styles.task_date}>{ dateConvert(props)}</Text>
//                     <View style={[styles.view_circle, { backgroundColor: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]} />
//                 </View>
//                 <View style={styles.view_info}>
//                     <Image style={[styles.image_view, { borderColor: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}
//                         source={{ uri: (isMyBid) ? props.CommodityChildImageURL : props.CommodityChildImageURL }}>
//                     </Image>
//                     <View style={styles.view_detail}>
//                         <Text style={[styles.text_name, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}>
//                             {props.CommodityChild}
//                         </Text>
//                         <View style={styles.view_price}>
//                             <View style={{ marginLeft: 10, justifyContent: 'center', height: 24, backgroundColor: colors.white_color, borderRadius: 5 }}>
//                                 <Text style={[styles.text_price, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')} ]}>
//                                     {props.Quantity}
//                                     </Text>

//                             </View>
//                             <View style={{ justifyContent: 'center', marginLeft: 10, height: 24, backgroundColor: colors.white_color, borderRadius: 5 }}>
//                                 <Text style={[styles.text_price, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}>
//                                     {'₹ ' + props.SellerPrice}
//                                     </Text>
//                             </View>
//                         </View>
//                         <Text style={[styles.text_address, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}>{props.AddressInfo}</Text>
//                         <View style={[styles.viewPending, { backgroundColor: (props.Status == '1') ? colors.white_color : ( (props.Status == '3') ? '#efa6a6' : '#b4b9e9')}]}>
//                             <Text style={[styles.text_pending, { color: (props.Status == '1') ? '#01a552' : ( (props.Status == '3') ? '#f43939' : '#3b49ca')}]}>
//                                 {(props.Status == '1') ? 'Pending' : ( (props.Status == '3') ? 'Closed' : 'Sold Out')}
//                                 </Text>
//                         </View>
//                     </View>
//                 </View>
//                 </View>
//             </View>
//         </View>
//     );
// };

// export default LotsInfoComponents;

// const styles = StyleSheet.create({
//     container: {
//         alignItems: 'center',
//         width: '100%',
//         height: 130,
//         marginBottom: 10,
//     },
//     view_inner: {
//         marginTop: 10,
//         width: '90%',
//         height: 120,
//         borderRadius: 6,
//         // overflow: 'hidden',
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0, height: 7
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     view_subInner: {
//         width: '100%',
//         height: 120,
//         borderRadius: 6,
//         overflow: 'hidden',
//     },
//     view_top: {
//         width: '100%',
//         height: 24,
//         justifyContent: 'center',
//     },
//     view_circle: {
//         width: 24,
//         height: 24,
//         borderRadius: 12,
//         borderWidth: 5,
//         borderColor: colors.white_color,
//         position: 'absolute',
//         right: -5,
//         top: -2,
//     },
//     task_date: {
//         position: 'absolute',
//         right: 25,
//         top: 5,
//         fontSize: 12,
//         fontFamily: fonts.MONTSERRAT_REGULAR,
//         color: '#01a552',
//     },
//     view_info: {
//         width: '100%',
//         height: 90,
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     image_view: {
//         marginTop: -24,
//         marginLeft: 15,
//         width: 60,
//         height: 60,
//         borderRadius: 30,
//         borderWidth: 1,
//         backgroundColor: colors.white_color,
//     },
//     view_detail: {
//         width: '79%',
//         height: 100,
//         justifyContent: 'center',
//     },
//     text_name: {
//         marginTop: -20,
//         marginLeft: 10,
//         fontSize: 15,
//         fontFamily: fonts.MONTSERRAT_MEDIUM,
//         color: '#01a552',
//     },
//     view_price: {
//         marginTop: 5,
//         width: '100%',
//         height: 20,
//         flexDirection: 'row',
//     },
//     text_price: {
//         marginLeft: 10,
//         marginRight: 10,
//         fontSize: 12,
//         fontFamily: fonts.MONTSERRAT_REGULAR,
//         color: '#01a552',
//     },
//     text_address: {
//         marginTop: 10,
//         marginLeft: 10,
//         fontSize: 12,
//         width: '68%',
//         fontFamily: fonts.MONTSERRAT_REGULAR,
//         color: '#01a552',
//     },
//     viewPending: {
//         height: 24,
//         borderTopLeftRadius: 5,
//         borderBottomLeftRadius: 5,
//         justifyContent: 'center',
//         position: 'absolute',
//         right: 0,
//         bottom: 20,
//         backgroundColor: 'pink',
//     },
//     text_pending: {
//         marginLeft: 10,
//         marginRight: 7,
//         fontSize: 12,
//         fontFamily: fonts.MONTSERRAT_MEDIUM,
//         color: '#01a552',
//     },
// });
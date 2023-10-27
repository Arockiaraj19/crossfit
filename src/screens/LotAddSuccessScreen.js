import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';

const LotAddSuccessScreen = ({ navigation, route }) => {

    const {
        successText,
        successLot,
        viewLot,
        backHome,
        gradeText,
        availableQuality,
        acres,
        productPrice,
    } = useContext(AuthContext);

    useEffect(() => {
        console.log('route?.paramsroute?.paramsroute?.params', route?.params);
    }, [])
    const onPressViewLotList = () => {
        navigation.navigate('ViewLotListScreen', { isProfile : false, productDetail: route?.params.productDetail, });
    }
    const onPressBackHome = () => {
        navigation.navigate('HomeScreen');
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{ width: '100%', height: '100%', }}>
                <View style={{  marginTop:  (Platform.OS == 'ios')? 80 : 20, marginBottom: 15, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.view_box}>
                        <View style={{ marginTop: 30, width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(1, 165, 82, 1.0)' }}>
                            <Image style={{ width: 30, height: 30 }}
                                source={images.TICKWHITEICON}>
                            </Image>
                        </View>
                        <Text style={styles.text_success}>{successText}</Text>
                        <Text style={styles.text_message}>{successLot}</Text>
                        <View style={{ marginTop: 25, borderRadius: 6, width: '80%', justifyContent: 'center', alignItems: 'center', height: 70, backgroundColor: '#f0efef' }}>
                            <Text style={styles.text_name}>{route?.params.productDetail.Name}</Text>
                            <Text style={styles.text_address}>{route?.params.address}</Text>
                        </View>
                        <View style={{ marginTop: 35, width: '80%', }}>
                            <Text style={styles.text_title}>{gradeText}</Text>
                            <Text style={styles.text_answer}>{route?.params.grade}</Text>
                        </View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{availableQuality}</Text>
                            <Text style={styles.text_answer}>{route?.params.lotDetail.Quantity}</Text>
                        </View>
                        {/* <View style={{ marginTop: 15, width: '80%', flexDirection: 'row',}}>
                    <Text style={styles.text_title}>{acres}</Text>
                    <Text style={styles.text_answer}>{''}</Text>
                </View> */}
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{productPrice}</Text>
                            <Text style={styles.text_answer}>{route?.params.lotDetail.SellerPrice}</Text>
                        </View>
                        <TouchableOpacity style={styles.view_lot}
                            onPress={onPressViewLotList}>
                            <Text style={[styles.text_back, { color: colors.landing_background }]}>{viewLot}</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.view_back}
                        onPress={onPressBackHome}>
                        <Text style={styles.text_back}>{backHome}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background_color,
    },
    view_box: {
        width: '90%',
        // height: '80%',
        alignItems: 'center',
        backgroundColor: colors.white_color,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 7
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    text_success: {
        marginTop: 15,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 20,
        color: colors.text_Color,
    },
    text_message: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.text_Color,
    },
    view_lot: {
        marginTop: 25,
        marginBottom: 25,
        minHeight: 40,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    view_back: {
        marginTop: 25,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: 'lightgray'
    },
    text_back: {
        marginLeft: 15,
        marginRight: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: colors.text_Color,
    },
    text_name: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 16,
        color: colors.text_Color,
    },
    text_address: {
        marginTop: 5,
        marginLeft: 15,
        marginRight: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.subText_Color,
    },
    text_title: {
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: colors.subText_Color,
    },
    text_answer: {
        marginTop: 10,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: colors.text_Color,
    },
});

export default LotAddSuccessScreen;


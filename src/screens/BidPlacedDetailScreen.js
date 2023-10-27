import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';

const BidPlacedDetailScreen = ({ navigation, route }) => {

    const {
        successText,
        successBid,
        bidView,
        backHome,
        gradeText,
        availableQuality,
        productPrice,
        requiredQuantity,
        bidPrice,
    } = useContext(AuthContext);

    useEffect(() => {
        console.log('routerouterouterouteroute', route.params);
    }, [])
    const onPressViewLotList = () => {
        navigation.navigate('BidsProductsScreen');
    }
    const onPressBackHome = () => {
        navigation.navigate('HomeScreen');
    }
    return (
        <View style={styles.container}>
            <ScrollView style={{  width: '100%', height: '100%', }}>
                <View style={{ marginTop: (Platform.OS == 'ios')? 80 : 20, marginBottom: 15, width: '100%', justifyContent: 'center', alignItems: 'center', }}>
                    <View style={styles.view_box}>
                        <View style={{ marginTop: 30, width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(1, 165, 82, 1.0)' }}>
                            <Image style={{ width: 30, height: 30 }}
                                source={images.TICKWHITEICON}>
                            </Image>
                        </View>
                        <Text style={styles.text_success}>{successText}</Text>
                        <Text style={styles.text_message}>{successBid}</Text>
                        <View style={{ marginTop: 15, borderRadius: 6, width: '80%', justifyContent: 'center', alignItems: 'center', height: 90, backgroundColor: '#f0efef' }}>
                            <Text style={styles.text_name}>{route?.params.details.Name}</Text>
                            <Text style={styles.text_address}>{route?.params.bidsDetails.AddressInfo}</Text>
                        </View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{gradeText}</Text>
                            <Text style={styles.text_answer}>{route?.params.bidsDetails.GradeValue}</Text>
                        </View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{availableQuality}</Text>
                            <Text style={styles.text_answer}>{route?.params.bidsDetails.Quantity}</Text>
                        </View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{productPrice}</Text>
                            <Text style={styles.text_answer}>{'₹ ' + route?.params.bidsDetails.SellerPrice}</Text>
                        </View>
                        <View style={[styles.view_line]}></View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{requiredQuantity}</Text>
                            <Text style={styles.text_answer}>{route?.params.availableValue}</Text>
                        </View>
                        <View style={{ marginTop: 15, width: '80%', }}>
                            <Text style={styles.text_title}>{bidPrice}</Text>
                            <Text style={styles.text_answer}>{'₹ ' + route?.params.requestedPrice}</Text>
                        </View>

                        <TouchableOpacity style={styles.view_lot}
                            onPress={onPressViewLotList}>
                            <Text style={[styles.text_back, { color: colors.landing_background }]}>{bidView}</Text>
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
        backgroundColor: colors.background_color,
    },
    view_box: {
        width: '90%',
        alignItems: 'center',
        backgroundColor: colors.white_color,
        borderRadius: 6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
        marginTop: 15,
        minHeight: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        backgroundColor: 'lightgray'
    },
    text_back: {
        marginLeft: 10,
        marginRight: 10,
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
        padding: 1,
    },
    view_line: {
        marginTop: 15,
        width: '100%',
        height: 1,
        backgroundColor: '#f0f0f0'
    },
});

export default BidPlacedDetailScreen;


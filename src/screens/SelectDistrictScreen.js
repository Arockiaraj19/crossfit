import React, { useContext, useEffect } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts } from '../core';

const SelectDistrictScreen = ({ navigation, route }) => {

    const {
        myAddress,
        district,
        stepText,
        type,
        userState,
        next,
        placeholderDistrict,
    } = useContext(AuthContext);
    const [arrayOfDistrict, setArrayOfDistrict] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [isFetchType, setIsFetchType] = React.useState('District');
    const [addressDistrictId, setAddressDistrictId] = React.useState('');
    const [addressDistrict, setAddressDistrict] = React.useState('');

    useEffect(() => {

    }, [])

    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const updateLoading = (isloading) => {
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        setIsFetchType('');
        var templist = list;
        var tyepTemp = [];
        templist.map((typeInfo, i) => {
            var tempInfo = typeInfo;
            tempInfo.isSelected = false;
            if (route.params.isEdit != null && route.params.isEdit != undefined && route.params.isEdit == true) {
                if (tempInfo.Name == route.params.data.District) {
                    console.log("what is the item");

                    tempInfo.isSelected = true;
                    setAddressDistrictId(tempInfo.Id);
                    setAddressDistrict(tempInfo.Name);
                }



            }
            tyepTemp.push(tempInfo)
        })
        setArrayOfDistrict(tyepTemp);
    }
    const onPressSelectDistrict = (item) => {
        var templist = arrayOfDistrict;
        var tyepTemp = [];
        templist.map((typeInfo, i) => {
            var tempInfo = typeInfo;
            tempInfo.isSelected = (item.Id == tempInfo.Id) ? true : false;
            tyepTemp.push(tempInfo)
        })
        setAddressDistrictId(item.Id);
        setAddressDistrict(item.Name);
        setArrayOfDistrict(tyepTemp);
    }
    const onPressNextAction = () => {
        if (addressDistrictId == '') {
            Alert.alert('', placeholderDistrict, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            var params = route.params;
            params.addressDistrict = addressDistrict;
            params.addressDistrictId = addressDistrictId;
            navigation.navigate('SelectCityScreen', params);
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={myAddress}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={{ width: '100%', height: 60, flexDirection: 'row', backgroundColor: '#edeafc' }}>
                <View style={{ width: 50, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#998ceb' }}>
                    <Text style={styles.text_step}>{stepText}</Text>
                    <Text style={styles.text_step}>{'01'}</Text>
                </View>
                <View style={{ height: 60, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, }}>
                        <Text style={styles.text_title}>{type + '      : '}</Text>
                        <Text style={styles.text_state}>{route.params.addressType}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, marginRight: 10, }}>
                        <Text style={styles.text_title}>{userState + '     : '}</Text>
                        <Text style={styles.text_state}>{route.params.addressState}</Text>
                    </View>
                </View>
            </View>
            {(isFetchType == 'District') && (
                <DataFetchComponents
                    selectedId={route.params.addressStateId}
                    isType={'District'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
            <View style={{ marginTop: 15, width: '100%', height: 24, }}>
                <View style={styles.view_pageCount}>
                    <Text style={styles.text_pageCount}>{'2/4'}</Text>
                </View>
            </View>
            <View style={{ width: '100%', height: '70%', }}>
                <ScrollView style={{ width: '100%', height: '100%', }}>
                    <View style={{ marginTop: 25, width: '100%', marginBottom: 10, }}>
                        <Text style={styles.text_typeTitle}>{district}</Text>
                        <View style={styles.view_type}>
                            <View style={styles.view_typeBox}>
                                {arrayOfDistrict.map((data, index) => {
                                    return (
                                        <TouchableOpacity style={[styles.view_typeInner, { borderColor: (data.isSelected) ? '#01a552' : 'rgba(153, 153, 153, 0.2)' }]}
                                            onPress={() =>
                                                onPressSelectDistrict(data)
                                            }>
                                            <View style={{ marginLeft: 15, width: 20, height: 20, borderRadius: 10, borderWidth: (data.isSelected) ? 5 : 1.5, borderColor: (data.isSelected) ? '#01a552' : 'rgba(153, 153, 153, 1.0)' }}></View>
                                            <Text style={[styles.text_district, { color: (data.isSelected) ? '#01a552' : colors.text_Color }]}>{data.Name}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
            <TouchableOpacity style={styles.view_bottom}
                onPress={onPressNextAction}>
                <Text style={styles.text_next}>{next}</Text>
            </TouchableOpacity>
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
    view_pageCount: {
        width: 50,
        height: 24,
        borderRadius: 6,
        position: 'absolute',
        right: 20,
        backgroundColor: '#dddddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_pageCount: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 12,
        color: colors.text_Color,
    },
    text_step: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 12,
        color: colors.white_color,
    },
    text_typeTitle: {
        marginLeft: 20,
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.text_Color,
    },
    view_type: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        width: '90%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5
    },
    view_typeBox: {
        alignItems: 'center',
        marginTop: 0,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 15,
        paddingTop: 10,
        paddingBottom: 5,
        width: '95%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_typeInner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 0.2)',
        width: '95%',
        height: 40,
    },
    text_type: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 10,
        color: '#666666',
    },
    view_StateInner: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'transparent',
        // width: 80, 
        //height: 100, 
        backgroundColor: colors.white_color,
    },
    view_typeSelect: {
        width: 16,
        height: 16,
        borderRadius: 8,
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: colors.white_color,
    },
    image_State: {
        backgroundColor: colors.white_color,
    },
    view_bottom: {
        width: '100%',
        height: 57,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#01a552',
        position: 'absolute',
        bottom: 0,
    },
    text_next: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 19,
        color: colors.white_color,
    },
    text_title: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
    },
    text_state: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#7b6dd6',
    },
    text_district: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 15,
        color: colors.text_Color,
    },
});

export default SelectDistrictScreen;


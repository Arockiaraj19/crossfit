import React, { useContext, useEffect } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';

const SelectStateScreen = ({ navigation, route }) => {

    const {
        myAddress,
        type,
        userState,
        next,
        placeholderType,
        placeholderState,
    } = useContext(AuthContext);
    const [arrayOfType, setArrayOfType] = React.useState([]);
    const [arrayOfState, setArrayOfState] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [isFetchType, setIsFetchType] = React.useState('type');
    const [isFetchState, setIsFetchState] = React.useState(true);
    var deviceWidth = Dimensions.get("window").width;
    const [boxWidth, setboxWidth] = React.useState(0);
    const [addressTypeId, setAddressTypeId] = React.useState('');
    const [addressType, setAddressType] = React.useState('');
    const [addressStateId, setAddressStateId] = React.useState('');
    const [addressState, setAddressState] = React.useState('');
    const [key, setKey] = React.useState(0);
    const reload = React.useCallback(() => setKey((prevKey) => prevKey + 1), []);
    useEffect(() => {
        console.log("what is the params");
        console.log(route.params);

        setLoadingIndicator(true);
        setboxWidth((deviceWidth - 100) / 3);
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

        if (!isloading) {
            reload(1);
        }
        console.log("updateLoading", isloading)
        // setLoadingIndicator(false);
    }
    const updateStateLoading = (isloading) => {
        if (!isloading) {
            reload(1);
        }
    }
    const updateDate = (list) => {
        setIsFetchType('state');
        var templist = list;
        var tyepTemp = [];
        templist.map((typeInfo, i) => {
            var tempInfo = typeInfo;
            tempInfo.isSelected = false;
            if (route.params.isEdit != null && route.params.isEdit != undefined && route.params.isEdit == true) {
                if (typeInfo.Name == route.params.data.AddressType) {
                    console.log("what is the item");

                    tempInfo.isSelected = true;
                    setAddressTypeId(typeInfo.Id);
                    setAddressType(typeInfo.Name);
                }



            }
            tyepTemp.push(tempInfo)
        });


        setArrayOfType(tyepTemp);
    }
    const updateStateDate = (list) => {

        setIsFetchType('');
        var templist = list;
        var stateTemp = [];
        templist.map((stateInfo, i) => {
            var tempInfo = stateInfo;
            tempInfo.isSelected = false;
            if (route.params.isEdit != null && route.params.isEdit != undefined && route.params.isEdit == true) {
                if (tempInfo.Name == route.params.data.State) {
                    console.log("what is the item");

                    tempInfo.isSelected = true;
                    setAddressStateId(tempInfo.Id);
                    setAddressState(tempInfo.Name);
                }



            }
            stateTemp.push(tempInfo)
        })
        setArrayOfState(stateTemp);
        setTimeout(() => {
            setLoadingIndicator(false);
        }, 1000);
    }
    const onPressSelectType = (item) => {
        var templist = arrayOfType;
        var tyepTemp = [];
        templist.map((typeInfo, i) => {
            var tempInfo = typeInfo;
            tempInfo.isSelected = (item.Id == tempInfo.Id) ? true : false;
            tyepTemp.push(tempInfo)
        })
        setAddressTypeId(item.Id);
        setAddressType(item.Name);
        setArrayOfType(tyepTemp);
    }
    const onPressSelectState = (item) => {
        var templist = arrayOfState;
        var stateTemp = [];
        templist.map((stateInfo, i) => {
            var tempInfo = stateInfo;
            tempInfo.isSelected = (item.Id == tempInfo.Id) ? true : false;
            stateTemp.push(tempInfo)
        })
        setAddressStateId(item.Id);
        setAddressState(item.Name);
        setArrayOfState(stateTemp);
    }
    const onPressNextAction = () => {
        if (addressTypeId == '') {
            Alert.alert('', placeholderType, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (addressStateId == '') {
            Alert.alert('', placeholderState, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            var params = {
                addressTypeId: addressTypeId,
                addressType: addressType,
                addressState: addressState,
                addressStateId: addressStateId,
                isEdit: route.params.isEdit,
                data: route.params.data
            }
            navigation.navigate('SelectDistrictScreen', params)
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
            {(isFetchType == 'type') && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Type'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}

            {(isFetchType == 'state') && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'State'}
                    updateLoading={updateStateLoading}
                    updateDate={updateStateDate} />
            )}
            <View style={{ marginTop: 25, width: '100%', height: 24, }}>
                <View style={styles.view_pageCount}>
                    <Text style={styles.text_pageCount}>{'1/4'}</Text>
                </View>
            </View>
            <View style={{ width: '100%', height: '75%' }}>
                <ScrollView style={{ width: '100%', height: '100%', }}>
                    <View style={{ marginTop: 25, width: '100%', }}>
                        <Text style={styles.text_typeTitle}>{type}</Text>
                        {(arrayOfType.length != 0) && (
                            <View style={styles.view_type}>
                                <View style={styles.view_typeBox}>
                                    {arrayOfType.map((data, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={[styles.view_typeInner, { borderColor: (data.isSelected) ? '#01a552' : 'rgba(153, 153, 153, 0.2)' }]}
                                                onPress={() =>
                                                    onPressSelectType(data)
                                                }>
                                                <Image style={{ width: 28, height: 28, }}
                                                    source={{ uri: data.ImageURL }}></Image>
                                                <Text style={[styles.text_type, { color: (data.isSelected) ? colors.text_Color : '#666666' }]}>{data.Name}</Text>
                                                {(data.isSelected == true) && (
                                                    <Image style={styles.view_typeSelect}
                                                        source={images.TICKICON} />
                                                )}
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        )}
                        <Text style={[styles.text_typeTitle, { marginTop: 40, }]}>{userState}</Text>
                        {(arrayOfState.length != 0) && (
                            <View style={[styles.view_type, { marginBottom: 25, }]}>
                                <View style={styles.view_typeBox}>
                                    {arrayOfState.map((data, index) => {
                                        return (
                                            <TouchableOpacity key={index} style={[styles.view_StateInner, { width: boxWidth, height: boxWidth + 30, backgroundColor: (data.isSelected) ? '#01a552' : 'transparent' }]}
                                                onPress={() =>
                                                    onPressSelectState(data)
                                                }>
                                                <Image style={[styles.image_State, { width: boxWidth - 20, height: boxWidth - 20, borderRadius: (boxWidth - 20) / 2, backgroundColor: (data.isSelected) ? colors.white_color : '#d4d4d4' }]}
                                                    source={{ uri: data.ImageURL }}></Image>
                                                <Text style={[styles.text_type, { color: (data.isSelected) ? colors.white_color : '#666666', marginTop: 10 }]}>{data.Name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </View>
                            </View>
                        )}

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
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 5,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 5,
        width: '95%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_typeInner: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(153, 153, 153, 0.2)',
        width: 70,
        height: 60,
        backgroundColor: '#e8ecec',
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
        marginTop: 15,
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
});

export default SelectStateScreen;


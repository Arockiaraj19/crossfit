import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useEffect } from 'react';
import { Alert, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts } from '../core';
import { currencyFormat, weightConvertKilogram } from '../helpers/AppManager';

const ADDEDITBID_QUERY = gql`
mutation ($bidId: ID!, $userAddressId: ID!, $lotId: ID!, $quantity: Float!, $quantityUnit: ID!, $requestedPrice: Float!){
    addEditBid(bidId: $bidId , userAddressId: $userAddressId, lotId: $lotId, quantity: $quantity, quantityUnit: $quantityUnit, requestedPrice: $requestedPrice) 
    { 
        Id
        BidNumber
        AddressInfo
        Quantity
        AskingPrice
        CreatedOn
        Status
    } 
  }
`;

const UpdateBidsInfoScreen = ({ navigation, route }) => {

    const {
        editBits,
        productPrice,
        availableQuality,
        requiredQuantity,
        availableQualityPlaceholder,
        weightPlaceholder,
        alertRequiredQuantity,
        updateBit,
        bidPricePlaceholder,
        quantityAlert,
        priceAlert,
        weightUnitAlert,
        bidPrice,
        minAmountPerGvtAlert,error,validPrice,
        validQuantity,checkQuantityAlert
    } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [weightValue, setWeightValue] = React.useState('');
    const [weightCode, setWeightCode] = React.useState('');
    const [weightId, setWeightId] = React.useState('');
    const [askingPrice, setAskingPrice] = React.useState(0.00);
    const [availableValue, setAvailableValue] = React.useState(0.00);
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [addEditBid, { loading, errorData, data }] = useMutation(ADDEDITBID_QUERY);

    useEffect(() => {
        setWeightValue(route?.params.details.QuantityCode);
        setWeightId(route?.params.details.QuantityUnit);
        setAskingPrice(Math.floor(route?.params.details.BidPrice).toString());
        setWeightCode(route?.params.details.QuantityActualCode);
        setAvailableValue(route?.params.details.QuantityValue);
    }, [])


    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressShowList = (selectType) => {
        setArrayOfItems([]);
        setModalVisible(true)
    }
    const handleSelectItem = (item, index) => {
        setWeightId(item.Id);
        setWeightValue(item.Name);
        setWeightCode(item.Code);
        setModalVisible(false);
    }
    const updateTextInputValue = (text, type) => {
        setAskingPrice(text)
    }
    const updateLoading = (isloading) => {
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        setArrayOfItems(list);
    }
    const onPressPlaceBit = async () => {
        var trimAvailableValue = 0.00
        var trimAskingPrice = 0.00

        var minRatePerQuintal = route?.params.details?.MSP ? parseInt(route?.params.details?.MSP) : 0;
        var isValidAmountPerGvt = true;
        var totalPrice = 0;
        if (weightCode.toLocaleLowerCase() == 'kg') {
            var minAmountPerKg = minRatePerQuintal / 100;
            totalPrice = minAmountPerKg * 1;
            isValidAmountPerGvt = !(totalPrice > askingPrice);
        } else if (weightCode.toLocaleLowerCase() == 'ton') {
            var minAmountPerTon = minRatePerQuintal * 10;
            totalPrice = minAmountPerTon * 1;
            isValidAmountPerGvt = !(totalPrice > askingPrice);
        } else if (weightCode.toLocaleLowerCase() == 'qtl') {
            totalPrice = minRatePerQuintal * 1;
            isValidAmountPerGvt = !(totalPrice > askingPrice);
        }


        console.log('availableValue ----- ', route?.params)
        console.log('askingPrice ----- ', askingPrice)

        if (availableValue > 0) {
            trimAvailableValue = availableValue.replace(/\s/g, '');
        }
        if (askingPrice > 0) {
            trimAskingPrice = askingPrice.replace(/\s/g, '');
        }
        if (availableValue == '') {
            Alert.alert('', alertRequiredQuantity, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (parseFloat(weightConvertKilogram(weightValue, parseFloat(route?.params.details.LotQuantityValue))) < weightConvertKilogram(weightValue, parseFloat(availableValue))) {
            Alert.alert('', checkQuantityAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }

        else if (weightId == '') {
            Alert.alert('', weightUnitAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (askingPrice == '') {
            Alert.alert('', priceAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);

        } else if (parseFloat(askingPrice) < 1) {
            Alert.alert('', validPrice, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (parseFloat(availableValue) < 1) {
            Alert.alert('', validQuantity, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (!isValidAmountPerGvt) {
            Alert.alert('', minAmountPerGvtAlert + " " + currencyFormat(totalPrice) + "/" + weightValue, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            setLoadingIndicator(true);
            // console.log('route?.params', { bidId: parseInt(route?.params.details.Id), userAddressId: parseInt(route?.params.details.UserAddressId), lotId: parseInt(route?.params.details.Id), quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), requestedPrice: parseFloat(askingPrice) });
            addEditBid({
                variables: { bidId: parseInt(route?.params.details.Id), userAddressId: parseInt(route?.params.details.UserAddressId), lotId: parseInt(route?.params.details.Id), quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), requestedPrice: parseFloat(askingPrice) }
            })
                .then(res => {
                    setLoadingIndicator(false)
                    onPressViewBidInfo();
                })
                .catch(e => {
                    Alert.alert(error, e.message, [{
                        text: 'OK', onPress: () => {
                            return;
                        },
                    },
                    ]);
                    setLoadingIndicator(false)
                });
        }
    }
    const onPressViewBidInfo = () => {
        navigation.navigate('BidsProductsScreen', { isProfile: false });
    }
    const onChangeAvailableText = (text) => {
        const validated = text.match(/^\d+$/);
        if (validated) {
            setAvailableValue(text)
        } else if (text == '') {
            setAvailableValue(text)
        }
    }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={editBits}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_top}>
                <View style={styles.view_topInnder}>
                    <Image style={styles.image_category}
                        resizeMode={'contain'}
                        source={{ uri: route?.params.details.CommodityChildURL }}>
                    </Image>
                    <View style={styles.view_text}>
                        <Text style={styles.text_name}>{route?.params.details.CommodityChildName}</Text>
                        <Text style={styles.text_description}>{route?.params.details.AddressInfo}</Text>
                    </View>
                </View>
                {/* <View style={styles.view_headerBottom}>
                    <View style={styles.view_weight}>
                        <Text style={styles.text_weight}>{route?.params.details.LotQuantityValue + ' ' + route?.params.details.LotQuantityCode }</Text>
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 6, }}>
                        <Text style={styles.text_ask}>{'Asking Price'}</Text>
                        <View style={styles.view_price}>
                            <Text style={styles.text_weight}>{'₹ ' + route?.params.details.AskingPrice}</Text>
                        </View>
                    </View>
                </View> */}
                <View style={styles.view_headerBottom}>
                    <View style={{ marginLeft: 10, marginTop: 6, }}>
                        <Text style={styles.text_ask}>{availableQuality}</Text>
                        <View style={styles.view_price}>
                            <Text style={styles.text_weight}>{route?.params.details.LotQuantityValue + ' ' + route?.params.details.LotQuantityCode}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 6, }}>
                        <Text style={styles.text_ask}>{productPrice}</Text>
                        <View style={styles.view_price}>
                            <Text style={styles.text_weight}>{'₹ ' + route?.params.details.AskingPrice}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={{ width: '100%', marginBottom: 20, }}>
                <View style={styles.view_info}>
                    <View style={styles.view_box}>
                        <View style={{ alignItems: 'center', width: '100%', height: 75, marginBottom: 10, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{requiredQuantity}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={[styles.search_Input]}
                                        value={availableValue}
                                        onChangeText={onChangeAvailableText}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={availableQualityPlaceholder}>
                                    </TextInput>
                                    <View style={{ marginLeft: 60, marginTop: -2, width: '35%', height: 30, flexDirection: 'row', alignItems: 'center', }}>
                                        {/* onPress={() => onPressShowList('Weight')}> */}
                                        <Text style={styles.text_weightValue}>{(weightValue == '') ? weightPlaceholder : weightValue}
                                        </Text>
                                        {/* <Image style={[styles.image_dropDown, { right: 0 }]}
                                            source={images.DROPDOWNARROWICON} /> */}
                                        <View style={[styles.view_line, { width: '100%' }]}></View>
                                    </View>
                                </View>
                                <View style={[styles.view_line]}></View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', width: '100%', height: 75, marginBottom: 10, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{bidPrice}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={[styles.search_Input, { width: '100%' }]}
                                        value={askingPrice}
                                        onChangeText={setAskingPrice}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={bidPricePlaceholder}>
                                    </TextInput>
                                </View>
                                <View style={[styles.view_line, { width: '100%' }]}></View>
                            </View>
                        </View>

                        <View style={styles.view_PlcaeBitBottom}>
                            <TouchableOpacity style={styles.button_placeBit}
                                onPress={onPressPlaceBit}>
                                <Text style={styles.text_placeBid}>{updateBit}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

            </ScrollView>
            {(modalVisible) && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <Pressable style={styles.popup_view}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <DataFetchComponents
                            selectedId={''}
                            isType={'Weight'}
                            updateLoading={updateLoading}
                            updateDate={updateDate} />
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{'Weight'}</Text>
                            <View style={styles.line} />
                            <View style={styles.view_List}>
                                <FlatList
                                    style={styles.list}
                                    data={arrayOfItems}
                                    keyExtractor={(x, i) => i}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={styles.title_view}
                                            onPress={() => handleSelectItem(item, index)}>
                                            <Text style={styles.task_title}> {`${item.Name}`} </Text>
                                            <View style={styles.line} />
                                        </TouchableOpacity>
                                    )}
                                />
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
            {loadingIndicator && <Loading />}
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.white_color,
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_top: {
        width: '100%',
        height: 160,
        alignItems: 'center',
        backgroundColor: '#f0efef'
    },
    view_topInnder: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
    },
    image_category: {
        marginLeft: 20,
        width: 100,
        height: 80,
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_text: {
        width: '65%',
        justifyContent: 'center',
        height: 80,
    },
    text_name: {
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 16,
        color: colors.text_Color,
    },
    text_description: {
        marginTop: 5,
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.subText_Color,
    },
    text_grade: {
        marginTop: 5,
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: colors.text_Color,
    },
    view_headerBottom: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text_weight: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 12,
        color: '#000000',
    },
    text_ask: {
        textAlign: 'center',
        marginBottom: 5,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 12,
        color: colors.text_Color,
    },
    view_weight: {
        height: 35,
        width: 100,
        marginTop: 25,
        marginRight: 10,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white_color
    },
    view_price: {
        height: 35,
        width: 100,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white_color
    },
    view_info: {
        width: '100%',
        alignItems: 'center',
        height: 370,
    },
    view_box: {
        marginTop: 30,
        width: '90%',
        height: 300,
        backgroundColor: colors.white_color,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0, height: 1
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    view_inner: {
        marginTop: 15,
        width: '90%',
        height: 70,
    },
    text_title: {
        marginTop: 8,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 15,
        color: '#999999',
    },
    view_enter: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_Input: {
        width: '45%',
        height: 35,
        color: colors.text_Color,
        fontSize: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
    },
    image_dropDown: {
        width: 14,
        height: 7,
        position: 'absolute',
        right: 10,
    },
    view_line: {
        position: 'absolute',
        bottom: 0,
        marginTop: 10,
        width: '55%',
        height: 1,
        backgroundColor: '#f0f0f0'
    },
    popup_view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lite_black,
    },
    modalView: {
        width: '90%',
        height: '70%',
        margin: 20,
        backgroundColor: colors.white_color,
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 22,
        fontWeight: '700',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.black_color,
    },
    view_List: {
        marginLeft: 5,
        width: '100%',
        height: '95%',
    },
    list: {
        width: '100%',
    },
    title_view: {
        flex: 1,
        flexDirection: "column",
        height: 40,
    },
    task_title: {
        flex: 1,
        fontSize: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        margin: 5,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    text_weightValue: {
        marginTop: 5,
        marginLeft: 5,
        height: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 13,
        color: colors.text_Color,
    },
    view_PlcaeBitBottom: {
        marginTop: 30,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_placeBit: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_placeBid: {
        marginLeft: 15,
        marginRight: 15,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 14,
        color: '#01a552',
    },
});

export default UpdateBidsInfoScreen;


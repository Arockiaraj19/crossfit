import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, TextInput, Platform, Alert, Pressable, KeyboardAvoidingView, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import InputBoxComponent from '../components/InputBoxComponent';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { weightConvertKilogram,currencyFormat } from '../helpers/AppManager';
import Loading from '../components/Loading';


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

const PlaceBitInfoScreen = ({ navigation, route }) => {

    const {
        placeBit,
        gradeText,
        availableQuality,
        availableQualityPlaceholder,
        weightPlaceholder,
        productPrice,
        productPricePlaceholder,
        quantityAlert,
        priceAlert,
        weightUnitAlert,
        requiredQuantity,
        alertRequiredQuantity,
        checkQuantityAlert,
        minAmountPerGvtAlert,
    } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [weightValue, setWeightValue] = React.useState('');
    const [weightCode, setWeightCode] = React.useState('');
    const [weightId, setWeightId] = React.useState('');
    const [askingPrice, setAskingPrice] = React.useState(0.00);
    const [availableValue, setAvailableValue] = React.useState(0.00);
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [addEditBid, { loading, error, data }] = useMutation(ADDEDITBID_QUERY);



    useEffect(() => {
        console.log('route?.params.details', route?.params)
        setWeightId(route?.params.bidsDetails.QuantityUnit);
        setWeightCode(route?.params.bidsDetails.QuantityActualCode);
        setWeightValue(route?.params.bidsDetails.QuantityCode);
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
    const updateTextInputValue = (text) => {
        setAskingPrice(text)
    }
    const updateLoading = (isloading) => {
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        console.log('listlist ----- ', list)
        setArrayOfItems(list);
    }
    const onPressPlaceBit = async () => {
        var trimAvailableValue = 0.00
        var trimAskingPrice = 0.00
        console.log('availableValue ----- ', availableValue)
        console.log('askingPrice ----- ', askingPrice)

        var minRatePerQuintal=route?.params.details?.MSP ? parseInt(route?.params.details?.MSP) : 0;
        var isValidAmountPerGvt=true;
        var totalPrice=0;
        if(weightCode.toLocaleLowerCase()=='kg'){
            var minAmountPerKg=minRatePerQuintal/100;
            totalPrice=minAmountPerKg*1;
            isValidAmountPerGvt=!(totalPrice>askingPrice);
        }else if (weightCode.toLocaleLowerCase()=='ton'){
            var minAmountPerTon=minRatePerQuintal*10;
            totalPrice=minAmountPerTon*1;
            isValidAmountPerGvt=!(totalPrice>askingPrice);
        }else if (weightCode.toLocaleLowerCase()=='qtl'){
            totalPrice=minRatePerQuintal*1;
            isValidAmountPerGvt=!(totalPrice>askingPrice);
        }

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
        else if (parseFloat(weightConvertKilogram(weightValue, parseFloat(route?.params.bidsDetails.CurrentAvailableQuantity))) < weightConvertKilogram(weightValue, parseFloat(availableValue))) {
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
        }else if(!isValidAmountPerGvt){
            Alert.alert('', minAmountPerGvtAlert+" "+currencyFormat(totalPrice)+"/"+weightValue, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            setLoadingIndicator(true)

            //  console.log('route?.params', { bidId: (route?.params.isEdit) ? parseInt(route?.params.bidsDetails.Id) : 0, userAddressId: parseInt(route?.params.addressId), lotId: parseInt(route?.params.bidsDetails.Id), quantity: parseFloat(trimAvailableValue), quantityUnit: parseInt(weightId), requestedPrice: parseFloat(trimAskingPrice) });
            addEditBid({
                variables: { bidId: (route?.params.isEdit) ? parseInt(route?.params.bidsDetails.Id) : 0, userAddressId: parseInt(route?.params.addressId), lotId: parseInt(route?.params.bidsDetails.Id), quantity: parseFloat(trimAvailableValue), quantityUnit: parseInt(weightId), requestedPrice: parseFloat(trimAskingPrice) }
            })
                .then(res => {
                    setLoadingIndicator(false)
                    console.log('res - - - - - - - - -- - - - - ', res.data);
                    onPressViewBidInfo(res.data.addEditBid.Quantity);
                })
                .catch(e => {
                    setLoadingIndicator(false)
                    console.log('errer ------------------', e.message);
                });
        }
    }
    const onPressViewBidInfo = (Value) => {
        navigation.navigate('BidPlacedDetailScreen', { details: route?.params.details, bidsDetails: route?.params.bidsDetails, availableValue: Value, quantityUnit: weightValue, requestedPrice: askingPrice.replace(/\s/g, '') })
    }
    const onChangeAvailableText=(text) => {
        const validated = text.match(/^\d+$/);
         if (validated) {
            setAvailableValue(text)
         }else if(text==''){
            setAvailableValue(text)
         }
     }
    const floatTwoDecFromString = (value, type) => {
        let newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        newValue =
            newValue.indexOf('.') !== -1
                ? newValue.slice(0, newValue.indexOf('.') + 3)
                : newValue;
        if(type == 'price') {
            setAskingPrice(newValue)
        }
        else {
            setAvailableValue(newValue)
        }
    }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={placeBit}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_top}>
                <View style={styles.view_topInnder}>
                    <Image style={styles.image_category}
                        resizeMode={'contain'}
                        source={{ uri: route?.params.details.ImageURL }}>
                    </Image>
                    <View style={styles.view_text}>
                        <Text style={styles.text_name}>{route?.params.details.Name}</Text>
                        <Text style={styles.text_description}>{route?.params.bidsDetails.AddressInfo}</Text>
                    </View>
                </View>
                <View style={styles.view_headerBottom}>
                    <View style={{ marginLeft: 10, marginTop: 6, }}>
                        <Text style={styles.text_ask}>{availableQuality}</Text>
                        <View style={styles.view_price}>
                            <Text style={styles.text_weight}>{route?.params.bidsDetails?.CurrentAvailableQuantity ? `${route?.params.bidsDetails?.CurrentAvailableQuantity}${weightValue}` : `${route?.params.bidsDetails?.Quantity}${weightValue}`}</Text>
                        </View>
                    </View>
                    <View style={{ marginLeft: 10, marginTop: 6, }}>
                        <Text style={styles.text_ask}>{productPrice}</Text>
                        <View style={styles.view_price}>
                            <Text style={styles.text_weight}>{'₹ ' + route?.params.bidsDetails.SellerPrice}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={{ width: '100%', marginBottom: 20, }}>
                <View style={styles.view_info}>
                    <View style={styles.view_box}>
                        <View style={{ marginTop: 15, width: '100%', height: 75, alignItems: 'center', }}>
                            <View style={{ width: '90%', height: 70 }}>
                                <Text style={styles.text_title}>{gradeText}</Text>
                                <Text style={[styles.search_Input, { marginTop: 10, width: '90%' }]}>{`${route?.params.bidsDetails.GradeValue}`}</Text>
                                <View style={[styles.view_line, { width: '100%' }]}></View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, }}>
                            <View style={[styles.view_inner, { marginLeft: 15, width: '56%', }]}>
                                <Text style={styles.text_title}>{requiredQuantity}
                                </Text>
                                <View style={{ marginTop: 5, width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ width: '100%', height: '100%', }}>
                                        <TextInput style={styles.search_Input}
                                            value={availableValue}
                                            onChangeText={(text) => onChangeAvailableText(text)}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            keyboardType={'numeric'}
                                            returnKeyType='done'
                                            placeholderTextColor={colors.text_Color}
                                            placeholder={availableQualityPlaceholder}>
                                        </TextInput>
                                        <View style={[styles.view_line, { width: '100%' }]}></View>
                                    </View>
                                </View>
                                <View style={styles.view_line}></View>
                            </View>
                            <View style={[styles.view_inner, { marginRight: 15, width: '32%', }]}>
                                <Text style={styles.text_title}>{weightPlaceholder}
                                </Text>
                                <View style={{ marginTop: 5, width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ width: '100%', height: '100%', justifyContent: 'center', }}>
                                        <Text style={styles.text_weightValue}>{(weightValue == '') ? weightPlaceholder : weightValue}
                                        </Text>
                                    </View>
                                </View>
                                <View style={[styles.view_line, { marginBottom: -1, width: '100%' }]}></View>
                            </View>

                        </View>
                        <View style={{ alignItems: 'center', width: '100%', height: 85, }}>
                            <View style={[styles.view_inner, { marginTop: 0,}]}>
                                <Text style={styles.text_title}>{'Price'}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={styles.search_Input}
                                        value={askingPrice}
                                        onChangeText={(text) => floatTwoDecFromString(text, 'price')}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}//(dropDownType == 'DoorNo') ? 'default' : 'numeric'
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={productPricePlaceholder}
                                        maxLength={7}>
                                    </TextInput>
                                </View>
                            </View>
                            <View style={[styles.view_line, {marginTop: 0, width: '90%',  }]}></View>
                        </View>

                        {/* <InputBoxComponent
                            title={ (weightValue == '') ? productPrice : (productPrice + ' ' + weightValue)}
                            enterText={updateTextInputValue}
                            dropDownType={'Price'}
                            placeHolder={productPricePlaceholder}
                            onPressShowList={onPressShowList}
                            keyboardType={'numeric'}
                            maxLength={7}
                        /> */}
                        <View style={styles.view_PlcaeBitBottom}>
                            <TouchableOpacity style={styles.button_placeBit}
                                onPress={onPressPlaceBit}>
                                <Text style={styles.text_placeBid}>{placeBit}</Text>
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
        minWidth: 100,
        maxWidth: 200,
        borderTopRightRadius: 4,
        borderTopLeftRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white_color
    },
    view_info: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 50,
    },
    view_box: {
        marginTop: 30,
        width: '90%',
        marginBottom: 50,
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
        width: '100%',
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
        color: colors.background_color,
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
        marginTop: -5,
        width: '100%',
        color: colors.text_Color,
        fontSize: 15,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
    },
    view_PlcaeBitBottom: {
        marginTop: 20,
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
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

export default PlaceBitInfoScreen;


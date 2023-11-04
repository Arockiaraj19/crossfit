import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import DropDownTextComponent from '../components/DropDownTextComponent';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import { currencyFormat } from '../helpers/AppManager';

const ADDEDITLOT_QUERY = gql`
mutation ($lotId: ID!, $userAddressId: ID!, $gradeId: ID!, $commodityChildId: ID!, $isOrganic: ID, $quantity: Float!, $quantityUnit: ID!, $cultivatedArea: Float!, $areaUnit: ID!, $sellerPrice: Float!, $currentQuantity: Float!, $currentPrice: Float!, $currentQuantityUnit:Float! ){
    addEditLot(lotId: $lotId , userAddressId: $userAddressId, gradeId: $gradeId, commodityChildId: $commodityChildId, isOrganic: $isOrganic, quantity: $quantity, quantityUnit: $quantityUnit, cultivatedArea: $cultivatedArea areaUnit: $areaUnit, sellerPrice: $sellerPrice, currentQuantity: $currentQuantity, currentPrice: $currentPrice, currentQuantityUnit: $currentQuantityUnit) 
    { 
        Id
        LotNumber
        AddressInfo
        CommodityChild
        CommodityChildImageURL
        Quantity
        SellerPrice
        CreatedOn
        Status
    } 
  }
`;

const UpdateLotInfoScreen = ({ navigation, route }) => {

    const {
        listMyProduct,
        gradeText,
        gradePlaceholder,
        availableQuality,
        availableQualityPlaceholder,
        weightPlaceholder,
        acres,
        acresPlaceholder,
        productPrice,
        productPricePlaceholder,
        saveLot,
        gradeAlert,
        quantityAlert,
        weightAlert,
        acreAlert,
        priceAlert,
        weightUnitAlert,
        editLot,
        updateLot,
        organic,
        per,
        minAmountPerGvtAlert,
    } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [gradeValue, setGradeValue] = React.useState('');
    const [gradeId, setGradeId] = React.useState('');
    const [weightValue, setWeightValue] = React.useState('');
    const [weightCode, setWeightCode] = React.useState('');
    const [weightId, setWeightId] = React.useState('');
    const [selectedType, setSelectedType] = React.useState('');
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [popupTitle, setPopupTitle] = React.useState('');
    const [availableValue, setAvailableValue] = React.useState(0.00);
    const [availableAcre, setAvailableAcre] = React.useState(0.00);
    const [askingPrice, setAskingPrice] = React.useState(0.00);
    const [isFetch, setIsFetch] = React.useState(false);
    const [organicType, setOrganicType] = React.useState('yes');

    const [productImage, setProductImage] = React.useState('');
    const [productName, setProductName] = React.useState('');
    const [productAddress, setProductAddress] = React.useState('');
    const [productAddressId, setProductAddressId] = React.useState('');
    const [productId, setProductId] = React.useState('');
    const [lotId, setLotId] = React.useState('');
    const [cultivatedUnit, setCultivatedUnit] = React.useState(0);
    const [saveLoading, setSaveLoading] = React.useState(false);
    const dimensions = Dimensions.get('window');
    const [addEditLot, { loading, error, data }] = useMutation(ADDEDITLOT_QUERY);

    useEffect(() => {
        console.log('route?.params ----', route?.params);

        setProductImage((route?.params?.isEdit) ? route?.params.lotInfo.CommodityChildImageURL : route?.params.productDetail.ImageURL);
        setProductName((route?.params?.isEdit) ? route?.params.lotInfo.CommodityChild : route?.params.productDetail.Name);
        setProductAddress((route?.params?.isEdit) ? route?.params.lotInfo.AddressInfo : route?.params.address);
        setProductAddressId((route?.params?.isEdit) ? route?.params.lotInfo.UserAddressId : route?.params.addressId);
        setProductId((route?.params?.isEdit) ? route?.params.lotInfo.CommodityChildId : route?.params.productDetail.Id);
        setOrganicType((route?.params?.isEdit) ? ((route?.params.lotInfo.IsOrganic == 1) ? 'yes' : 'no') : 'yes')
        if (route?.params?.isEdit) {
            setGradeValue(route?.params.lotInfo.GradeValue);
            setGradeId(route?.params.lotInfo.GradeId);
            setWeightValue(route?.params.lotInfo.QuantityCode);
            setWeightCode(route?.params.lotInfo.QuantityActualCode)
            setWeightId(route?.params.lotInfo.QuantityUnit);
            setAvailableValue(route?.params.lotInfo.UnitQuantity);
            setAvailableAcre(route?.params.lotInfo.CultivatedArea);
            setCultivatedUnit(route?.params.lotInfo.CultivatedAreaUnit);
            setAskingPrice(route?.params.lotInfo.SellerPrice);
            setLotId(route?.params.lotInfo.Id);
        }
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
    const onPressShowList = (selectType) => {

        setSelectedType(selectType);
        setArrayOfItems([]);
        setLoadingIndicator(true);
        setIsFetch(true);

        setPopupTitle((selectType == 'Grade') ? gradeText : weightPlaceholder);

        setModalVisible(true)



    }
    const updateLoading = (isloading) => {
        if (isloading == false) {
            console.log('updateLoading ----- ', isloading);
            setIsFetch(false);
            setLoadingIndicator(false);
        }
    }
    const updateDate = (list) => {
        setIsFetch(false);
        setLoadingIndicator(false);
        console.log('listlist ----- ', list)
        setArrayOfItems(list);
    }
    const handleSelectItem = (item, index) => {
        if (selectedType == 'Grade') {
            setGradeId(item.Id);
            setGradeValue(item.Name);
        }
        if (selectedType == 'Weight') {
            setWeightId(item.Id);
            setWeightValue(item.Name);
            setWeightCode(item.Code);
        }
        setModalVisible(false);
    }
    const onPressSaveLotInfo = () => {
        var tempAcre = parseFloat(availableAcre)
        var tempAcre1 = tempAcre.toFixed(2)
        var acreValue = (availableAcre != '') ? parseFloat(tempAcre1) : 0

        var minRatePerQuintal = route?.params?.lotInfo?.MSP ? parseInt(route?.params?.lotInfo?.MSP) : 0;
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

        console.log("weightValue", weightCode, "isValidAmountPerGvt", isValidAmountPerGvt, "askingPrice", askingPrice, "totalprice", totalPrice)

        if (gradeId == '') {
            Alert.alert('', gradeAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (availableValue == '') {
            Alert.alert('', quantityAlert, [{
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
        else if (weightValue == '') {
            Alert.alert('', weightAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        } else if (!isValidAmountPerGvt) {
            Alert.alert('', minAmountPerGvtAlert + " " + currencyFormat(totalPrice) + "/" + weightValue, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        // else if (availableAcre == '') {
        //     Alert.alert('', acreAlert, [{
        //         text: 'OK', onPress: () => {
        //             return;
        //         },
        //     },
        //     ]);
        // }
        // else if (askingPrice == '') {
        //     Alert.alert('', priceAlert, [{
        //         text: 'OK', onPress: () => {
        //             return;
        //         },
        //     },
        //     ]);
        // }
        else {
            setSaveLoading(true);
            console.log('route?.params.addressId', { lotId: (route?.params?.isEdit) ? lotId : 0, userAddressId: parseInt(productAddressId), gradeId: parseInt(gradeId), commodityChildId: parseInt(productId), isOrganic: (organicType == 'yes') ? 1 : 0, quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), cultivatedArea: acreValue, areaUnit: (route?.params?.isEdit) ? cultivatedUnit : 1, sellerPrice: parseFloat(askingPrice), currentQuantity: parseFloat(availableValue), currentPrice: parseFloat(askingPrice), currentQuantityUnit: parseFloat(weightId) })
            addEditLot({
                variables: { lotId: (route?.params?.isEdit) ? lotId : 0, userAddressId: parseInt(productAddressId), gradeId: parseInt(gradeId), commodityChildId: parseInt(productId), isOrganic: (organicType == 'yes') ? 1 : 0, quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), cultivatedArea: acreValue, areaUnit: (route?.params?.isEdit) ? cultivatedUnit : 1, sellerPrice: parseFloat(askingPrice), currentQuantity: parseFloat(availableValue), currentPrice: parseFloat(askingPrice), currentQuantityUnit: parseFloat(weightId) }
            })
                .then(res => {
                    setSaveLoading(false);
                    console.log('res ------------------', res);
                    if (route?.params?.isEdit) {
                        navigation.goBack();
                    }
                    else {
                        navigation.navigate('LotAddSuccessScreen', { grade: gradeValue, lotDetail: res.data.addEditLot, productDetail: route?.params.productDetail, address: route?.params.address });
                    }
                })
                .catch(e => {
                    setSaveLoading(false);
                    console.log('errer ------------------', e.message);
                });
        }
    }
    const roundToHundredths = num => {
        let roundedNum = Math.round(num * 100) / 100
        // force 2 decimal places
        return num;//roundedNum.toFixed(2);
    }
    const updateTextInputValue = (text, type) => {
        console.log('text ----- ', text, type)
        if (type == 'Acres') {
            setAvailableAcre(text)
        }
        else if (type == 'Price') {
            setAskingPrice(text)
        }
    }
    const onPressSelectOrganic = (type) => {
        setOrganicType(type);
    }
    const onPressTextChange = (text) => {
        const temp = parseFloat(text).toFixed(2)
        setAvailableAcre(temp)
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
                    headerTitle={(route?.params?.isEdit) ? editLot : listMyProduct}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_top}>
                <Image style={styles.image_category}
                    source={{ uri: productImage }}>
                </Image>
                <View style={styles.view_text}>
                    <Text style={styles.text_name}>{productName}</Text>
                    <Text style={styles.text_description}>{productAddress}</Text>
                </View>
            </View>
            <ScrollView style={{ width: '100%', height: '96%', }}>
                <View style={[styles.view_detail, { marginBottom: 30, }]}>
                    <View style={styles.view_box}>
                        <View style={{ width: '100%', height: 10, }} />
                        <DropDownTextComponent
                            title={gradeText}
                            enterText={gradeValue}
                            placeHolder={gradePlaceholder}
                            dropDownType={'Grade'}
                            onPressShowList={onPressShowList} />

                        <View style={{ alignItems: 'center', width: '100%', flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={[styles.view_inner, { marginLeft: 15, width: '56%', }]}>
                                <Text style={styles.text_title}>{availableQuality}
                                </Text>
                                <View style={{ marginTop: 5, width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <View style={{ width: '100%', height: '100%', }}>
                                        <TextInput style={styles.search_Input}
                                            value={availableValue}
                                            onChangeText={onChangeAvailableText}
                                            autoCapitalize='none'
                                            autoCorrect={false}
                                            keyboardType={'numeric'}
                                            returnKeyType='done'
                                            placeholderTextColor={colors.text_Color}
                                            placeholder={availableQualityPlaceholder}>
                                        </TextInput>
                                    </View>
                                </View>
                                <View style={[styles.view_line, { width: '100%' }]}></View>
                            </View>
                            <View style={[styles.view_inner, { marginRight: 15, width: '32%', }]}>
                                <Text style={styles.text_title}>{weightPlaceholder}
                                </Text>
                                <View style={{ marginTop: 5, width: '100%', height: 45, flexDirection: 'row', justifyContent: 'space-between', }}>
                                    <TouchableOpacity style={{ width: '100%', height: '100%', flexDirection: 'row', alignItems: 'center', }}
                                        onPress={() => onPressShowList('Weight')}>
                                        <Text style={styles.text_weight}>{(weightValue == '') ? weightPlaceholder : weightValue}
                                        </Text>
                                        <Image style={[styles.image_dropDown, { right: 5 }]}
                                            source={images.DROPDOWNARROWICON} />
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.view_line, { width: '100%' }]}></View>
                            </View>

                        </View>
                        {/* <View style={{ alignItems: 'center', width: '100%', marginTop: 10, height: 85, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{availableQuality}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={styles.search_Input}
                                        value={availableValue}
                                        onChangeText={setAvailableValue}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={availableQualityPlaceholder}>
                                    </TextInput>
                                    <TouchableOpacity style={{ marginLeft: 20, marginTop: -2, width: '35%', height: 35, flexDirection: 'row', alignItems: 'center', }}
                                        onPress={() => onPressShowList('Weight')}>
                                        <Text style={styles.text_weight}>{(weightValue == '') ? weightPlaceholder : weightValue}
                                        </Text>
                                        <Image style={[styles.image_dropDown, { right: 0 }]}
                                            source={images.DROPDOWNARROWICON} />
                                        <View style={[styles.view_line, { width: '100%' }]}></View>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.view_line}></View>
                            </View>
                        </View> */}
                        <View style={{ alignItems: 'center', width: '100%', marginTop: 10, height: 85, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{acres}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={[styles.search_Input, { width: '100%', }]}
                                        value={availableAcre}
                                        onChangeText={setAvailableAcre}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={acresPlaceholder}>
                                    </TextInput>
                                </View>
                                <View style={[styles.view_line, { bottom: -5, width: '100%' }]}></View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', width: '100%', marginTop: 10, height: 85, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{(weightValue == '') ? productPrice : (productPrice + ' ' + per + ' ' + weightValue)}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={[styles.search_Input, { width: '100%', }]}
                                        value={askingPrice}
                                        onChangeText={setAskingPrice}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={productPricePlaceholder}>
                                    </TextInput>
                                </View>
                                <View style={[styles.view_line, { bottom: -5, width: '100%' }]}></View>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center' }]}>
                            <Text style={styles.text_heading}>{organic}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (organicType == 'yes') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressSelectOrganic('yes')}>
                                    <Text style={[styles.text_roles, { color: (organicType == 'yes') ? colors.white_color : 'rgba(1, 165, 82, 0.4)' }]}>{'Yes'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (organicType == 'no') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressSelectOrganic('no')}>
                                    <Text style={[styles.text_roles, { color: (organicType == 'no') ? colors.white_color : 'rgba(1, 165, 82, 0.4)' }]}>{'No'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 20, }} />
                    </View>
                    <View style={styles.view_bottom}>
                        <TouchableOpacity style={styles.button_save}
                            onPress={onPressSaveLotInfo}>
                            <Text style={styles.text_lot}>{(route?.params?.isEdit) ? updateLot : saveLot}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {(isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={selectedType}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
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
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{popupTitle}</Text>
                            <View style={styles.line} />
                            <View style={styles.view_List}>
                                {loadingIndicator == true ? <ActivityIndicator size="large" color='#000000' /> : <FlatList
                                    style={styles.list}
                                    data={arrayOfItems}
                                    keyExtractor={(x, i) => i}
                                    renderItem={({ item, index }) => (
                                        <TouchableOpacity style={styles.title_view}
                                            onPress={() => handleSelectItem(item, index)}>
                                            {(console.log('itemitemitemitem --- ', item))}
                                            <Text style={styles.task_title}> {`${item.Name}`} </Text>
                                            <View style={styles.line} />
                                        </TouchableOpacity>
                                    )}
                                />}
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}
            {saveLoading && <Loading />}
        </KeyboardAvoidingView>
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
    view_top: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f0efef'
    },
    image_category: {
        marginLeft: 20,
        width: 100,
        height: 80,
        borderRadius: 6,
        backgroundColor: colors.white_color
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
    view_detail: {
        width: '100%',
        alignItems: 'center',
    },
    view_box: {
        marginTop: 10,
        width: '90%',
        borderRadius: 6,
        backgroundColor: colors.white_color,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
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
        padding: 1,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    view_inner: {
        width: '90%',
    },
    view_enter: {
        marginTop: 10,
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_Input: {
        width: '95%',
        height: 35,
        fontSize: 15,
        color: colors.text_Color,
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
    text_title: {
        marginTop: 8,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 15,
        color: '#999999',
    },
    text_value: {
        height: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 16,
        color: colors.text_Color,
    },
    text_weight: {
        marginTop: 5,
        marginLeft: 5,
        height: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 13,
        color: colors.text_Color,
    },
    view_bottom: {
        width: '100%',
        height: 40,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_save: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_lot: {
        marginLeft: 10,
        marginRight: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 15,
        color: colors.landing_background,
    },
    view_info: {
        marginTop: 10,
        width: '100%',
        height: 85,
    },
    text_heading: {
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.text_Color,
    },
    view_role: {
        overflow: 'hidden',
        width: 120,
        height: 40,
        borderRadius: 20,
        position: 'absolute',
        right: 20,
        flexDirection: 'row',
        backgroundColor: 'rgba(1, 165, 82, 1.0)',
        alignItems: 'center',
    },
    button_buyer: {
        marginLeft: 2,
        width: 58,
        height: 36,
        borderTopLeftRadius: 18,
        borderBottomLeftRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_seller: {
        width: 58,
        height: 36,
        borderTopRightRadius: 18,
        borderBottomRightRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_roles: {
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
    },
});

export default UpdateLotInfoScreen;


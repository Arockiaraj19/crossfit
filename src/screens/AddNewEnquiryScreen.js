import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import moment from "moment";
import React, { useContext, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import DropDownTextComponent from '../components/DropDownTextComponent';
import HeaderComponents from '../components/HeaderComponents';
import { colors, fonts, images } from '../core';

const ADDEDITENQUIRY_QUERY = gql`
mutation ($enquiryId: ID!, $userAddressId: ID!, $gradeId: ID!, $commodityChildId: ID!, $quantity: Float!, $quantityUnit: ID!, $deliveryOn: String!){
    addEditEnquiry(enquiryId: $enquiryId , userAddressId: $userAddressId, gradeId: $gradeId, commodityChildId: $commodityChildId, quantity: $quantity, quantityUnit: $quantityUnit, deliveryOn: $deliveryOn) 
    { 
        Id
        EnquiryNumber
        UserId
        UserAddressId
        GradeId
        CommodityChild
        CommodityChildImageURL
        AddressInfo
        Quantity
        QuantityCode
        DeliveryOn
        CreatedOn
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        Status
    } 
  }
`;


const AddNewEnquiryScreen = ({ navigation, route }) => {

    const {
        gradeText,
        gradePlaceholder,
        requiredQuantity,
        availableQualityPlaceholder,
        weightPlaceholder,
        gradeAlert,
        alertRequiredQuantity,
        weightAlert,
        deliverOnAlert,
        weightUnitAlert,
        newEnquriyText,
        deliverOn,
        placeEnquiry,
        editEnquiry,
    } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [gradeValue, setGradeValue] = React.useState('');
    const [gradeId, setGradeId] = React.useState('');
    const [weightValue, setWeightValue] = React.useState('');
    const [weightId, setWeightId] = React.useState('');
    const [selectedType, setSelectedType] = React.useState('');
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [popupTitle, setPopupTitle] = React.useState('');
    const [availableValue, setAvailableValue] = React.useState(0.00);
    const [availableAcre, setAvailableAcre] = React.useState(0.00);
    const [askingPrice, setAskingPrice] = React.useState(0.00);
    const [isFetch, setIsFetch] = React.useState(false);
    const [deliveryDate, setDeliveryDate] = React.useState(new Date())
    const [isDatePicker, setIsDatePicker] = React.useState(false);
    const [deliveryOnValue, setDeliveryOnValue] = React.useState('');
    const [dateOfDelivaty, setDateOfDelivaty] = React.useState('');
    const [loadingState, setLoadingState] = React.useState(false);
    const dimensions = Dimensions.get('window');
    const [addEditEnquiry, { loading, error, data }] = useMutation(ADDEDITENQUIRY_QUERY);

    useEffect(() => {

        if (route.params.isEdit) {
            setGradeValue(route?.params.enquiryInfo.GradeValue)
            setGradeId(route?.params.enquiryInfo.GradeId)
            setWeightValue(route?.params.enquiryInfo.QuantityCode)
            setWeightId(route?.params.enquiryInfo.QuantityUnit)
            setAvailableValue(route?.params.enquiryInfo.UnitQuantity)
            setDateOfDelivaty(moment(route?.params.enquiryInfo.DeliveryOn).format("YYYY-MM-DD"))

        }
        console.log('productDetail ---------', route?.params);

    }, [])
    const onPressBack = () => {
        if (route.params.isEdit) {

        }
        else {
            navigation.goBack();
        }
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
        setIsDatePicker(false)

    }
    const onPressDatePicker = () => {
        setSelectedType('datePicker');
        setLoadingIndicator(true);

        setIsFetch(true);
        setModalVisible(true)
        setIsDatePicker(true)

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
        }
        setModalVisible(false);
        setIsDatePicker(false);
    }
    const onPressSaveEnquiryInfo = () => {
        console.log("i clicked");
        if (gradeId == '') {
            Alert.alert('', gradeAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (availableValue == '') {
            Alert.alert('', alertRequiredQuantity, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (weightId == '') {
            Alert.alert('', "Please Select Required Quantity Unit", [{
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
        }
        else if (dateOfDelivaty == '') {
            Alert.alert('', deliverOnAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            // setLoadingIndicator(true);
            setLoadingState(true);

            console.log({ enquiryId: (route.params.isEdit) ? route.params.enquiryInfo.Id : 0, userAddressId: (route.params.isEdit) ? parseInt(route?.params.enquiryInfo.UserAddressId) : parseInt(route?.params.addressId), gradeId: parseInt(gradeId), commodityChildId: ((route.params.isEdit) ? parseInt(route?.params.enquiryInfo.CommodityChildId) : parseInt(route?.params.productDetail.Id)), quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), deliveryOn: dateOfDelivaty });
            addEditEnquiry({
                variables: { enquiryId: (route.params.isEdit) ? route.params.enquiryInfo.Id : 0, userAddressId: (route.params.isEdit) ? parseInt(route?.params.enquiryInfo.UserAddressId) : parseInt(route?.params.addressId), gradeId: parseInt(gradeId), commodityChildId: ((route.params.isEdit) ? parseInt(route?.params.enquiryInfo.CommodityChildId) : parseInt(route?.params.productDetail.Id)), quantity: parseFloat(availableValue), quantityUnit: parseInt(weightId), deliveryOn: dateOfDelivaty }
            })
                .then(res => {
                    setLoadingState(false);
                    // setLoadingIndicator(false)
                    console.log('res ------------------', res);
                    if (route.params.isEdit) {
                        navigation.goBack();
                    }
                    else {
                        navigation.navigate('EnquirySuccessScreen', { grade: gradeValue, enquiryDetail: res.data.addEditEnquiry, productDetail: route?.params.productDetail });
                    }
                })
                .catch(e => {
                    setLoadingState(false);
                    // setLoadingIndicator(false);
                    Alert.alert('Error', e.message, [{
                        text: 'OK', onPress: () => {
                            return;
                        },
                    },
                    ]);
                    console.log('errer ------------------', e.message);
                });
        }
    }
    const roundToHundredths = num => {
        let roundedNum = Math.round(num * 100) / 100
        // force 2 decimal places
        return num;//roundedNum.toFixed(2);
    }
    const updatedeliverDateValue = () => {
        setDateOfDelivaty(moment(deliveryDate).format("YYYY-MM-DD"))
        console.log('updatedeliverDateValue', moment(deliveryDate).format("YYYY-MM-DD"));
        closePopup();
    }
    const closePopup = () => {
        setModalVisible(false);
        setIsDatePicker(false);
    }
    const floatTwoDecFromString = (value) => {
        const validated = value.match(/^\d+$/);
        if (validated) {
            setAvailableValue(value)
        } else if (value == '') {
            setAvailableValue(value)
        }
        // let newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        // newValue =
        //     newValue.indexOf('.') !== -1
        //         ? newValue.slice(0, newValue.indexOf('.') + 3)
        //         : newValue;
        // setAvailableValue(value)
    }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={(route.params.isEdit) ? editEnquiry : newEnquriyText}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_top}>
                <Image style={styles.image_category}
                    source={{ uri: (route?.params.isEdit) ? route?.params.enquiryInfo.CommodityChildImageURL : route?.params.productDetail.ImageURL }}>
                </Image>
                <View style={styles.view_text}>
                    <Text style={styles.text_name}>{(route?.params.isEdit) ? route?.params.enquiryInfo.CommodityChild : route?.params.productDetail.Name}</Text>
                    <Text style={styles.text_description}>{(route?.params.isEdit) ? route?.params.enquiryInfo.AddressInfo : route?.params.address}</Text>
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
                        <View style={{ alignItems: 'center', width: '100%', marginTop: 10, height: 85, }}>
                            <View style={styles.view_inner}>
                                <Text style={styles.text_title}>{requiredQuantity}
                                </Text>
                                <View style={styles.view_enter}>
                                    <TextInput style={styles.search_Input}
                                        value={availableValue}
                                        onChangeText={(text) => floatTwoDecFromString(text)}
                                        // onChangeText={setAvailableValue}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={availableQualityPlaceholder}>
                                    </TextInput>
                                    <TouchableOpacity style={{ marginLeft: 25, marginTop: -2, width: '25%', height: 35, flexDirection: 'row', alignItems: 'center', }}
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
                        </View>
                        <View style={{ width: '100%', alignItems: 'center' }}>
                            <View style={{ width: '90%', }}>
                                <Text style={styles.text_title}>{deliverOn}
                                </Text>
                                <View style={[styles.view_enter, { marginTop: 5, }]}>
                                    <TextInput style={[styles.search_Input]}
                                        value={dateOfDelivaty}
                                        onChangeText={setDateOfDelivaty}
                                        autoCapitalize='none'
                                        autoCorrect={false}
                                        keyboardType={'numeric'}
                                        returnKeyType='done'
                                        placeholderTextColor={colors.text_Color}
                                        placeholder={deliverOn}>
                                    </TextInput>
                                    <TouchableOpacity style={{ width: '100%', height: 35, position: 'absolute', top: 0, }}
                                        onPress={() => onPressDatePicker()}>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <View style={styles.view_bottom}>
                            <TouchableOpacity style={styles.button_save}
                                onPress={onPressSaveEnquiryInfo}>
                                {loadingState ? <ActivityIndicator size="small" color={colors.landing_background} /> : <Text style={styles.text_lot}>{(route?.params.isEdit) ? "Save" : placeEnquiry}</Text>}
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', height: 20, }} />
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
                        closePopup()
                    }}>
                    <Pressable style={[styles.popup_view, { justifyContent: ((isDatePicker) ? 'flex-end' : 'center'), }]}
                        onPress={() => closePopup()}>
                        {(isDatePicker) ?
                            <View style={{ width: '100%', height: 310, }}>
                                <View style={{ width: '100%', height: 310, backgroundColor: colors.white_color, }}>
                                    <View style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableOpacity style={{ marginLeft: 15, justifyContent: 'center', alignItems: 'center', width: 80, height: 40, borderRadius: 5, borderWidth: 1, borderColor: colors.line_background }}
                                            onPress={closePopup}>
                                            <Text style={styles.text_cancel}>{'Cancel'}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ position: 'absolute', right: 15, justifyContent: 'center', alignItems: 'center', width: 80, height: 40, borderRadius: 5, borderWidth: 1, borderColor: colors.line_background }}
                                            onPress={updatedeliverDateValue}>
                                            <Text style={styles.text_cancel}>{'Done'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginTop: 5, width: '100%', height: 250, }}>
                                        <View style={[styles.view_line, { top: 0, marginTop: 0, width: '100%' }]}></View>
                                        <DatePicker
                                            style={{ width: dimensions.width, height: 250, }}
                                            textColor={'#333333'}
                                            // minimumDate={new Date()}
                                            date={deliveryDate}
                                            androidVariant={'nativeAndroid'}
                                            dividerHeight={50}
                                            onDateChange={setDeliveryDate}
                                            mode='date' />
                                    </View>
                                </View>
                            </View> :
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
                        }

                    </Pressable>
                </Modal>
            )}

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
    popup_view1: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
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
    view_inner: {
        width: '90%',
        height: 70,
    },
    view_enter: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    search_Input: {
        width: '65%',
        height: 35,
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
        width: '65%',
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
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_lot: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: colors.landing_background,
    },
    text_cancel: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: '#333333',
    },
});

export default AddNewEnquiryScreen;


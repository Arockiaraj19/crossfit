import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Platform, Text, Pressable, Alert, Dimensions, TouchableOpacity, Modal, FlatList, KeyboardAvoidingView, ScrollView, } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DropDownTextComponent from '../components/DropDownTextComponent';
import InputBoxComponent from '../components/InputBoxComponent';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {getAccessToken } from '../helpers/AppManager';

const ADDADDRESS_QUERY = gql`
mutation ($addressType: ID!, $addressLine1: String!, $addressLine2: String!, $state: ID!, $district: ID!, $town: ID!, $taluk: ID!, $village: String!, $postal: ID!){
    addUserAddress(addressType: $addressType , addressLine1: $addressLine1, addressLine2: $addressLine2, state: $state, district: $district, town: $town, taluk: $taluk village: $village, postal: $postal) 
    { 
        Id
        AddressInfoId
        UserId
        AddressType
        District
        State
        Town
        Taluk
        AddressLine1
        ImageURL
        Village
    } 
  }
`;

const AddNewAddressScreen = ({ navigation, route }) => {

    const {
        myAddress,
        type,
        userState,
        district,
        taluk,
        village,
        doorNo,
        pincode,
        next,
        placeholderType,
        placeholderState,
        placeholderDistrict,
        placeholderTaluk,
        placeholderTown,
        placeholderDoorNo,
        placeholderPinCode,
    } = useContext(AuthContext);

    const [modalVisible, setModalVisible] = React.useState(false);
    const [addressType, setAddressType] = React.useState('');
    const [addressTypeId, setAddressTypeId] = React.useState('');
    const [addressState, setAddressState] = React.useState('');
    const [addressStateId, setAddressStateId] = React.useState('');
    const [userDistrict, setUserDistrict] = React.useState('');
    const [userDistrictId, setUserDistrictId] = React.useState('');
    const [userTown, setUserTown] = React.useState('');
    const [userTownId, setUserTownId] = React.useState('');
    const [userTaluk, setUserTaluk] = React.useState('');
    const [userTalukId, setUserTalukId] = React.useState('');
    const [userVillage, setUserVillage] = React.useState('');
    const [userVillageId, setUserVillageId] = React.useState('');
    const [userDoorNo, setUserDoorNo] = React.useState('');
    const [userPincode, setUserPincode] = React.useState(0);
    const [arrayOfItems, setArrayOfItems] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [selectedType, setSelectedType] = React.useState('');
    const [popupTitle, setPopupTitle] = React.useState('');
    const [isSaveAddress, setIsSaveAddress] = React.useState(false);
    const [addUserAddress, {loading, error, data}] = useMutation(ADDADDRESS_QUERY);

    const dimensions = Dimensions.get('window');

    useEffect(() => {

    }, [])

    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile =()=> {
        navigation.navigate('ProfileDetailScreen')
    }
    const handleSelectItem = (item, index) => {
        if (selectedType == 'Type') {
            setAddressTypeId(item.Id);
            setAddressType(item.Name);
        }
        else if (selectedType == 'State') {
            setAddressStateId(item.Id);
            setAddressState(item.Name);
        }
        else if (selectedType == 'District') {
            setUserDistrictId(item.Id);
            setUserDistrict(item.Name);
        }
        else if (selectedType == 'Town') {
            setUserTownId(item.Id);
            setUserTown(item.Name);
            setArrayOfItems(item.Taluks);
        }
        else if (selectedType == 'Taluk') {
            console.log('itemitemitemitemitemitemitemitemitem',item);
            setUserTalukId(item.Id);
            setUserTaluk(item.Name);
        }
        setModalVisible(false);
    }
    const onPressShowList = (selectType) => {
        setPopupTitle((selectType == 'Type') ? type : ((selectType == 'State') ? userState : ((selectType == 'District') ? userDistrict : ((selectType == 'Town') ? userTown : userTaluk))))
        setModalVisible(true);
        setSelectedType(selectType)
    }
    const updateLoading = (isloading) => {
        setIsSaveAddress(false);
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        console.log('listlist ----- ', list)
        setArrayOfItems(list);
    }
    const updateTextInputValue = (text, type) => {
        console.log('text ----- ', text)
        if (type == 'DoorNo') {
            setUserDoorNo(text)
        }
        else if (type == 'Pincode') {
            setUserPincode(text)
        }
    }
    const onPressNext = async()=> {
        if(addressTypeId == ''){
            Alert.alert('', placeholderType, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if(addressStateId == ''){
            Alert.alert('', placeholderState, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if(userDistrictId == ''){
            Alert.alert('', placeholderDistrict, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if(userTalukId == ''){
            Alert.alert('', placeholderTaluk, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if(userDoorNo == ''){
            Alert.alert('', placeholderDoorNo, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if(userPincode == ''){
            Alert.alert('', placeholderPinCode, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            if(loading){
                setLoadingIndicator(true)
            }
            addUserAddress({
                variables: { addressType: parseInt(addressTypeId), addressLine1: userDoorNo, addressLine2: '', state: parseInt(addressStateId), district: parseInt(userDistrictId), town: parseInt(userTownId), taluk: parseInt(userTalukId), village: userVillageId, postal: parseInt(userPincode) }
              })
                .then(res => {
                    setLoadingIndicator(false)
                    navigation.goBack();
                })
                .catch(e => {
                    setLoadingIndicator(false)
                    console.log('errer ------------------',e.message);    
            });
        }
    }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={myAddress}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <ScrollView style={{ width: '100%', height: '96%',}}>
                <View style={[styles.view_box, { height: dimensions.height - 120}]}>
                    <View style={ styles.view_Inner }>
                        <DropDownTextComponent
                            title={type}
                            enterText={addressType}
                            placeHolder={placeholderType}
                            dropDownType={'Type'}
                            onPressShowList={onPressShowList} />
                        <DropDownTextComponent
                            title={userState}
                            enterText={addressState}
                            dropDownType={'State'}
                            placeHolder={placeholderState}
                            onPressShowList={onPressShowList} />
                        <DropDownTextComponent
                            title={district}
                            enterText={userDistrict}
                            dropDownType={'District'}
                            placeHolder={placeholderDistrict}
                            onPressShowList={onPressShowList} />
                        <DropDownTextComponent
                            title={village}
                            enterText={userTown}
                            dropDownType={'Town'}
                            placeHolder={placeholderTown}
                            onPressShowList={onPressShowList} />
                        <DropDownTextComponent
                            title={taluk}
                            enterText={userTaluk}
                            dropDownType={'Taluk'}
                            placeHolder={placeholderTaluk}
                            onPressShowList={onPressShowList} />
                        <InputBoxComponent
                            title={doorNo}
                            enterText={updateTextInputValue}
                            dropDownType={'DoorNo'}
                            placeHolder={placeholderDoorNo}
                            onPressShowList={onPressShowList}
                            keyboardType={'default'}
                        />
                        <InputBoxComponent
                            title={pincode}
                            enterText={updateTextInputValue}
                            dropDownType={'Pincode'}
                            placeHolder={placeholderPinCode}
                            onPressShowList={onPressShowList}
                            keyboardType={'numeric'}
                        />
                        <TouchableOpacity style={ styles.view_Next }
                            onPress={onPressNext}>
                            <Text style={ styles.task_Next }>{next}</Text>
                        </TouchableOpacity>
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
                        {console.log('id------------ ', userDistrictId)}
                        <DataFetchComponents
                            selectedId={((selectedType == 'District') ? addressStateId : ((selectedType == 'Town') ? userDistrictId : ''))}
                            isType={selectedType}
                            updateLoading={updateLoading}
                            updateDate={updateDate} />
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{popupTitle}</Text>
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
        backgroundColor: colors.background_color,
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_box: {
        marginTop: 20,
        alignItems: 'center',
        flex: 1,
    },
    view_Inner: { 
        marginTop: 20, 
        alignItems: 'center', 
        borderRadius: 6, 
        width: '90%', 
        height: '96%', 
        backgroundColor: colors.white_color
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
        color: colors.text_Color,
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
        color: colors.background_color,
        margin: 5,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    view_Next: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: '#d2f2e2',
        position: 'absolute',
        bottom: 0
    },
    task_Next: {
        fontSize: 18,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.landing_border,
        margin: 5,
    },
});

export default AddNewAddressScreen;


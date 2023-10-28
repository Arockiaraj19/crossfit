import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, ScrollView, Platform, Alert, Keyboard, TouchableOpacity,ActivityIndicator } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import InputBoxComponent from '../components/InputBoxComponent';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

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
const UPDATE_QUERY = gql`
mutation ($Id: ID!, $addressType: ID!, $addressLine1: String!, $addressLine2: String!, $state: ID!, $district: ID!, $town: ID!, $taluk: ID!, $village: String!, $postal: ID!){
    updateUserAddress(Id: $Id, addressType: $addressType , addressLine1: $addressLine1, addressLine2: $addressLine2, state: $state, district: $district, town: $town, taluk: $taluk village: $village, postal: $postal) 
    
  }
`;
const SelectAddressScreen = ({ navigation, route }) => {

    const {
        myAddress,
        district,
        stepText,
        type,
        taluk,
        village,
        userState,
        villageString,
        doorNo,
        pincode,
        placeholderDoorNo,
        placeholderPinCode,
        placeholderVillage,
        saveAddress,
    } = useContext(AuthContext);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [userDoorNo, setUserDoorNo] = React.useState('');
    const [userPincode, setUserPincode] = React.useState(0);
    const [userVillage, setUserVillage] = React.useState('');
    const [addUserAddress, { loading, error, data }] = useMutation(ADDADDRESS_QUERY);
    const [updateUserAddress, { uloading, uerror, udata }] = useMutation(UPDATE_QUERY);
    const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

    useEffect(() => {
        if(route.params.isEdit!=null&&route.params.isEdit!=undefined&&route.params.isEdit==true){
            console.log("this is one triggere or not");
            console.log(route.params.data.AddressLine1);
            setUserDoorNo(route.params.data.AddressLine1);
            setUserPincode(route.params.data.PostalCode); 
            setUserVillage(route.params.data.Village);   
                      
                    
                    }
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // or some other action
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // or some other action
            }
        );
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
        
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
    const onPressNextAction = () => {
        if (userVillage == '') {
            Alert.alert('', placeholderVillage, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userDoorNo == '') {
            Alert.alert('', placeholderDoorNo, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userPincode == '') {
            Alert.alert('', placeholderPinCode, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (userPincode.length < 6) {
            Alert.alert('', placeholderPinCode, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            console.log('loading ------------------', loading);
            setLoadingIndicator(true)


            console.log("what is the params i am getting");
          
            if(route.params.isEdit!=null&&route.params.isEdit!=undefined&&route.params.isEdit==true){
                console.log({Id:route.params.data.Id, addressType: parseInt(route?.params.addressTypeId), addressLine1: userDoorNo, addressLine2: '', state: parseInt(route?.params.addressStateId), district: parseInt(route?.params.addressDistrictId), town:"", taluk:"", village: userVillage, postal: parseInt(userPincode) });
                updateUserAddress({
                    variables: {Id:route.params.data.Id, addressType: parseInt(route?.params.addressTypeId), addressLine1: userDoorNo, addressLine2: '', state: parseInt(route?.params.addressStateId), district: parseInt(route?.params.addressDistrictId), town:1, taluk:1, village: userVillage, postal: parseInt(userPincode) }
                })
                    .then(res => {
                        setLoadingIndicator(false)
                        console.log('res ------------------', res);
                        Alert.alert('Success', "Address updated successfully", [{
                            text: 'OK', onPress: () => {
                                return  navigation.pop(3);
                            },
                        }]);
                       
                    })
                    .catch(e => {
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
            }else{
                addUserAddress({
                    variables: { addressType: parseInt(route?.params.addressTypeId), addressLine1: userDoorNo, addressLine2: '', state: parseInt(route?.params.addressStateId), district: parseInt(route?.params.addressDistrictId), town:1, taluk:1, village: userVillage, postal: parseInt(userPincode) }
                })
                    .then(res => {
                        setLoadingIndicator(false)
                        Alert.alert('Success', "Address added successfully", [{
                            text: 'OK', onPress: () => {
                                return  navigation.pop(3);
                            },
                        }]);
                    })
                    .catch(e => {
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
            }
           
        }
    }
    const updateTextInputValue = (text, type) => {
        console.log('text ----- ', text)
        if (type == 'DoorNo') {
            setUserDoorNo(text)
        }
        else if (type == 'Pincode') {
            setUserPincode(text)
        }
        else if (type == 'Village') {
            setUserVillage(text)
        }
    }
    const onPressShowList = (selectType) => {

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
            <ScrollView style={{ width: '100%', height: '100%', }}>
                <View style={{ width: '100%', }}>

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
                    <View style={{ marginTop: 3, width: '100%', height: 40, flexDirection: 'row', backgroundColor: '#f8f1d1' }}>
                        <View style={{ width: 50, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#d8c368' }}>
                            <Text style={styles.text_step}>{stepText}</Text>
                            <Text style={styles.text_step}>{'02'}</Text>
                        </View>
                        <View style={{ height: 40, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, }}>
                                <Text style={styles.text_title}>{district + ' : '}</Text>
                                <Text style={[styles.text_state, { color: '#a69033' }]}>{route.params.addressDistrict}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ marginTop: 3, width: '100%', height: 60, flexDirection: 'row', backgroundColor: '#fbe8e9' }}>
                        <View style={{ width: 50, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff9a9f' }}>
                            <Text style={styles.text_step}>{stepText}</Text>
                            <Text style={styles.text_step}>{'03'}</Text>
                        </View>
                        <View style={{ height: 60, justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10, }}>
                                <Text style={styles.text_title}>{taluk + '    : '}</Text>
                                <Text style={[styles.text_state, { color: '#e96b71' }]}>{route.params.userTaluk}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 5, marginLeft: 10, marginRight: 10, }}>
                                <Text style={styles.text_title}>{village + '    : '}</Text>
                                <Text style={[styles.text_state, { color: '#e96b71' }]}>{route.params.userTown}</Text>
                            </View>
                        </View>
                    </View> */}
                    <View style={{ marginTop: 15, width: '100%', height: 24, }}>
                        <View style={styles.view_pageCount}>
                            <Text style={styles.text_pageCount}>{'3/3'}</Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: '70%', }}>
                        <InputBoxComponent
                        value={userVillage}
                            title={villageString}
                            enterText={updateTextInputValue}
                            dropDownType={'Village'}
                            placeHolder={placeholderVillage}
                            onPressShowList={onPressShowList}
                            isBorder={true}
                            keyboardType={'default'}
                        />
                        <InputBoxComponent
                        value={userDoorNo}
                            title={doorNo}
                            enterText={updateTextInputValue}
                            dropDownType={'DoorNo'}
                            placeHolder={placeholderDoorNo}
                            onPressShowList={onPressShowList}
                            isBorder={true}
                            keyboardType={'default'}
                        />
                        <InputBoxComponent
                        value={userPincode}
                            title={pincode}
                            enterText={updateTextInputValue}
                            dropDownType={'Pincode'}
                            placeHolder={placeholderPinCode}
                            onPressShowList={onPressShowList}
                            isBorder={true}
                            keyboardType={'numeric'}
                            maxLength={6}
                        />
                    </View>
                </View>
            </ScrollView>
            {(!isKeyboardVisible) && (
                <TouchableOpacity style={styles.view_bottom}
                    onPress={onPressNextAction}>
              {loadingIndicator? <ActivityIndicator size="small" color={colors.white_color} />: <Text style={styles.text_next}>{route.params.isEdit!=null&&route.params.isEdit!=undefined&&route.params.isEdit==true?"Update":"Save"}</Text>}     
                </TouchableOpacity>
            )}

          
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

export default SelectAddressScreen;


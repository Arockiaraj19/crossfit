import { useMutation } from '@apollo/react-hooks';
import { useFocusEffect } from '@react-navigation/native';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import { graphql } from 'react-apollo';
import { Alert, BackHandler, FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AddressInfoComponent from '../components/AddressInfoComponent';
import { AuthContext } from '../components/AuthContext';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import TagsView from '../components/TagsView';
import { colors, fonts, images } from '../core';

const DETELEADDRESSQUIRY_QUERY = gql`
mutation ($Id: ID!){
    deleteUserAddress(Id: $Id) 
  }
`;

const GETADDRESS_QUERY = gql`
query {
    getUserAddress{ 
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
        PostalCode
        
    },
    getAddressTypes{ 
        Id 
        Name 
        Code 
        ImageURL
    } 
  }
`;

const DeliveryAddressScreen = ({ navigation, route }) => {
    const {
        deliverAddress,
        pickupAddress,
        addNewAddress,
        noAddress,
        continueText,
        selectAddress,
        loginToken,
        sortBy,
        deleteAddressAlert,
        deleteAddress,
    } = useContext(AuthContext);
    const [isFetching, setIsFetching] = useState(false);
    const [addressList, setAddressList] = useState([]);
    const [addressSelected, setAddressSelected] = useState('');
    const [addressSelectedId, setAddressSelectedId] = useState(0);
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [deleteUserAddress, { loading, error, data }] = useMutation(DETELEADDRESSQUIRY_QUERY);
    const [cetogoriesList, setCetogoriesList] = React.useState([]);
    const [selectedCategory, setSelectedCategory] = React.useState('');
    const [fullAddressList, setFullAddressList] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            setAddressSelected('')
            setAddressSelectedId(0)
            setLoadingIndicator(true)
            setIsFetching(true)
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {
        if (BackHandler) {
            BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
            };
        }
    }, [])
    const handleBackButtonClick = () => {
        navigation.goBack();
        return true;
    }
    const onPressBack = async () => {
        await EncryptedStorage.setItem('currentPage', 'subCategory');
        navigation.goBack();

    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const onPressAddNewAddress = () => {
        navigation.navigate('SelectStateScreen', { isType: '' });
    }

    const editAddress = (data) => {
        console.log('what is the data');
        console.log(data);
        navigation.navigate('SelectStateScreen', { isType: '', isEdit: true, data: data });
    }
    const updateValue = () => {
        setIsFetching(false);
    }

    // const [getAddress,deliveryData ] =useQuery(GETADDRESS_QUERY);

    const updateDate = (data, addressTypes) => {
       


        var templist = data;
        var addresses = []
        templist.map((addressInfo, i) => {
            var tempInfo = {
                "Id": addressInfo.Id,
                "AddressInfoId": addressInfo.AddressInfoId,
                "UserId": addressInfo.UserId,
                "AddressType": addressInfo.AddressType,
                "District": addressInfo.District,
                "State": addressInfo.State,
                "Town": addressInfo.Town,
                "Taluk": addressInfo.Taluk,
                "AddressLine1": addressInfo.AddressLine1,
                "ImageURL": addressInfo.ImageURL,
                "Village": addressInfo.Village,
                "PostalCode": addressInfo.PostalCode,
                isSelected: false
            }
            addresses.push(tempInfo)
        })
        setFullAddressList(addresses);
        setAddressList(addresses);
        setCetogoriesList(addressTypes);
        setIsFetching(false);
        setLoadingIndicator(false);
    }



    const GetUserAddress = graphql(GETADDRESS_QUERY)(props => {
        const { error, data, loading } = props.data;

        if (props.data && props.data.getUserAddress) {
            updateDate(props.data.getUserAddress, props.data.getAddressTypes);

            return (
                <View>
                </View>
            );
        }
        if (error) {
            setLoadingIndicator(false);
            setIsFetching(false);
            console.log('errorerrorerrorerror', error);
            return (
                <View>
                </View>
            );
        }
        // setTimeout(async () => {
        //     updateValue(true);
        // }, 500);
        return <View />;
    });
    const onPressSelectAddress = (item) => {
        var templist = addressList;
        var addressTemp = [];
        var tempAddress = '';
        var tempAddressId = 0;
        templist.map((addtessInfo, i) => {
            var tempInfo = addtessInfo;
            tempInfo.isSelected = (item.Id == addtessInfo.Id) ? true : false;
            if (item.Id == addtessInfo.Id) {
                tempAddressId = item.Id;
                tempAddress =item.AddressLine1 + ', ' + item.Village + ', ' + item.Taluk + ', ' + item.District + ', ' + item.State + " - " + item.PostalCode;
            }
            addressTemp.push(tempInfo)
        })
        setAddressSelectedId(tempAddressId);
        setAddressSelected(tempAddress);
        setAddressList(addressTemp);
    }
    const onPressDeleteAddress = (item) => {
        Alert.alert('', deleteAddressAlert, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {


                setIsFetching(true);
                setLoadingIndicator(true);
                console.log('item ----', item)
                deleteUserAddress({
                    variables: { Id: item.AddressInfoId }
                })
                    .then(res => {
                        setLoadingIndicator(false)
                        Alert.alert('', res.data.deleteUserAddress, [{
                            text: 'Ok',
                            onPress: () => {
                                setAddressList([]);
                                setLoadingIndicator(true);
                                setIsFetching(true);

                                return;
                            },
                        },
                        ]);
                    })
                    .catch(e => {
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
                return;
            },
        },
        ]);
    }
    const onPressContinue = () => {
        if (addressSelected == '') {
            Alert.alert('', selectAddress, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            if (route.params.isType == 'buy') {
                navigation.navigate('BidsDetailListScreen', { details: route?.params.details, addressId: addressSelectedId })
            }
            else if (route.params.isType == 'sell') {
                navigation.navigate('AddProductLotScreen', { addressId: addressSelectedId, address: addressSelected, productDetail: route?.params.details })
            }
            else if (route.params.isType == 'enquire') {
                navigation.navigate('AddNewEnquiryScreen', { addressId: addressSelectedId, address: addressSelected, productDetail: route?.params.details })
            }
        }
    }
    const onPressSelectCategory = (typeInfo) => {
        setSelectedCategory(typeInfo.Name);
        const filtered = fullAddressList.filter(entry => entry.AddressType == typeInfo.Name);
        setAddressList(filtered);

    }
    return (
        <View style={styles.container}>
            {(route.params.isType == 'profile') ? <View style={styles.view_header}>
                <View style={styles.view_inner}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                        onPress={onPressBack}>
                        <Image style={{ width: 10, height: 18 }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{route.params.isType == 'sell' ? pickupAddress : deliverAddress}</Text>
                </View></View> : <View style={styles.view_header}>

                <HeaderComponents
                    headerTitle={route.params.isType == 'sell' ? pickupAddress : deliverAddress}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            }
            {(route.params.isType != 'profile') && (
                <View style={styles.view_top}>
                    <Image style={styles.image_category}
                        source={{ uri: route?.params.details.ImageURL }}
                        resizeMode={'contain'}>
                    </Image>
                    <View style={styles.view_text}>
                        <Text style={styles.text_name}>{route?.params.details.Name}</Text>
                        <Text style={styles.text_description}>{route?.params.details.Name}</Text>
                    </View>
                </View>
            )}
            {(route.params.isType == 'profile') && (
                <View style={{ width: '100%', height: 140, backgroundColor: '#e9f5f1' }}>
                    <Text style={styles.text_sort}>{sortBy}</Text>
                    <ScrollView style={styles.view_tag}>
                        <TagsView
                            bgColor={'#01a552'}
                            allCategories={cetogoriesList}
                            selected={selectedCategory}
                            onPressSelectCategory={onPressSelectCategory}
                        />
                    </ScrollView>
                </View>
            )}
            {(addressList.length == 0) ?
                <View style={styles.view_addressEmpty}>
                    <View style={{ width: '100%', height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ marginRight: 10, width: 40, height: 40 }}
                            source={images.LOCATIONICON}>
                        </Image>
                        <Text style={styles.text_noAddress}>{noAddress}</Text>
                    </View>
                    <Pressable style={styles.touch_view}
                        onPress={onPressAddNewAddress}>
                        <Text style={styles.text_addNew}>{'+ ' + addNewAddress}</Text>
                    </Pressable>
                </View> :
                <View style={styles.view_list}>
                    <View style={styles.view_addNew}>
                        <TouchableOpacity style={styles.view_InnerAdd}
                            onPress={onPressAddNewAddress}>
                            <Text style={styles.text_addNew}>{'+ ' + addNewAddress}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        style={{ flex: 1, marginBottom: 10, }}
                        data={addressList}
                        keyExtractor={(x, i) => i}
                        renderItem={({ item, index }) => {
                            return (
                                <AddressInfoComponent
                                    props={item}
                                    deleteAddress={deleteAddress}
                                    onPressSelectAddress={onPressSelectAddress}
                                    onPressDeleteAddress={() =>
                                        onPressDeleteAddress(item)
                                    }
                                    edit={() => editAddress(item)}
                                />
                            )
                        }}
                    />
                    {(route.params.isType != 'profile') && (
                        <View style={{ marginTop: 10, marginBottom: 35, width: '100%', height: 45, alignItems: 'center' }}>
                            <TouchableOpacity style={styles.continue_touch}
                                onPress={onPressContinue}>
                                <Text style={styles.continue_text}>{continueText}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            }
            {(isFetching) && (
                <GetUserAddress />
            )}
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
    view_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (Platform.OS == 'android') ? 10 : 40,
        width: '100%',
        height: 40,
    },
    text_title: {
        marginLeft: 25,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: colors.black_color,
    },
    image_category: {
        marginLeft: 20,
        width: 100,
        height: 80,
        borderRadius: 6,
        backgroundColor: colors.white_color,
    },
    view_top: {
        width: '100%',
        height: 100,
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#f0efef'
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
    view_addressEmpty: {
        marginTop: 30,
        width: '85%',
        height: 100,
        borderRadius: 6,
        backgroundColor: colors.white_color,
        shadowColor: 'lightgray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 5,
    },
    touch_view: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d2f2e2',
        borderBottomRightRadius: 6,
        borderBottomLeftRadius: 6,
    },
    text_addNew: {
        marginLeft: 10,
        textAlign: 'right',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: '#01a552',
    },
    text_noAddress: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: '#cccbcb',
    },
    view_list: {
        width: '100%',
        height: '76%',

    },
    view_addNew: {
        width: '100%',
        height: 40,
        justifyContent: 'center',
    },
    view_InnerAdd: {
        height: 30,
        justifyContent: 'center',
        position: 'absolute',
        right: 20,
        backgroundColor: 'transparent'
    },
    continue_text: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        textAlign: 'center',
        fontSize: 18,
        color: colors.white_color
    },
    continue_touch: {
        width: '80%',
        height: 45,
        justifyContent: 'center',
        backgroundColor: colors.landing_background,
        borderRadius: 4,
    },
    view_tag: {
        flex: 1,
        marginTop: 10,
        marginBottom: 15,
    },
    text_sort: {
        marginTop: 15,
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: colors.text_Color,
    },
});

export default DeliveryAddressScreen;


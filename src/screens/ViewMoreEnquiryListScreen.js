import React, { useEffect, useContext, useState, useCallback,useRef } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Platform, Alert,TextInput,AppState } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import InfoBoxComponents from '../components/InfoBoxComponents';
import { useFocusEffect } from '@react-navigation/native';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import { GETVIEWMOREENQUIRIESDATA_QUERY } from '../helpers/Schema';
import { filterItem } from '../helpers/AppManager';

const ViewMoreEnquiryListScreen = ({ navigation, route }) => {
    const {
        enquiries,
        sellerText,
        buySearchPlaceholder
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [arrayOfEnquiries, setArrayOfEnquiries] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [searchText, setSearchText] = useState('')
    const [duplicateEnquiry,setDuplicateEnquiry] = useState([])
    const { getData : getEnquiry, loading: enquiryLoading, error: enquiryEror, data: enquiryData } = fetchDataFromServer(GETVIEWMOREENQUIRIESDATA_QUERY);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            getEnquiry()
            setIsFetch(false);
            setLoadingIndicator(true);
            return () => {
                isActive = false;
            };
        }, [])
    );
    useEffect(() => {
        if(enquiryData){
        updateDate(enquiryData)
        }
    }, [enquiryData])

    useEffect(()=>{
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
              appState.current.match(/inactive|background/) &&
              nextAppState === 'active'
            ) {
             getEnquiry()
            }
            appState.current = nextAppState;
            setAppStateVisible(appState.current);
          });
      
          return () => {
            subscription.remove();
          };
    },[])

    const onPressBack = () => {
        if (route?.params?.isProfile) {
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeScreen');
        }
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const updateLoading = (isloading) => {
        setIsFetch(true);
        setLoadingIndicator(isloading);
    }
    const updateDate = (list) => {
        setLoadingIndicator(false);
        console.log('listlistlistlist', list);
        setIsFetch(true);
        setLoadingIndicator(false);
        var tempArray = list?.getDashboardEnquiryViewMore;
        if (tempArray?.length == 0) {
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
        }
        setArrayOfEnquiries(tempArray);
        setDuplicateEnquiry(tempArray)
    }
    const onPressSellerInfo = (item) => {
        setSearchText('')
        setArrayOfEnquiries([])
        navigation.navigate('ViewEnquiryInfoScreen', { details: item })
    }

    const handleSearch = useCallback((text) => {
        setSearchText(text)
        const enquiryList = [...duplicateEnquiry]
        if(searchText != ''){
            const filterData = filterItem(enquiryList,text)
            setArrayOfEnquiries(filterData)
        } else{
            setArrayOfEnquiries(duplicateEnquiry)
        }
    },[searchText])

    const onPressRemoveSearch = () => {
        setSearchText('')
        setArrayOfEnquiries(duplicateEnquiry)
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={enquiries}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage}
                    otherIcons={true} />
            </View>
            <View style={styles.view_mainSearch}>
                <View style={styles.view_Search}>
                    <Image style={styles.search_icon}
                        source={images.SEARCHICON} />
                    <TextInput style={styles.search_Input}
                        value={searchText}
                        onChangeText={(text) => handleSearch(text)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        returnKeyType='done'
                        placeholder={buySearchPlaceholder}
                        placeholderTextColor={colors.search_placeholder}
                        // onSubmitEditing={() => handleSearch()}
                        >
                    </TextInput>
                     {(searchText != '') && (
                        <TouchableOpacity style={{ marginLeft: 5, justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, backgroundColor: 'lightgray'}}
                            onPress={onPressRemoveSearch}>
                            <Text>{'X'}</Text>
                        </TouchableOpacity>
                    )} 
                </View>
            </View>
            <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(238, 238, 238, 0.3)' }}></View>
            {!enquiryLoading ? (
                <View style={styles.view_main}>
                    {(isEmpty) && (
                        <Text style={styles.text_empty}>{'No Enquiry is available'}</Text>
                    )}
                    <View style={styles.view_table}>
                        <FlatList
                            style={{ marginTop: 10, flex: 1, marginBottom: 10, }}
                            data={arrayOfEnquiries}
                            numColumns={2}
                            keyExtractor={(x, i) => i}
                            renderItem={({ item, index }) => {
                                return (
                                    <InfoBoxComponents
                                        props={item}
                                        index={index}
                                        isEnquiry={true}
                                        enquiries={enquiries}
                                        sellerText={sellerText}
                                        onPressSellerInfo={onPressSellerInfo}
                                    />
                                )
                            }}
                        />
                    </View>

                </View>)
                : <Loading />
            }
            {/* {(!isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'ViewMoreEnquiries'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
            {loadingIndicator && <Loading />} */}
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(238, 238, 238, 0.3)',
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_main: {
        alignItems: 'center',
        width: '100%',
        height: '90%',
    },
    view_table: {
        marginTop: 20,
        width: '90%',
        height: '93%',
        borderRadius: 5,
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
    view_status: {
        marginTop: 10,
        width: 180,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
    },
    text_status: {
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 14,
        color: '#444444',
    },
    view_all: {
        marginLeft: 10,
        width: 100,
        height: 30,
        flexDirection: 'row',
        borderRadius: 15,
        borderWidth: 1,
        alignItems: 'center',
        borderColor: colors.line_background,
    },
    text_statusAll: {
        marginLeft: 15,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 12,
        color: '#666666',
    },
    image_dropdown: {
        position: 'absolute',
        right: 10,
        width: 10,
        height: 5,
    },
    text_empty: {
        width: '100%',
        textAlign: 'center',
        marginTop: 75,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color
    },
    popup_view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lite_black,
    },
    modalView: {
        width: '90%',
        height: '40%',
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
        marginBottom: 20,
    },
    title_view: {
        flex: 1,
        color: colors.text_Color,
        flexDirection: "column",
        height: 40,
    },
    line: {
        height: 1,
        backgroundColor: '#f0f0f0',
    },
    task_title: {
        flex: 1,
        fontSize: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        margin: 5,
    },
    view_mainSearch: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        alignItems: 'center',
    },
    view_Search: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors.white_color,
        height: 40,
        width: '90%',
        marginLeft: 20,
        borderRadius: 4,
        borderColor: colors.line_background,
        borderWidth: 1,
    },
    search_icon: {
        marginTop: 3,
        marginLeft: 12,
        width: 15,
        height: 15,
    },
    search_Input: {
        width: '80%',
        marginLeft: 8,
        height: 40,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
        paddingVertical: 0,
    },
});

export default ViewMoreEnquiryListScreen;


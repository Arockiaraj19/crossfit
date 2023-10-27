import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Platform, Alert, Modal, Pressable, } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import LotsInfoComponents from '../components/LotsInfoComponents';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { useFocusEffect } from '@react-navigation/native';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import { GETVIEWLOTS_QUERY } from '../helpers/Schema';
import { showToastMessage } from '../helpers/AppManager';

const DELETELOT_QUERY = gql`
mutation ($lotId: ID!){
    deleteLot(lotId: $lotId) 
    
  }
`;
const ViewLotListScreen = ({ navigation, route }) => {
    const {
        viewLot,
        statusText,
        productPrice,
        pickup,
        updateon,
        editLot,
        deleteLotInfo,
        deleteLotAlert,
        bidView,
        share,
        organic,
        noLods,
    } = useContext(AuthContext);

    const [addressList, setAddressList] = useState([]);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [deleteLot, { loading, error, data }] = useMutation(DELETELOT_QUERY);
    const [arrayOfMain, setArrayOfMain] = React.useState([]);
    const [arrayOfStates, setArrayOfStates] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [bitStatusText, setBitStatusText] = React.useState('All');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [statusOne, setStatusOne] = React.useState('');
    const [statusTwo, setStatusTwo] = React.useState('');
    const [statusThree, setStatusThree] = React.useState('');
    const [statusFour, setStatusFour] = React.useState('');
    const [isLoading,setLoading] = useState(false)

    const { getData: getViewLotDetails, loading: viewLotLoading, error: ViewLotEror, data: ViewLotData } = fetchDataFromServer(GETVIEWLOTS_QUERY)

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            getViewLotDetails()
            setIsFetch(false);
            setBitStatusText('All')
            setLoadingIndicator(true);
            return () => {
                isActive = false;
            };
        }, [])
    );
    useEffect(() => {
        updateDate(ViewLotData)
    }, [ViewLotData])

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
        var tempArray = list?.getLots ? list?.getLots : [];
        if (tempArray?.length == 0) {
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
        }
        var arrayInfo = []
        tempArray.map((teamInfo, i) => {
            console.log('teamInfoteamInfoteamInfoteamInfo', teamInfo)
            if (teamInfo.Status == '0') {
                teamInfo.Code = 'All'
            }
            else if (teamInfo.Status == '1') {
                teamInfo.Code = 'Open'
            }
            else if (teamInfo.Status == '2') {
                teamInfo.Code = 'Done'
            }
            else if (teamInfo.Status == '3') {
                teamInfo.Code = 'Declined'
            }
            else if (teamInfo.Status == '4') {
                teamInfo.Code = 'Partially Approved'
            }
            arrayInfo.push(teamInfo)
        })
        setArrayOfMain(arrayInfo);
        setAddressList(arrayInfo);

        var tempStatusArray = list?.getLotStatus;
        console.log('tempStatusArraytempStatusArraytempStatusArraytempStatusArray', tempStatusArray)
        var arrayStatusInfo = []
        let param = {
            'Id': '0',
            'Name': 'All',
            'flag': 'All',
            'Code': 'A'
        }
        arrayStatusInfo.push(param)
        tempStatusArray?.map((teamInfo, i) => {
            if (teamInfo.Id == '0') {
                teamInfo.flag = 'All'
            }
            else if (teamInfo.Id == '1') {
                teamInfo.flag = 'Open'
                setStatusOne(teamInfo.Name)
            }
            else if (teamInfo.Id == '2') {
                teamInfo.flag = 'Done'
                setStatusTwo(teamInfo.Name)
            }
            else if (teamInfo.Id == '3') {
                teamInfo.flag = 'Declined'
                setStatusThree(teamInfo.Name)
            }
            else if (teamInfo.Id == '4') {
                teamInfo.flag = 'Partially'
                setStatusFour(teamInfo.Name)
            }
            arrayStatusInfo.push(teamInfo)
        })

        setArrayOfStates(arrayStatusInfo);
    }
    const onPressLotEdit = (item) => {
        navigation.navigate('UpdateLotInfoScreen', { lotInfo: item, isEdit: true, isProfile: route?.params?.isProfile });
    }
    const onPressLotDelete = (item) => {
        Alert.alert('', deleteLotAlert, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {
                setLoading(true)
                deleteLot({
                    variables: { lotId: parseInt(item.Id) }
                })
                    .then(res => {
                        setLoading(false)
                        showToastMessage('toastPopup',`${item.CommodityChild} ${res.data.deleteLot}`)
                        getViewLotDetails()
                    })
                    .catch(e => {
                        setLoading(false)
                    });
                return;
            },
        },
        ]);
    }
    const onPressLotDetail = (item) => {
        console.log("ViewLotDetailsScreen", item.Id)
        navigation.navigate('ViewLotDetailsScreen', { lotId: item.Id });
    }
    const handleSelectItem = (item, index) => {
        console.log('itemitemitemitemitem', item)
        setBitStatusText(item.Name)
        if (item.Name == 'All') {
            setAddressList(arrayOfMain)
            if (arrayOfMain.length == 0) {
                setIsEmpty(true)
            }
            else {
                setIsEmpty(false)
            }
        }
        else {
            const filtered = arrayOfMain.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(item.flag)));
            setAddressList(filtered)
            if (filtered.length == 0) {
                setIsEmpty(true)
            }
            else {
                setIsEmpty(false)
            }
        }
        setModalVisible(false)
    }
    const onPressShowStates = () => {
        setModalVisible(true)
        // setArrayOfList(arrayOfMain)
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={viewLot}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage}
                    otherIcons={true} />
            </View>
            {!viewLotLoading  ?
            <View style={styles.view_main}>
                <View style={styles.view_status}>
                    <Text style={styles.text_status}>{statusText}</Text>
                    <TouchableOpacity style={styles.view_all}
                        onPress={onPressShowStates}>
                        <Text style={styles.text_statusAll}>{bitStatusText}</Text>
                        <Image style={styles.image_dropdown}
                            source={images.DROPDOWNARROWICON}></Image>
                    </TouchableOpacity>
                </View>
                {(isEmpty) && (
                    <Text style={styles.text_empty}>{noLods}</Text>
                 )} 
                
                <FlatList
                    style={{ flex: 1, marginTop: 50, marginBottom: 20, }}
                    data={addressList}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item, index }) => {
                        return (
                            <LotsInfoComponents
                                props={item}
                                bidView={bidView}
                                share={share}
                                StatuName = {(item.Status == '1') ? statusOne : ( (item.Status == '3') ? statusThree : ((item.Status == '4') ? statusFour : statusTwo))}
                                organic={organic}
                                updateon={updateon}
                                pickup={pickup}
                                editLot={editLot}
                                deleteLotInfo={deleteLotInfo}
                                productPrice={productPrice}
                                onPressLotEdit={onPressLotEdit}
                                onPressLotDelete={onPressLotDelete}
                                onPressLotDetail={onPressLotDetail} />
                        )
                    }}
                 /> 
            </View> :  <Loading /> }
            {/* {(!isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Lots'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )} */}
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
                            <Text style={styles.modalText}>{'Status'}</Text>
                            <View style={styles.line} />
                            <View style={styles.view_List}>
                                <FlatList
                                    style={styles.list}
                                    data={arrayOfStates}
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
            {isLoading && <Loading />}
        </View>
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
    view_main: {
        width: '100%',
        height: '90%',
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
});

export default ViewLotListScreen;


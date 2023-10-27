import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, FlatList, Platform, TouchableOpacity, Alert, Modal, Pressable, } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import HeaderComponents from '../components/HeaderComponents';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import BidsListComponents from '../components/BidsListComponents';
import { useFocusEffect } from '@react-navigation/native';
import { useMutation } from '@apollo/react-hooks';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import { GETBIDS_QUERY } from '../helpers/Schema';
import { showToastMessage } from '../helpers/AppManager';


import gql from 'graphql-tag';

const DELETEBID_QUERY = gql`
mutation ($bidId: ID!){
    deleteBid(bidId: $bidId) 
    
  }
`;
const BidsProductsScreen = ({ navigation, route }) => {

    const [arrayOfList, setArrayOfList] = React.useState([]);
    const [arrayOfMain, setArrayOfMain] = React.useState([]);
    const [arrayOfStates, setArrayOfStates] = React.useState([]);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [deleteBid, { loading, error, data }] = useMutation(DELETEBID_QUERY);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [bitStatusText, setBitStatusText] = React.useState('All');
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [statusOne, setStatusOne] = React.useState('');
    const [statusTwo, setStatusTwo] = React.useState('');
    const [statusThree, setStatusThree] = React.useState('');
    const [statusFour, setStatusFour] = React.useState('');
    const [isLoading,setLoading] = useState(false)

    const {getData: getbidDetails, loading: bidLoading, error: bidError, data: bidData} = fetchDataFromServer(GETBIDS_QUERY)

    const {
        viewLot,
        statusText,
        bitsTitle,
        biddedOn,
        productPrice,
        bidPrice,
        pickup,
        editBits,
        deleteBits,
        deleteBidAlert,
        noBids,
    } = useContext(AuthContext);

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            getbidDetails()
            setLoadingIndicator(true)
            setBitStatusText('All')
            setArrayOfList([]);
            setTimeout(async () => {
                setBitStatusText('All')
                setIsFetch(false);
            }, 500);
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {
       if(bidData){
        updateDate(bidData)
       }
    }, [bidData])
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = () => {
        navigation.navigate('ProfileDetailScreen')
    }
    const updateLoading = (isloading) => {
        console.log('updateLoadingupdateLoadingupdateLoadingupdateLoading --- ');
    }
    const updateDate = (list) => {
        console.log('listlistlistlist 321212121212 --- ', list);
        setLoadingIndicator(false);
        if(list.getBids != undefined){
            setIsFetch(true)
            var tempArray = list.getBids;
            if (tempArray.length == 0) {
                console.log('tempArray 111 ', tempArray);
                setIsEmpty(true)
            }
            else {
                console.log('tempArray 22222 ', tempArray);
                setIsEmpty(false)
            }
            var arrayInfo = []
            tempArray.map((teamInfo, i) => {
                if (teamInfo.Status == '0') {
                    teamInfo.Code = 'All'
                }
                else if (teamInfo.Status == '1') {
                    teamInfo.Code = 'Open'
                }
                else if (teamInfo.Status == '2') {
                    teamInfo.Code = 'Approved'
                }
                else if (teamInfo.Status == '3') {
                    teamInfo.Code = 'Declined'
                }
                else if (teamInfo.Status == '4') {
                    teamInfo.Code = 'Partial Bid'
                }
                arrayInfo.push(teamInfo)
            })
            setArrayOfMain(arrayInfo);
            setArrayOfList(arrayInfo);
    
            var tempStatusArray = list.getBidStatus;
            console.log('tempStatusArraytempStatusArraytempStatusArraytempStatusArray',tempStatusArray)
            var arrayStatusInfo = []
            let param = {
                'Id': '0',
                'Name': 'All',
                'Code': 'A'
            }
            arrayStatusInfo.push(param)
            tempStatusArray.map((teamInfo, i) => {
                if (teamInfo.Id == '1') {
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
        else {
            setIsFetch(false)
        }
    }
    const editBidsInfo = (info, isEdit) => {
    }
    const onPressPlaceEdit = (bidsInfo) => {
        navigation.navigate('UpdateBidsInfoScreen', { details: bidsInfo, isEdit: true })
    }
    const onPressBitDelete = (bidsInfo) => {
        Alert.alert('', deleteBidAlert, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {
                setLoading(true)
                setIsFetch(true);
                deleteBid({
                    variables: { bidId: parseInt(bidsInfo.Id) }
                })
                    .then(res => {
                        setLoading(false)
                        showToastMessage('toastPopup',`${bidsInfo.CommodityChildName} ${res.data.deleteBid}`)
                        getbidDetails()
                        console.log('res - - - - - - - - -- - - - - ', res);
                    })
                    .catch(e => {
                        setLoading(false)
                        setLoadingIndicator(false)
                        console.log('errer ------------------', e.message);
                    });
                return;
            },
        },
        ]);
    }
    const onPressBack = () => {
        if (route?.params?.isProfile) {
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeScreen');
        }
    }
    const handleSelectItem = (item, index) => {
        setBitStatusText(item.Name)
        if (item.Name == 'All') {
            setArrayOfList(arrayOfMain)
            if(arrayOfMain.length == 0){
                setIsEmpty(true)
            }
            else {
                setIsEmpty(false)
            }
        }
        else {
            const filtered = arrayOfMain.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(item.Name)));
            setArrayOfList(filtered)
            if (filtered.length == 0) {
                console.log('filtered 111 ', filtered);
                setIsEmpty(true)
            }
            else {
                console.log('filtered 22222 ', filtered);
                setIsEmpty(false)
            }
        }
        setModalVisible(false)
    }
    const onPressShowStates = () => {
        setModalVisible(true)
        // setArrayOfList(arrayOfMain)
    }
    const onPressViewLot =(info)=> {
        var params = info;
        params.isAccept = false
        console.log('BidProductScreen paramsparamsparamsparamsparams',params)
        navigation.navigate('EditBidsInfoScreen', params );
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={bitsTitle}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage}
                    otherIcons={true} />
            </View>
            {!bidLoading ? 
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
                    <Text style={styles.text_empty}>{noBids}</Text>
                )}
                <FlatList
                    style={{ flex: 1, marginTop: 50, marginBottom: 20, }}
                    data={arrayOfList}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item, index }) => {
                        return (
                            <BidsListComponents
                                props={item}
                                isBottom={true}
                                isMyBid={true}
                                StatuName = {(item.Status == '1') ? statusOne : ( (item.Status == '3') ? statusThree : ((item.Status == '4') ? statusFour : statusTwo))}
                                biddedOn={biddedOn}
                                productPrice={productPrice}
                                bidPrice={bidPrice}
                                pickup={pickup}
                                editBits={editBits}
                                deleteBits={deleteBits}
                                viewLot={viewLot}
                                onPressViewLot={onPressViewLot}
                                onPressPlaceEdit={onPressPlaceEdit}
                                onPressBitDelete={onPressBitDelete}
                                editBidsInfo={editBidsInfo} />
                        )
                    }}
                />
            </View>:
            <Loading />
        }
            {/* {(!isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Bids'}
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
        backgroundColor: colors.background_color,
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

export default BidsProductsScreen;


import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, FlatList, Platform, Alert, PermissionsAndroid, Linking, } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import DataFetchComponents from '../components/DataFetchComponents';
import Loading from '../components/Loading';
import MandiRateComponents from '../components/MandiRateComponents';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import ImageViewer from 'react-native-image-zoom-viewer';
// import RNFS from "react-native-fs";
// import FileViewer from "react-native-file-viewer";

const DELETELOT_QUERY = gql`
mutation ($lotId: ID!){
    deleteLot(lotId: $lotId) 
    
  }
`;
const MandiListDetailScreen = ({ navigation, route }) => {
    const {
        mandiRates,
        noMandi,externalStoragePermission,appNeedWritePermission
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [isFetch, setIsFetch] = useState(true);
    const [arrayOfMandi, setArrayOfMandi] = React.useState([]);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [isShowImage, setIsShowImage] = React.useState(false);
    const [imageUrl, setImageUrl] = React.useState('');
    const viewHeight = Dimensions.get("window").height - ((Platform.OS == 'android') ? 60 : 90);

    useEffect(() => {
        setTimeout(async () => {
            setLoadingIndicator(true);
            setIsFetch(false);
        }, 100);
    }, [])
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
        // if(isloading==false){
        //     setIsFetch(true);
        // }
        if(isloading==false){
            setLoadingIndicator(false);
        }
   
    }
    const updateDate = (list) => {
        setLoadingIndicator(false);
        console.log('listlistlistlist ----- ', list);
     setIsFetch(true);
        setLoadingIndicator(false);
        if(list.length == 0){
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
        }
        setArrayOfMandi(list)
    }
    function getUrlExtension(url) {
        return url.split(/[#?]/)[0].split(".").pop().trim();
    }
    const onPressViewImage =(info)=> {
        Linking.openURL(info.FilePath)
 
    }
    const onPressHideImage =()=>{
        setIsShowImage(false)
        setImageUrl('')
    }
    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: externalStoragePermission,
                        message: appNeedWritePermission,
                    },
                );
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const onPressSaveImage = async(url)=>{
        // let isStoragePermitted = await requestExternalWritePermission();
        // if (isStoragePermitted) {
        //     RNFetchBlob.config({
        //         fileCache: true,
        //         appendExt: 'png',
        //       })
        //         .fetch('GET', url)
        //         .then(res => {
        //           CameraRoll.saveToCameraRoll(res.data, 'photo')
        //             .then(alert('Image Save successfully', 'Photo added to camera roll!'))
        //             .catch(err => console.log('errerrerrerrerrerr', err))
        //         })
        //         .catch(error => console.log(error))
        // }
        // else {
        //     CameraRoll.saveToCameraRoll(url)
        //     .then(alert('Image Save successfully', 'Photo added to camera roll!')) 
        // .catch(err => console.log('err:', err))
        // }
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={mandiRates}
                    isBackButton={true}
                    onPressBack={onPressBack}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage}
                    otherIcons={true} />
            </View>
            <View style={styles.view_main}>
                {(isEmpty) && (
                    <Text style={styles.text_empty}>{noMandi}</Text>
                )}
                <FlatList
                    style={{ flex: 1, marginTop: 0, marginBottom: 20, }}
                    data={arrayOfMandi}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item, index }) => {
                        return (
                            <MandiRateComponents 
                                props={item}
                                onPressViewImage={onPressViewImage}
                            />
                        )
                    }}
                />
            </View>
            {(isShowImage) && (
                <View style={styles.overlay}>
                     <View style={styles.view_header}>
                            <View style={styles.view_inner}>
                                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                                    onPress={onPressHideImage}>
                                    <Image style={{ width: 10, height: 18 }}
                                        source={images.BACKICON}>
                                    </Image>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button_save}
                                    onPress={() => onPressSaveImage(imageUrl)}>
                                <Text style={styles.text_lot}>{'Share'}</Text>
                        </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ width: Dimensions.get('window').width, height: viewHeight,}}>
                            <ImageViewer imageUrls={[{url: imageUrl, props: {}}]}
                            backgroundColor={colors.white_color}/>
                        </View>
                    
                </View>
            )}
            {(!isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Mandi'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
            {loadingIndicator && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        color: colors.black_color,
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
    overlay: {
        // justifyContent: 'center',
        // alignItems: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        backgroundColor: colors.white_color,
    },
    text_close: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 20,
        color: colors.black_color,
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
    button_save: {
        position: 'absolute',
        right: 15,
        width: 80,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 0.2)'
    },
    text_lot: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 15,
        color: colors.landing_background,
    },
});

export default MandiListDetailScreen;


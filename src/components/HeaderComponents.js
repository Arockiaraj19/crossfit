import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Animated, Easing, Image, Platform, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { colors, fonts, images } from '../core';
import { getUserProfileImage } from '../helpers/AppManager';
import { AuthContext } from './AuthContext';
import DataFetchComponents from './DataFetchComponents';


const HeaderComponents = ({
    headerTitle,
    isHome,
    isBackButton,
    onPressBack,
    onPressShowLanguage,
    onPressProile,
    otherIcons,
}) => {

    const navigation = useNavigation()
    const [profileImage, setProfileImage] = useState('');
    const [isFetch, setIsFetch] = useState(false);
    const [loading, setLoading] = useState(false);
    // const [notificationLength, setNotificationLength] = useState()
    const [notificationVisible, setNotificationVisible] = useState(false);
    const [notificationAnimation] = useState(new Animated.Value(0));

    const {
        notificationLength,
        setNotificationLength,
        activeNotification,
        setActiveNotification
    } = useContext(AuthContext)

    useEffect(() => {
        getProfileImage()
    }, [profileImage])

    const getProfileImage = () => {
        setTimeout(async () => {
            let imageUrl = await getUserProfileImage();
            setProfileImage(imageUrl)
        }, 200)
    }

    useEffect(() => {
        handleNotification()
        // return setIsFetch(false)
    }, [])


    const handleNotification = () => {
        setTimeout(() => {
            if (!otherIcons) setIsFetch(true);
        }, 10)
    }

    // useFocusEffect(
    //     useCallback(()=>{
    //         setTimeout(()=>{
    //             if(!otherIcons) setIsFetch(true)
    //         },5) 
    //     },[])
    // )


    useFocusEffect(
        React.useCallback(() => {
            setTimeout(async () => {
                let imageUrl = await getUserProfileImage();
                setProfileImage(imageUrl);
            }, 100)
        }, [])
    )

    useEffect(() => {
        if (notificationLength > 0) {
            startAnimation();
        } else {
            stopAnimation();
        }
    }, [notificationLength]);


    const startAnimation = () => {
        setNotificationVisible(true);
        Animated.loop(
            Animated.sequence([
                Animated.timing(notificationAnimation, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(notificationAnimation, {
                    toValue: 0,
                    duration: 500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopAnimation = () => {
        Animated.timing(notificationAnimation).stop();
        setNotificationVisible(false);
    };

    const updateLoading = (isloading) => {
        setIsFetch(isloading);
    }

    const updateDate = (getNotificationData) => {

        console.log("getNotificationData", getNotificationData);
        // if (!getNotificationData) setIsFetch(false)
        if (Array.isArray(getNotificationData) && getNotificationData?.length) {
            setNotificationLength(getNotificationData.length)
        } else {
            setNotificationLength(0)
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.view_inner}>
                {(isBackButton) && (
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                        onPress={onPressBack}>
                        <Image style={{ width: 10, height: 18 }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                )}
                {(isHome) && (
                    <Image style={{ marginLeft: 20, width: 37, height: 50 }}
                        resizeMode='contain'
                        source={images.CROPFITBLACKLOGO}>
                    </Image>
                )}

                <View style={[styles.text_view, { marginLeft: (isBackButton) ? 0 : 25 }]}>
                    <Text style={[styles.text_title, { width: isHome ? '91%' : '100%' }]}
                        numberOfLines={2}>{headerTitle}</Text>
                </View>
                {(!otherIcons) && (
                    <View style={styles.view_icons}>
                        {/* <TouchableOpacity style={[styles.touch_icons, { right: 84, }]}
                            onPress={onPressShowLanguage}>
                            <Image style={{ width: 20, height: 23 }}
                                source={images.LANGUAGEBLACKICON}>
                            </Image>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => navigation.navigate('NotificationScreen')} style={[styles.touch_icons, { right: notificationLength ? 50 : 42 }]}>
                            {notificationVisible && (
                                <Animated.View
                                    style={[
                                        styles.notificationContainer,
                                        {
                                            transform: [
                                                {
                                                    translateY: notificationAnimation.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0, 10],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                    source={images.NOTIFICATION}
                                >
                                    <Image
                                        style={styles.notificationIcon}
                                        source={images.NOTIFICATION}
                                    />
                                    <View style={styles.notificationNumberContainer}>
                                        <Text style={styles.notificationNumberText}>{notificationLength}</Text>
                                    </View>
                                </Animated.View>
                            )}
                            {!notificationVisible && (
                                <Image
                                    style={styles.notificationIcon}
                                    source={images.EMPTYNOTIFICATION}
                                />
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.touch_icons}
                            onPress={onPressProile}>
                            {(profileImage == '') ?
                                <Image style={{ width: 36, height: 36, borderRadius: 18, }}
                                    source={images.EMPTYPROFILEICON}>
                                </Image> : <Image style={{ width: 36, height: 36, borderRadius: 18, }}
                                    source={{ uri: profileImage }}>
                                </Image>}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {(isFetch) && (
                <DataFetchComponents
                    selectedId={''}
                    isType={'Notification'}
                    updateLoading={updateLoading}
                    updateDate={updateDate} />
            )}
        </View>
    );
};

export default HeaderComponents;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
    },
    view_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (Platform.OS == 'android') ? 10 : 40,
        width: '100%',
        height: 40,
    },
    view_icons: {
        flexDirection: 'row',
        width: 150,
        height: 40,
        position: 'absolute',
        right: 10,
    },
    touch_icons: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 18,
        position: 'absolute',
        right: 0,
    },
    text_view: {
        marginLeft: 25,
        width: '60%',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        height: 48,
    },
    text_title: {
        // width: '100%',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.black_color,
    },
    notificationIcon: {
        width: 23,
        height: 23,
    },
    notificationContainer: {
        position: 'relative',
    },
    notificationNumberContainer: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationNumberText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
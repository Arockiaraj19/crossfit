


import React from 'react';
import { Dimensions, Image, ImageBackground, Linking, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { PageControlJaloro } from 'react-native-chi-page-control';
import LinearGradient from 'react-native-linear-gradient';
import Share from 'react-native-share';
import { images } from '../../../core';
import styles from '../style/home_screen_style';


const BannerComponent = ({
    listOfCropfit, message, applink
}) => {
    const { width, height } = Dimensions.get('window');
    const title = 'Farmfit';
    const [scrollPage, setScrollPage] = React.useState(0);
    const handleScrollEnd = (e) => {
        if (!e) {
            return
        }
        const { nativeEvent } = e
        if (nativeEvent && nativeEvent.contentOffset) {
            let currentSlide = 1
            if (nativeEvent.contentOffset.x === 0) {
                var count = ((currentSlide - 1) == 1) ? 0.5 : (((currentSlide - 1) == 2) ? 1 : 0)
                setScrollPage((currentSlide - 1) / 3)
            } else {
                const approxCurrentSlide = nativeEvent.contentOffset.x / (Dimensions.get("window").width)
                currentSlide = parseInt(Math.ceil(approxCurrentSlide.toFixed(2)) + 1)
                var count = ((currentSlide - 1) == 1) ? 0.5 : (((currentSlide - 1) == 2) ? 1 : 0)
                setScrollPage((currentSlide - 1) / 3)
            }
        }
    }

    const onPressShareUrl = async () => {
        const options = Platform.select({
            default: { title, subject: '', message: `${message}`, url: applink },
        });
        try {
            const ShareResponse = await Share.open(options);

        } catch (error) {
            console.log('Error =>', error);
            //setResult('error: '.concat(getErrorString(error)));
        }
    }
    const onPressOpenWeb = (urslString) => {
        Linking.openURL(urslString);
    }
    const RemoteImage = ({ uri, desiredHeight }) => {

        return (
            <Image
                source={{ uri }}
                style={{
                    marginLeft: 20,
                    marginBottom: 5,
                    height: 90,
                    width: 90,
                }}
            />
        )
    }
    return <>
        <View style={[styles.scrollContainer, { marginTop: 30, }]}>
            <ScrollView
                ref={(scrollView) => { this.scrollView = scrollView; }}
                pagingEnabled={true}
                onScrollBeginDrag={handleScrollEnd}
                onMomentumScrollEnd={handleScrollEnd}
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                decelerationRate={0}
                snapToInterval={width - 60}
                snapToAlignment={"center"}
                contentInset={{
                    top: 0,
                    left: 30,
                    bottom: 0,
                    right: 30,
                }}>
                {listOfCropfit.map((data, index) => {
                    return (
                        <View>
                            {(index == 0) ?
                                <ImageBackground
                                    resizeMode='contain'
                                    style={[styles.view,
                                    { backgroundColor: images.BANNERREFERFRIEND ? '' : '#87c7e3' }
                                    ]}
                                    source={images.BANNERREFERFRIEND}
                                >
                                    <TouchableOpacity style={{ flex: 1 }}
                                        onPress={() => {
                                            onPressShareUrl()
                                        }
                                        }>
                                    </TouchableOpacity>
                                </ImageBackground> :
                                <LinearGradient colors={(index % 2 == 0) ? ['#eefaf4', '#04914b'] : ['#eee0b7', '#baac35']} style={[styles.view, { backgroundColor: 'blue', }]}>
                                    <TouchableOpacity style={{ flex: 1, }}
                                        onPress={() => {
                                            onPressOpenWeb(data.Url)
                                        }
                                        }>
                                        <View style={{ position: 'absolute', bottom: 20, }}>
                                            <RemoteImage
                                                uri={data.ImageURL}
                                                desiredHeight={70}
                                            />
                                            <Text style={styles.text_Name}>{data.Name}</Text>
                                            <Text style={styles.text_Description}>{data.Description}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>}
                        </View>
                    )
                })}
            </ScrollView>
        </View>
        <View style={{ marginTop: 20, width: '100%', alignItems: 'center', justifyContent: 'center', }}>
            <PageControlJaloro style={{ width: 80, height: 5, }}
                progress={scrollPage}
                numberOfPages={listOfCropfit.length}
                inactiveTintColor={'#999999'}
                activeTintColor={'#444444'} />
        </View>
    </>;
}


export default BannerComponent;
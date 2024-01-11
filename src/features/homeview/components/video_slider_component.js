





import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Dimensions, Image, ImageBackground, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/AuthContext';
import styles from '../style/home_screen_style';
import Carousel from 'react-native-reanimated-carousel';
import { images,colors } from '../../../core';

const VideoSliderComponent = ({
    videoList
}) => {
    const navigation = useNavigation();
    const {

        enquiries,
        sellerText

    } = useContext(AuthContext);
    const { width, height } = Dimensions.get('window');
    const PAGE_WIDTH = width;

    const COUNT = 2.5;
   

    const onPressOpenWeb = (urslString) => {
        Linking.openURL(urslString);
    }
  
    return videoList.length == 0 ? null :
    <View style={{ flex: 1,overflow:'hidden' }}>
    <Carousel
    
        loop
       width={PAGE_WIDTH-40}
     height={200}
        autoPlay={true}
        
      overscrollEnabled={true}
        data={videoList}
        scrollAnimationDuration={1000}
     
        renderItem={({item:data,index }) => (
        
            <ImageBackground style={{ width: '100%', height: 200, borderRadius: 6, backgroundColor: colors.line_background }}
                                    source={{ uri: data.ImageURL }} resizeMode='cover'>
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: 200, }}
                                        onPress={() => {
                                            onPressOpenWeb(data.Url)
                                        }
                                        }>
                                        <Image style={{ width: 40, height: 40 }}
                                            source={images.PLAYICON}>
                                        </Image>
                                    </TouchableOpacity>
                                </ImageBackground>
        )}
    />
</View>
   

}


export default VideoSliderComponent;
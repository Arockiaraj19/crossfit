





import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/AuthContext';
import styles from '../style/home_screen_style';
import Carousel from 'react-native-reanimated-carousel';
const LotScrollComponent = ({
    lotList
}) => {
    const navigation = useNavigation();
    const {

        enquiries,
        sellerText

    } = useContext(AuthContext);
    const { width, height } = Dimensions.get('window');
    const PAGE_WIDTH = width;

    const COUNT = 3;
    const baseOptions = {
        
        vertical: false,
        width: PAGE_WIDTH / COUNT,
        height:190,
       
        style: {
         width:PAGE_WIDTH-80,
       
        
        }}

    const ResizeImage = ({ uri, desiredHeight }) => {

        return (
            <Image
                source={{ uri }}
                style={{
                    backgroundColor: 'transparent',
                    height: 90,
                    width: 90,
                }}
            />
        )
    }
    const onPressLotDetails = (item) => {
        navigation.navigate('SellerInfoListScreen', { details: item })
    }

    return lotList.length == 0 ? null :
    <View style={{ flex: 1,paddingHorizontal:20,paddingTop:20,overflow:'hidden' }}>
    <Carousel
    
        loop
        {...baseOptions}
        // height={240}
        autoPlay={true}
        
      overscrollEnabled={true}
        data={lotList}
        scrollAnimationDuration={1000}
     
        renderItem={({item:data,index }) => (
        
            <TouchableOpacity key={index} style={{ width: 120, height: 190, marginRight: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                        onPress={() =>
                            onPressLotDetails(data)}>
                        <View>
                            <View style={{ width: '100%', height: 120, justifyContent: 'center', alignItems: 'center', }}>
                                <ResizeImage
                                    uri={data.ImageURL}
                                    desiredHeight={70}
                                />
                            </View>
                            <View style={{ width: '100%', height: 70, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                <Text style={styles.text_LotTitle}>{data.Name}</Text>
                                <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                    <Text style={styles.text_seller}>{data.DataCount + ' ' + sellerText}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
        )}
    />
</View>
        // <ScrollView
        //     contentContainerStyle={{ flexGrow: 1, paddingBottom: 1400, paddingRight: 20 }}
        //     contentInsetAdjustmentBehavior="automatic"

        //     pagingEnabled={false}
        //     style={{
        //         // width: '100%',
        //         height: 240,
        //         paddingTop: 20,
        //         paddingHorizontal: 20,
        //         paddingBottom: 50,

        //         flex: 1,
        //         // overflow: 'visible'

        //     }}
        //     showsVerticalScrollIndicator={false}
        //     showsHorizontalScrollIndicator={false}
        //     horizontal={true}
        //     decelerationRate={0}
        //     scrollEnabled={true}

        //     snapToAlignment={"center"}
        // >
        //     {lotList.map((data, index) => {
        //         return (
        //             <TouchableOpacity key={index} style={{ width: 140, height: 220, marginRight: 20, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
        //                 onPress={() =>
        //                     onPressLotDetails(data)}>
        //                 <View>
        //                     <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
        //                         <ResizeImage
        //                             uri={data.ImageURL}
        //                             desiredHeight={70}
        //                         />
        //                     </View>
        //                     <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
        //                         <Text style={styles.text_LotTitle}>{data.Name}</Text>
        //                         <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
        //                             <Text style={styles.text_seller}>{data.DataCount + ' ' + sellerText}</Text>
        //                         </View>
        //                     </View>
        //                 </View>
        //             </TouchableOpacity>
        //         )
        //     })}
        // </ScrollView>

}


export default LotScrollComponent;
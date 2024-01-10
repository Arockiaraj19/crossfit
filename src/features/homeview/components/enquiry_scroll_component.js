





import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/AuthContext';
import styles from '../style/home_screen_style';

const EnquiryScrollComponent = ({
    enquiryList
}) => {

    const navigation = useNavigation();
    const {

        enquiries,

    } = useContext(AuthContext);
    const { width, height } = Dimensions.get('window');


    const ResizeImage = ({ uri, desiredHeight }) => {

        return (
            <Image
                source={{ uri }}
                style={{
                    backgroundColor: 'transparent',
                    height: 70,
                    width: 70,
                }}
            />
        )
    }
    const onPressEnquiryDetails = (item) => {
        navigation.navigate('ViewEnquiryInfoScreen', { details: item })
    }

    return enquiryList.length == 0 ? null :
        <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 1400, paddingRight: 20 }}
            contentInsetAdjustmentBehavior="automatic"

            pagingEnabled={false}
            style={{
                // width: '100%',
                height: 240,
                paddingTop: 20,
                paddingHorizontal: 20,
                paddingBottom: 50,

                flex: 1,
                // overflow: 'visible'

            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            decelerationRate={0}
            scrollEnabled={true}

            snapToAlignment={"center"}
        >
            {enquiryList.map((data, index) => {
                return (
                    <TouchableOpacity key={index} style={{ width: 140, marginRight: 20, marginBottom: 10, height: 220, borderRadius: 20, backgroundColor: '#EEEEEE', overflow: "hidden" }}
                        onPress={() =>
                            onPressEnquiryDetails(data)}>
                        <View>
                            <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center' }}>
                                <ResizeImage
                                    uri={data.ImageURL}
                                    desiredHeight={70}
                                />
                            </View>
                            <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                                <Text style={styles.text_LotTitle}>{data.Name}</Text>
                                <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                    <Text style={styles.text_seller}>{data.DataCount + ' ' + enquiries}</Text>
                                </View>
                            </View>
                        </View>

                    </TouchableOpacity>
                )
            })}
        </ScrollView>

}


export default EnquiryScrollComponent;
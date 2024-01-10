import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../../../components/AuthContext';
import { colors, images } from '../../../core';
import styles from '../style/home_screen_style';
import EnquiryScrollComponent from './enquiry_scroll_component';

import LinearGradient from 'react-native-linear-gradient';

const EnquiryComponent = ({ enquiryList }) => {
    const navigation = useNavigation();
    const onPressViewMoreEnquiries = () => {
        navigation.navigate('ViewMoreEnquiryListScreen')
    }

    const {

        enquiries,
        viewMore
    } = useContext(AuthContext);
    const { width, height } = Dimensions.get('window');
    return (
        <View style={styles.lotBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: 40, marginTop: 20, }}>
                <LinearGradient colors={['#f3e0b9', '#ecaa25']} style={styles.linearGradient}>
                    <Image style={{ width: 15, height: 24, }}
                        source={images.LOTSICON}>
                    </Image>
                </LinearGradient>
                <Text style={styles.text_Lot}>{enquiries}</Text>
            </View>
            < EnquiryScrollComponent enquiryList={enquiryList} />
            <View style={{ marginTop: 10, marginBottom: 20, width: '100%', height: 65, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity style={{ marginTop: 10, width: '88%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, borderWidth: 1, borderColor: colors.line_background }}
                    onPress={onPressViewMoreEnquiries}>
                    <Text style={styles.text_viewMore}>{viewMore}</Text>
                </TouchableOpacity>
            </View>
        </View>);
}

export default EnquiryComponent;
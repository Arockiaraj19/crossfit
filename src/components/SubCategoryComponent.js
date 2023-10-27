import React, { useContext } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, Pressable } from 'react-native';
import { colors, fonts } from '../core';
import { AuthContext } from '../components/AuthContext';

const SubCategoryComponent = ({
    props,
    index,
    isBuy,
    onPressSubCategortDetail,
    onPressEnquireDetail
}) => {
    const {
        buyText,
        enquireText,
    } = useContext(AuthContext);
    const RemoteImage = ({ uri, desiredHeight }) => {
        const [desiredWeight, setDesiredWeight] = React.useState(0)
        Image.getSize(uri, (width, height) => {
            setDesiredWeight(desiredHeight / height * width)
        })
        return (
            <Image
                source={{ uri }}
                style={{
                    marginTop: 15,
                    height: desiredHeight,
                    width: desiredWeight,

                }}
            />
        )
    }
    const onPressDetail =(items)=> {
        if(!isBuy){
            onPressSubCategortDetail(items)
        }
    }
    return (
        <Pressable style={[styles.container, { height: (isBuy) ? 215 : 150}]}
            onPress={() =>
                onPressDetail(props)}>
            {(index == 0 || index == 1) && (
                <View style={{ width: '100%', height: 1, backgroundColor: '#dddddd', opacity: 0.5 }}></View>
            )}
            <View style={styles.view_innder}>
                {(props.ImageURL != null) && (
                    <RemoteImage
                        uri={props.ImageURL}
                        desiredHeight={70}
                    />
                )}
                {(props.ImageURL == null) && (
                    <Image style={styles.banner_image} />
                )}
                {/* {(isBuy && (props.ShowEnquiry == 1)) && (
                        <TouchableOpacity style={styles.view_enquire}
                            onPress={() =>
                                onPressEnquireDetail(props)}>
                        <Text style={styles.text_enquire}>{enquireText}</Text>
                    </TouchableOpacity>
                )} */}
            </View>
            {(isBuy &&  (props.IsLotAvailable == 1)) && (
                    <TouchableOpacity style={[styles.toch_buy, { bottom : 45 }]}
                        onPress={() =>
                            onPressSubCategortDetail(props)}>
                        <Text style={styles.text_buy}>{buyText}</Text>
                    </TouchableOpacity>
                )}
                {(isBuy && (props.ShowEnquiry == 1)) && (
                        <TouchableOpacity style={[styles.toch_buy, { bottom :  (isBuy &&  (props.IsLotAvailable == 1)) ?   0 :45 }]}
                            onPress={() =>
                                onPressEnquireDetail(props)}>
                        <Text style={styles.text_buy}>{enquireText}</Text>
                    </TouchableOpacity>
                )}
            <Text style={styles.text_title}>{props.Name}</Text>
            <View style={{ width: '100%', height: 1, backgroundColor: '#dddddd', position: 'absolute', bottom: 0, opacity: 0.5 }}></View>
            <View style={{ width: 1, height: '100%', position: 'absolute', right: 0, top: 0, backgroundColor: '#dddddd', opacity: 0.5 }}></View>
        </Pressable>
    );
};

export default SubCategoryComponent;

const styles = StyleSheet.create({
    container: {
        width: '50%',
        height: 150,
        alignItems: 'center',
    },
    view_innder: {
        width: '100%',
        height: 80,
        alignItems: 'center',
        overflow: 'hidden',
    },
    view_bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#f0efef',
    },
    text_title: {
        textAlign: 'center',
        marginTop: 25,
        marginLeft: 10,
        marginRight: 10,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#222222',
    },
    banner_image: {
        marginTop: 15,
        height: 80,
        width: 80,
        backgroundColor: colors.white_color,
    },
    view_enquire: {
        marginLeft: 5,
        marginRight: 5,
        minHeight: 30,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        backgroundColor: '#CA4D3E'
    },
    text_enquire: {
        marginTop: 3,
        marginBottom: 3,
        marginLeft: 5,
        marginRight: 5,
        fontSize: 13,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.white_color,
    },
    toch_buy: {
        position: 'absolute',
        bottom: 10,
        justifyContent: 'center',
        minHeight: 25,
        borderColor: colors.line_background,
        borderWidth: 1,
        borderRadius: 4,
        marginLeft: 5,
        marginRight: 5,
    },
    text_buy: {
        marginLeft: 5,
        marginRight: 5,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a552',
    },
});
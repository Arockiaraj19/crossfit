import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../core';
const CommoditiesInfoComponent = ({
    props,
    onPressSelectItem
}) => {

    return (
        <TouchableOpacity style={styles.container}
            onPress={() =>
                onPressSelectItem(props)}>
            <View style={{ marginTop: 3, marginBottom: 3, width: 4, height: 84, borderTopRightRadius: 6, borderBottomRightRadius: 6, backgroundColor: (props.isSelected) ? '#01a552' : 'transparent' }} />
            <View style={{ width: 86, height: 90, alignItems: 'center', justifyContent: 'center', }}>
                <FastImage style={{ marginTop: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: colors.white_color, }}
                    resizeMode='cover'
                    source={{ uri: props.ImageURL }} />
                <Text style={[styles.text_title, { fontFamily: (props.isSelected) ? fonts.MONTSERRAT_SIMEBOLD : fonts.MONTSERRAT_REGULAR, color: (props.isSelected) ? '#01a552' : '#222222' }]}>{props.Name}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default React.memo(CommoditiesInfoComponent);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 90,
        height: 90,
        marginBottom: 5,
        flexDirection: 'row',
    },
    text_title: {
        textAlign: 'center',
        marginTop: 5,
        marginLeft: 3,
        marginRight: 3,
        marginBottom: 10,
        fontSize: 11,
        color: '#222222',
    },
});
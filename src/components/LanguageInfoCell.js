import React, { useContext, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import { colors, fonts } from '../core';

const LanguageInfoCell = ({
    props,
    onPressSelectLanguage,
}) => {

    useEffect(() => {

    }, [])

    return (
        <View style={styles.container}>

            <TouchableOpacity style={{ borderRadius: 8, marginLeft: 10, width: '90%', height: 165, backgroundColor: (props.isSelected) ? '#a3dabf' : 'lightgray' }}
                onPress={() =>
                    onPressSelectLanguage(props)
                }>
                <ImageBackground style={{ width: '100%', height: '100%' }}
                    source={{ uri: props.ImageURL }}>
                    <Text style={[styles.text_title, { color:  colors.black_color }]}>
                        {props.Name}
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        </View>
    );
};

export default LanguageInfoCell;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '50%',
        height: 180,
    },
    text_title: {
        marginTop: 20,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        textAlign: 'center',
        fontSize: 15,
        color: colors.black_color
    },
});
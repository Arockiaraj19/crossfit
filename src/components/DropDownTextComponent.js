import React, { useContext, useEffect } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity, } from 'react-native';
import { colors, fonts, images } from '../core';

const DropDownTextComponent = ({
    title,
    dropDownType,
    enterText,
    placeHolder,
    onPressShowList,
}) => {

    useEffect(() => {

    }, [])

    return (
        <TouchableOpacity style={styles.container}
            onPress={()=> {
                onPressShowList(dropDownType)
            }}>
            <View style={ styles.view_inner }>
                <Text style={ styles.text_title }>{title}
                </Text>
                <View style={ styles.view_enter }>
                    <Text style={ styles.text_value }>{ (enterText == '') ? placeHolder : enterText}
                    </Text>
                    <Image style={ styles.image_dropDown }
                        source={images.DROPDOWNARROWICON} />
                </View>
                <View style={ styles.view_line }></View>
            </View>
        </TouchableOpacity>
    );
};

export default DropDownTextComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: 80,
        marginBottom: 5,
    },
    view_inner: { 
        width: '90%', 
        height: 75, 
    },
    view_enter: { 
        marginTop: 10, 
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    image_dropDown: { 
        width: 14, 
        height: 7, 
        position: 'absolute', 
        right: 10, 
    },
    view_line: { 
        position: 'absolute',
        bottom: 0,
        marginTop: 10, 
        width: '100%', 
        height: 1, 
        backgroundColor: '#f0f0f0' 
    },
    text_title: {
        marginTop: 8,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 15,
        color: '#999999',

    },
    text_value: {
        height: 25,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 16,
        color: colors.text_Color,
        padding: 1,
    },
});
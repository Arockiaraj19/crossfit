import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TextInput, } from 'react-native';
import { colors, fonts, images } from '../core';

const InputBoxComponent = ({
    title,
    dropDownType,
    placeHolder,
    enterText,
    keyboardType,
    isBorder,
    value,
    maxLength,
}) => {

    const [updateText, setUpdateText] = useState((keyboardType == 'numeric') ? (value == undefined ? 0 : value) : '');

    useEffect(() => {
        console.log('keyboardTypekeyboardTypekeyboardType 1', value)
    }, [])

    const textUpdate=(text)=> {
        setUpdateText(text);
        enterText(text, dropDownType)
    }
    return (
        <View style={[styles.container ]}>
            <View style={ styles.view_inner }>
                <Text style={ styles.text_title }>{title}
                </Text>
                <View style={ (isBorder) ? styles.view_enterBorder : styles.view_enter}>
                    <TextInput style={ (isBorder) ?  styles.search_InputBorder : styles.search_Input }
                            value={updateText}
                            onChangeText={(text) => textUpdate(text)}
                            autoCapitalize='none'
                            autoCorrect={false}
                            keyboardType={keyboardType }//(dropDownType == 'DoorNo') ? 'default' : 'numeric'
                            returnKeyType='done'
                            placeholderTextColor={colors.text_Color}
                            placeholder={placeHolder}
                            maxLength={maxLength}>
                        </TextInput>
                </View>
                {(!isBorder) && (
                    <View style={ styles.view_line }></View>
                )}
            </View>
        </View>
    );
};

export default InputBoxComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: 85,
    },
    view_inner: { 
        width: '90%', 
        height: 70, 
    },
    view_enter: { 
        marginTop: 10, 
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    view_enterBorder: { 
        marginTop: 10, 
        width: '100%', 
        flexDirection: 'row', 
        alignItems: 'center',
        borderRadius: 5, 
        borderColor: colors.line_background,
        borderWidth: 1,
        backgroundColor: colors.white_color,
    },
    search_Input: {
        width: '95%',
        height: 35,
        fontSize: 15,
        color: colors.text_Color,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
    },
    search_InputBorder: {
        width: '95%',
        marginLeft: 10,
        height: 35,
        fontSize: 15,
        color: colors.text_Color,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
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
        height: 20,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 16,
        color: colors.text_Color,
    },
});
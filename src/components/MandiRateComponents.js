import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Image, Text, ImageBackground, } from 'react-native';
import { colors, fonts, images } from '../core';
import moment from 'moment';
const MandiRateComponents = ({
    props,
    onPressViewImage,
}) => {

    const dateConvert=(dateInfo)=> {
        const date = new Date(dateInfo);
        let momentObj = moment(date).format("DD MMM YYYY")
        return momentObj
    }
    return (
        <View style={[styles.container]}>
            <View style={styles.view_Inner}>
                <View style={{ marginLeft: 10, width: 85, height: '100%',}}>
                    <ImageBackground style={{ marginTop: 10, width: 85, height: 85, borderRadius: 5, overflow: 'hidden'}}
                        source={images.DOCUMENTICON}>
                        <TouchableOpacity style={{ width: '100%', height: '100%'}}
                            onPress={() => onPressViewImage(props)}>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
                <View style={{ marginLeft: 10, width: '68%', minHeight: 85,}}>
                    {props.Title && <Text style={styles.text_Rate}>{props.Title}</Text>}
                    <Text style={styles.text_Rate}>{props.FileName}</Text>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                    <Text style={styles.text_Name}>{props.UploaderName}</Text>
                    <Text style={styles.text_Date}>{dateConvert(props.UploadedDate)}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default MandiRateComponents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
        marginBottom: 10,
    },
    view_Inner: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        minHeight: 100,
        borderRadius: 5,
        backgroundColor: colors.white_color,
        shadowColor: "#000000",
        shadowOffset: { width: 1, height: 0 }, // change this for more shadow
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    text_Rate: {
        // marginTop: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color
    },
    text_Name: {
        // marginTop: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 16,
        color: colors.text_Color
    },
    text_Date: {
        marginTop: 4,
        paddingHorizontal:10,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 12,
        color: colors.text_Color
    },
});

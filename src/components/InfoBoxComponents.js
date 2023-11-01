import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { colors, fonts, images } from '../core';

const InfoBoxComponents = ({
    props,
    index,
    isEnquiry,
    onPressSellerInfo,
    sellerText,
    enquiries,
}) => {


    useEffect(() => {

    }, [])

    const ResizeImage = ({ uri, desiredHeight }) => {
        // const [desiredWeight, setDesiredWeight] = React.useState(0)
        // Image.getSize(uri, (width, height) => {
        //     setDesiredWeight(desiredHeight / height * width)
        // })
        return (
            <Image
                source={{ uri }}
                style={{
                    backgroundColor: 'transparent',
                    height: desiredHeight,
                    width: 70,
                }}
            />
        )
    }

    return (
        <View style={[styles.container]}>
            {((index % 2 == 0) && (
                <TouchableOpacity style={{ marginLeft: 5, width: '88%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                    onPress={() => onPressSellerInfo(props)}>
                    <View>
                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                            <ResizeImage
                                uri={props.ImageURL}
                                desiredHeight={70}
                            />
                        </View>
                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                            <Text style={styles.text_LotTitle}>{props.Name}</Text>
                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                {(isEnquiry) && (
                                    <Text style={styles.text_seller}>{props.DataCount + ' ' + enquiries}</Text>
                                )}
                                {(!isEnquiry) && (
                                    <Text style={styles.text_seller}>{props.DataCount+ ' ' +sellerText}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
            {((index % 2 != 0) && (
                <TouchableOpacity style={{ marginRight: 5, width: '88%', height: 220, borderRadius: 20, overflow: 'hidden', backgroundColor: '#EEEEEE' }}
                    onPress={() => onPressSellerInfo(props)}>
                    <View>
                        <View style={{ width: '100%', height: 140, justifyContent: 'center', alignItems: 'center', }}>
                            <ResizeImage
                                uri={props.ImageURL}
                                desiredHeight={70}
                            />
                        </View>
                        <View style={{ width: '100%', height: 80, alignItems: 'center', backgroundColor: '#DDDDDD' }}>
                            <Text style={styles.text_LotTitle}>{props.Name}</Text>
                            <View style={{ marginTop: 5, height: 24, borderRadius: 4, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8E8E8E' }}>
                                {(isEnquiry) && (
                                    <Text style={styles.text_seller}>{props.DataCount + ' ' + enquiries}</Text>
                                )}
                                {(!isEnquiry) && (
                                    <Text style={styles.text_seller}>{ props.DataCount+ ' '+sellerText}</Text>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default InfoBoxComponents;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '50%',
        height: 220,
        marginBottom: 15,
    },
    text_LotTitle: {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 13,
        color: colors.text_Color,
    },
    text_seller: {
        marginLeft: 10,
        marginRight: 10,
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 13,
        color: colors.white_color,
    },
});
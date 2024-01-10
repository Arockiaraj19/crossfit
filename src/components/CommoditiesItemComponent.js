import React, { useContext } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import { colors, fonts } from '../core';

const CommoditiesItemComponent = ({
    props,
    isBuy,
    index,
    onPressSelectItem
}) => {

    const {
        buyText,
        sellText,
    } = useContext(AuthContext);

    const RemoteImage = ({ uri, desiredHeight }) => {

        return (
            <Image
                source={{ uri }}
                style={{
                    marginTop: 15,
                    height: 70,
                    width: 70,

                }}
            />
        )
    }
    return (
        <TouchableOpacity style={[styles.container, { height: (isBuy) ? 140 : 170 }]}
            onPress={() =>
                onPressSelectItem(props)}>
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
            </View>
            <Text style={styles.text_title}>{props.Name}</Text>
            {(!isBuy && (
                <TouchableOpacity style={styles.toch_buy}
                    onPress={() =>
                        onPressSelectItem(props)}>
                    <Text style={styles.text_buy}>{(isBuy) ? buyText : sellText}</Text>
                </TouchableOpacity>
            ))}
            <View style={{ width: '100%', height: 1, backgroundColor: '#dddddd', position: 'absolute', bottom: 0, opacity: 0.5 }}></View>
            <View style={{ width: 1, height: '100%', position: 'absolute', right: 0, top: 0, backgroundColor: '#dddddd', opacity: 0.5 }}></View>
        </TouchableOpacity>
    );
};

export default CommoditiesItemComponent;

const styles = StyleSheet.create({
    container: {
        width: '50%',
        height: 170,
        alignItems: 'center',
    },
    view_innder: {
        width: '100%',
        height: 80,
        alignItems: 'center',
        overflow: 'hidden',
    },
    text_title: {
        textAlign: 'center',
        marginTop: 10,
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
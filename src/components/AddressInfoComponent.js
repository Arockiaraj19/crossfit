import React, { useEffect } from 'react'
import { View, StyleSheet, Image, Text, TouchableOpacity, } from 'react-native';
import { colors, fonts, images } from '../core';


const AddressInfoComponent = ({
    props,
    deleteAddress,
    onPressSelectAddress,
    onPressDeleteAddress,
}) => {

    return (
        <View style={styles.container}>
            <View style={styles.view_box}>
                <View style={styles.view_boxInner}>
                    <Image style={{ marginLeft: 15, marginTop: 15, width: 40, height: 40 }}
                        source={images.LOCATIONICON} />
                    <View style={{ marginTop: 10, width: '66%', height: '90%', }}>
                        <Text style={styles.text_type}>{props.AddressType}</Text>
                        <Text style={styles.text_address}>{props.AddressLine1 + ', ' + props.Village + ', ' + props.Town + ', ' + props.Taluk + ', ' + props.District + ', ' + props.State}</Text>
                    </View>
                    <TouchableOpacity style={styles.select_address}
                        onPress={() =>
                            onPressSelectAddress(props)}>
                        <View style={{ width: 20, height: 20, backgroundColor: 'white', borderRadius: 10, borderWidth: 4, borderColor: (props.isSelected) ? colors.landing_background : 'lightgray'}}>

                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.view_delete}>
                    <TouchableOpacity style={{ marginLeft: 60, minWidth: 100, height: 30, justifyContent: 'center', }}
                        onPress={() => 
                            onPressDeleteAddress(props)}>
                        <Text style={styles.text_delete}>{deleteAddress}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AddressInfoComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    view_box: {
        width: '88%',
        marginTop: 5,
        borderRadius: 6,
        backgroundColor: colors.white_color,
        shadowColor: 'lightgray',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        elevation: 5,
    },
    view_boxInner: {
        flexDirection: 'row',
        width: '100%',
    },
    view_delete: {
        width: '100%',
        height: 30,
        marginBottom: 10,
    },
    text_type: {
        marginLeft: 5,
        marginTop: 10,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.text_Color,
        textDecorationLine: 'underline',
    },
    text_address: {
        marginLeft: 5,
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 15,
        color: colors.text_Color,
        marginBottom: 10,
    },
    select_address: {
        marginLeft: 5,
        marginTop: 10,
        width: 45,
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_delete: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 15,
        color: '#f96161',
    },
});
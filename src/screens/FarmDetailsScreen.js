import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, Dimensions, Platform, Pressable, KeyboardAvoidingView, ScrollView, TextInput, Alert } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import moment from "moment";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '../components/Loading';


const UPDATEUSERPROFILE_QUERY = gql`
mutation ($Id: ID!, $gender: ID!, $dob: String!, $emailId: String!, $preferredLanguageId: ID!, $primaryRoleId: ID!){
    updateUserProfile(Id: $Id , gender: $gender, dob: $dob, emailId: $emailId, preferredLanguageId: $preferredLanguageId, primaryRoleId: $primaryRoleId) 
    { 
        Status
    } 
  }
`;

const FarmDetailsScreen = ({ navigation, route }) => {
    const {
        saveAddress,
        farmDetails,

        cultivableText, 
    irrigationText, 
    groundWaterText,
    sprinklerText, 
    borewellText, 
    organicText, 
    toolsText, 
    livestockText, 
    expertText, 
        
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [landAcress, setLandAcress] = React.useState('');
    const [organicFarm, setOrganicFarm] = React.useState('no');
    const [availableForRent, setAvailableForRent] = React.useState('no');
    const [livestock, setLivestock] = React.useState('no');
    const [advice, setAdvice] = React.useState('no');
    const [irrigation, setIrrigation] = React.useState('');

    useEffect(() => {

    }, [])
    const onPressBack = () => {
        navigation.goBack();
    }
    const onPressSaveProfile = () => {
    
    }
    const onPressOrganic =(type)=> {
       setOrganicFarm(type)
    }
    const onPressIrrigation =(type)=> {
       setIrrigation(type)
    }
    const onPressTools =(type)=> {
        setAvailableForRent(type)
     }
     const onPressLivestock =(type)=> {
        setLivestock(type)
     }
     const onPressExpert =(type)=> {
        setAdvice(type)
     }
    return (
        <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}>
            <View style={styles.view_header}>
                <View style={styles.view_inner}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 10, width: 30, height: 40, }}
                        onPress={onPressBack}>
                        <Image style={{ width: 10, height: 18 }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={[styles.text_title, { marginLeft: 10 }]}>{farmDetails}</Text>
                </View>
            </View>
            <ScrollView style={{ marginBottom: 80, width: '100%', height: '50%', }}>
                <View style={styles.view_Main}>
                    <View style={{ marginTop: 15, width: '100%', }}>
                        <View style={styles.view_info}>
                            <Text style={styles.text_heading}>{cultivableText}</Text>
                            <View style={styles.view_box}>
                                <TextInput style={styles.search_Input}
                                    value={landAcress}
                                    onChangeText={setLandAcress}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    keyboardType={'numeric'}
                                    returnKeyType='done'
                                    placeholderTextColor={colors.text_Color}
                                    placeholder={cultivableText}>
                                </TextInput>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 210 }]}>
                            <Text style={styles.text_heading}>{irrigationText}</Text>
                            <View style={[styles.view_box, { alignItems: 'center', height: 170 }]}>
                                <TouchableOpacity style={styles.view_InnerBox}
                                    onPress={() =>
                                        onPressIrrigation('water')}>
                                    <View style={(irrigation == 'water') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                    <Text style={(irrigation == 'water') ? styles.text_SelectedMale : styles.text_Male}>{groundWaterText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.view_InnerBox, { marginTop: 10 }]}
                                    onPress={() =>
                                        onPressIrrigation('sprinkler')}>
                                    <View style={(irrigation == 'sprinkler') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                    <Text style={(irrigation == 'sprinkler') ? styles.text_SelectedMale : styles.text_Male}>{sprinklerText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.view_InnerBox, { marginTop: 10 }]}
                                    onPress={() =>
                                        onPressIrrigation('borewell')}>
                                    <View style={(irrigation == 'borewell') ? styles.selectedCircle : styles.unSelectCircle}></View>
                                    <Text style={(irrigation == 'borewell') ? styles.text_SelectedMale : styles.text_Male}>{borewellText}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center'}]}>
                            <Text style={styles.text_heading}>{organicText}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (organicFarm == 'no') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressOrganic('no')}>
                                    <Text style={[styles.text_roles, { color: (organicFarm == 'no') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'No'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (organicFarm == 'yes') ?  'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={()=>
                                        onPressOrganic('yes')}>
                                    <Text style={[styles.text_roles, { color: (organicFarm == 'yes') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'Yes'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center'}]}>
                            <Text style={styles.text_heading}>{toolsText}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (availableForRent == 'no') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressTools('no')}>
                                    <Text style={[styles.text_roles, { color: (availableForRent == 'no') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'No'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (availableForRent == 'yes') ?  'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={()=>
                                        onPressTools('yes')}>
                                    <Text style={[styles.text_roles, { color: (availableForRent == 'yes') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'Yes'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center'}]}>
                            <Text style={styles.text_heading}>{livestockText}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (livestock == 'no') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressLivestock('no')}>
                                    <Text style={[styles.text_roles, { color: (livestock == 'no') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'No'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (livestock == 'yes') ?  'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={()=>
                                        onPressLivestock('yes')}>
                                    <Text style={[styles.text_roles, { color: (livestock == 'yes') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'Yes'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.view_info, { height: 60, flexDirection: 'row', alignItems: 'center'}]}>
                            <Text style={styles.text_heading}>{expertText}</Text>
                            <View style={styles.view_role}>
                                <TouchableOpacity style={[styles.button_buyer, { backgroundColor: (advice == 'no') ? 'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={() =>
                                        onPressExpert('no')}>
                                    <Text style={[styles.text_roles, { color: (advice == 'no') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'No'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button_seller, { backgroundColor: (advice == 'yes') ?  'rgba(1, 165, 82, 1.0)' : colors.white_color }]}
                                    onPress={()=>
                                        onPressExpert('yes')}>
                                    <Text style={[styles.text_roles, { color: (advice == 'yes') ? colors.white_color : 'rgba(1, 165, 82, 0.4)'}]}>{'Yes'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 50}}>

                </View>
            </ScrollView>
            <View style={styles.view_headerBottom}>
                <TouchableOpacity style={styles.button_edit}
                    onPress={onPressSaveProfile}>
                    <Text style={styles.text_edit}>{saveAddress}</Text>
                </TouchableOpacity>
            </View>
            {loadingIndicator && <Loading />}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background_color,
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_inner: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: (Platform.OS == 'android') ? 10 : 40,
        width: '100%',
        height: 40,
    },
    text_title: {
        marginLeft: 25,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: colors.black_color,
    },
    view_Main: {
        width: '100%',
        flex: 1,
    },
    text_name: {
        marginTop: 5,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        justifyContent: 'center',
        fontSize: 18,
        color: '#01a553',
    },
    view_top: {
        width: '100%',
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    view_profileImage: {
        marginTop: 15,
        width: '100%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 70,
    },
    image_user: {
        width: 80,
        height: 80,
        backgroundColor: colors.white_color,
        borderRadius: 60,
    },
    touch_editProfile: {
        width: '80%',
        height: 26,
        alignItems: 'center',
    },
    view_headerBottom: {
        width: '100%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
    },
    button_edit: {
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: 'rgba(1, 165, 82, 1.0)'
    },
    text_edit: {
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.white_color,
    },
    view_info: {
        marginTop: 10,
        width: '100%',
        height: 85,
    },
    text_heading: {
        width: '60%',
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.black_color,
    },
    view_box: {
        marginTop: 10,
        marginLeft: 20,
        width: '90%',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(112, 112, 112, 0.2)',
        backgroundColor: colors.white_color,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0, height: 7
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
    },
    view_InnerBox: { 
        width: '90%', 
        height: 40, 
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 6, 
        borderWidth: 1, 
        borderColor: colors.line_background
    },
    search_Input: {
        width: '92%',
        height: 35,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
    },
    text_dateOfBirth: {
        width: '92%',
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        paddingVertical: 0,
    },
    view_buttonSelect: {
        width: '38%',
        height: 43,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.line_background,
        flexDirection: 'row',
        alignItems: 'center',
    },
    unSelectCircle: {
        marginLeft: 15,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: 'rgba(112, 112, 112, 1.0)',
    },
    selectedCircle: {
        marginLeft: 15,
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 5,
        borderColor: colors.landing_background,
    },
    text_Male: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.text_Color,
    },
    text_SelectedMale: {
        marginLeft: 10,
        fontSize: 16,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: '#01a553',
    },
    popup_view: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: "center",
        backgroundColor: colors.lite_black,
    },
    view_line: {
        position: 'absolute',
        bottom: 0,
        marginTop: 10,
        width: '65%',
        height: 1,
        backgroundColor: '#f0f0f0'
    },
    view_role: { 
        overflow: 'hidden', 
        width: 120, 
        height: 40, 
        borderRadius: 20, 
        position: 'absolute', 
        right: 20, 
        flexDirection: 'row', 
        backgroundColor: 'rgba(1, 165, 82, 1.0)',
        alignItems: 'center',
    },
    button_buyer: { 
        marginLeft: 2, 
        width: 58, 
        height: 36, 
        borderTopLeftRadius: 18, 
        borderBottomLeftRadius: 18, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    button_seller: { 
        width: 58, 
        height: 36, 
        borderTopRightRadius: 18, 
        borderBottomRightRadius: 18, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_roles: {
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
    },
});

export default FarmDetailsScreen;


import { useMutation } from '@apollo/react-hooks';
import { useNavigation } from '@react-navigation/native';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../components/AuthContext';
import { colors, fonts } from "../core";
import { validatePhone } from '../helpers/validation';

const LOGIN_QUERY = gql`
  mutation ($mobileNo : String!,$deviceToken : String!){
    signInUser(mobileNo : $mobileNo,deviceToken : $deviceToken){
        userId 
        error 
        Msg 
        otpInfo { 
            generated 
        } 
    }
  }
`

const LoginScreen = () => {
    const navigation = useNavigation();
    const [mobileNumber, setUserMobileNumber] = useState('')
 const [errorMessage, setErr] = useState({ mobileNumErr: '' })
    const [token, setToken] = useState('')
    const [loading, setLoading] = React.useState(false);
    const {validMobileNumber, enterPhoneNumebr, pushDeviceToken, continueText, welcomeText, loginandSignup, errorNumer, dontHaveAccountText, singUpText, setIsShowLanguage, userNotExist,error } = useContext(AuthContext)
    const [userLogin, { }] = useMutation(LOGIN_QUERY)



    function handleLogin() {
        if (loading) {
            return;
        }
      
         
      if (validatePhone(mobileNumber) == false) {
            Alert.alert('',validMobileNumber, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        return;
        }
       
        return (async () => {
            try {
                setLoading(true);

                const otp = await userLogin({ variables: { mobileNo: mobileNumber, deviceToken: pushDeviceToken } })
                setLoading(false);
                if (!otp.data.signInUser.error) {
                    navigation.navigate('OTPVerficationScreen', { mobileNo: mobileNumber, userId: otp.data.signInUser.userId })
                } else {
                    if (otp?.data?.signInUser.Msg === 'User not registered') {
                        Alert.alert('', userNotExist, [{
                            text: 'OK', onPress: () => {
                                return;
                            },
                        },
                        ]);
                    }
                }
            } catch (err) {
                setLoading(false);
                Alert.alert(error, err.toString(), [{
                    text: 'OK', onPress: () => {
                        return;
                    },
                },
                ]);
                console.log("error", err);
            }
        })()
    }

    
    const navigateSignUpScreen = () => {
        setIsShowLanguage((pre) => !pre)
        navigation.navigate('EnterMobileNumberScreen')
    }
    return (
        <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={[styles.view, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.text_welcome}>{welcomeText}</Text>
                <View style={styles.view_line}>
                    <View style={[styles.line_view, { marginRight: 10, }]}></View>
                    <Text style={styles.text_login}>{loginandSignup}</Text>
                    <View style={[styles.line_view, { marginLeft: 10, }]}></View>
                </View>
                <View style={styles.Input}>
                    <Text style={styles.text_code}>{' + 91'}</Text>
                    <TextInput style={[styles.textInput_view, { width: '80%', }]}
                        placeholder={enterPhoneNumebr}
                        placeholderTextColor={colors.text_Color}
                        value={mobileNumber}
                        maxLength={10}
                        onChangeText={setUserMobileNumber}
                        keyboardType='numeric'
                    />
                </View>
            </View>
            
            <View style={{ marginTop: 20, width: '100%', height: 45, alignItems: 'center' }}>
                <TouchableOpacity style={styles.continue_touch}
                    onPress={() => handleLogin()}  >
                    {loading ? <ActivityIndicator size="small" color={colors.white_color} /> : <Text style={styles.continue_text}>{continueText}</Text>}
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 30, width: "100%", alignItems: 'center', justifyContent: "center", flexDirection: "row" }}>
                <Text style={{ color: colors.text_Color, fontFamily: fonts.MONTSERRAT_MEDIUM, }}>
                    {dontHaveAccountText}</Text>
                <TouchableOpacity onPress={navigateSignUpScreen}><Text style={{ color: "red", paddingHorizontal: 5, textAlign: 'center' }}>{singUpText}</Text></TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: colors.background_color,
    },
    view: {
        // flex: 1,
    },
    text_code: {
        width: 40,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: 16,
        color: colors.text_Color,
    },
    Input: {
        width: '80%',
        borderRadius: 4,
        borderColor: '#dddddd',
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
    },
    text_welcome: {
        marginTop: 25,
        fontFamily: fonts.MONTSERRAT_BOLD,
        fontSize: 20,
        color: colors.text_Color,
        textAlign: 'center' 
    },
    textInput_view: {
        marginLeft: 10,
        width: '95%',
        height: 40,
        fontSize: 14,
        color: colors.text_Color,
        padding: 1,
    },
    continue_touch: {
        width: '80%',
        height: 45,
        justifyContent: 'center',
        backgroundColor: colors.landing_background,
        borderRadius: 4,
    },
    continue_text: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        textAlign: 'center',
        fontSize: 18,
        color: colors.white_color
    },
    text_login: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 10,
        color: '#777777',
    },
    view_line: {
        marginTop: 20,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    line_view: {
        width: '20%',
        height: 1,
        backgroundColor: '#ededed',
    },
})
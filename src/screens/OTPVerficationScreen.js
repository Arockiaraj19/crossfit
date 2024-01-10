import React, { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, ActivityIndicator,Alert } from 'react-native';
import { colors, fonts, images } from '../core';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../components/AuthContext';
import OtpInputs from 'react-native-otp-inputs';
import Loading from '../components/Loading';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { getUserName, getUserId, getUserProfileImage} from '../helpers/AppManager';

const CONTINENT_QUERY = gql`
  query authorizeOTP($userId: ID!, $OTP: ID!) {
    authorizeOTP(userId:$userId ,OTP:$OTP){ 

        UserId 
    
        MobileNo 
    
        UserName 
    
        token 
        
        ProfilePicPath
      } 
  }
`;

const OTPVerficationScreen = ({ navigation, route }) => {

    const [isOTPVerify, setIsOTPVerify] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [continueLoading, setContinueLoading] = React.useState(false);
    const [state, setState] = React.useState({
        otpValue: 0,
    });
    const {
        otpVerification,
        enterOtp,
        didntReceive,
        continueText,
        setLoginToken,
        setEnableLogin,error
    } = useContext(AuthContext);

    useEffect(() => {
        console.log('route?.paramsroute?.paramsroute?.params', route?.params);
    }, [])
    const onPressBack = () => {
        navigation.goBack();
    }
    const onOTPChange = (code) => {
        console.log('code', code)
        setState({
            ...state,
            otpValue: code,
        });
    }
    const onPressResendOTP = () => {

    }
    const onPressContinue = () => {
        if(continueLoading){
            return;
        }
        setIsOTPVerify(true);
    }
    const updateValues = (isLoading) => {
        setIsOTPVerify(isLoading);
        setLoading(isLoading);
    }
    const loginSuccessfully = async (data) => {
        setContinueLoading(false);
        setIsOTPVerify(false);
        setEnableLogin((pre)=> false)
        setLoading(false);
        console.log('data ---------------', data)
        setLoginToken(data.authorizeOTP.token)
        setTimeout(async () => {
            try {
                await EncryptedStorage.setItem('ProfileImage', route?.params?.profileImage);
            } catch (e) {
                console.log('error ---------------', e)
            }
        }, 100);
        setTimeout(async () => {
            try {
                await EncryptedStorage.setItem('access_token', data.authorizeOTP.token);
                await EncryptedStorage.setItem('userName', (route?.params?.userName ? route?.params?.userName :data.authorizeOTP.UserName ));
                await EncryptedStorage.setItem('userId', (route?.params?.UserId ? route?.params?.UserId : data.authorizeOTP.UserId));
                await EncryptedStorage.setItem('MobileNo', (route?.params?.MobileNo ? route?.params?.MobileNo  :  data.authorizeOTP.MobileNo));
                await EncryptedStorage.setItem('ProfileImage', route?.params?.profileImage ? route?.params?.profileImage :  data.authorizeOTP.ProfilePicPath);
                
            } catch (e) {
                console.log('error ---------------', e)
            }
        }, 100);
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity style={{ marginLeft: 20, width: 40, height: 40, justifyContent: 'center', }}
                        onPress={onPressBack}>
                        <Image style={{ width: 20, height: 20, }}
                            source={images.BACKICON}>
                        </Image>
                    </TouchableOpacity>
                    <Text style={styles.otp_verfify}>{otpVerification}</Text>
                </View>
                <View style={{ width: 80, }}>
                    <Image style={{ width: 60, height: 60 }}
                        source={images.OTPICON} />
                </View>
            </View>
            <Text style={styles.enter_otp}>{enterOtp + `${' ' + route?.params?.mobileNo}`}</Text>
            <OtpInputs style={styles.otp_input}
                handleChange={(code) => onOTPChange(code)}
                numberOfInputs={4}
                inputContainerStyles={styles.underlineStyleBase}
                inputStyles={styles.underlineStyleHighLighted}
                focusStyles={styles.underlinefocusStyles}
            />
            {/* <View style={{ marginTop: 10, height: 30, justifyContent: 'center', }}>
                <Text style={styles.enter_notRecive}>{didntReceive}</Text>
                <TouchableOpacity style={{ width: 40, height: 30, position: 'absolute', right: 0 }}
                    onPress={onPressResendOTP}>
                </TouchableOpacity>
            </View> */}
            <View style={{ marginTop: 40, width: '100%', height: 45, alignItems: 'center' }}>
                <TouchableOpacity style={styles.continue_touch}
                    onPress={onPressContinue}>
                 {continueLoading?   <ActivityIndicator size="small" color={colors.white_color} />:<Text style={styles.continue_text}>{continueText}</Text>}      
                </TouchableOpacity>
            </View>
            {(isOTPVerify) && (
                <Query query={CONTINENT_QUERY} variables={{ userId: route?.params?.userId, OTP: state.otpValue }}>
                    {({ loading, errorr, data }) => {
                      
                        if (loading) {
                            setContinueLoading(true);
                            updateValues(true);
                               
                            return null
                        };
                        if (errorr) {
                         
                            setContinueLoading(false);
                            updateValues(false);
                            Alert.alert(error, errorr.message, [{
                                text: 'OK', onPress: () => {
                                    return;
                                },
                            },
                            ]);
                            return null;
                        }
                        if (!data) {
                            setContinueLoading(false);
                            updateValues(false);
                            return null;
                        }
                        loginSuccessfully(data);
                        return null;
                    }}
                </Query>
            )}
         
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background_color,
    },
    view_header: {
        marginTop: 35,
        width: '100%',
        height: 90,
        flexDirection: 'row',
    },
    otp_verfify: {
        marginTop: 10,
        marginLeft: 20,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.text_Color
    },
    enter_otp: {
        marginTop: 50,
        textAlign: 'center',
        width: 200,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: '#666666'
    },
    otp_input: {
        marginTop: 25,
        flexDirection: 'row',
        width: '85%',
        height: 50,
        padding: 5,
        justifyContent: 'center',
    },
    underlineStyleBase: {
        marginRight: 8,
        width: 40,
        height: 40,
        borderWidth: 1,
        backgroundColor: colors.white_color,
        borderRadius: 10,
        borderColor: '#dddddd',
        fontSize: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        color: colors.landing_background,
        textAlign: 'center',
    },
    underlineStyleHighLighted: {
        marginRight: 8,
        width: 40,
        height: 40,
        color: colors.landing_background,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        paddingTop: 0,
        paddingBottom: 0,
    },
    underlinefocusStyles: {
        marginRight: 8,
        width: 40,
        height: 40,
        borderRadius: 10,
        borderColor: colors.landing_background,
        color: colors.landing_background,
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        paddingTop: 0,
        paddingBottom: 0,
    },
    enter_notRecive: {
        textAlign: 'center',
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 14,
        color: '#999999'
    },
    continue_text: {
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        textAlign: 'center',
        fontSize: 18,
        color: colors.white_color
    },
    continue_touch: {
        width: '80%',
        height: 45,
        justifyContent: 'center',
        backgroundColor: colors.landing_background,
        borderRadius: 4,
    },

});

export default OTPVerficationScreen;


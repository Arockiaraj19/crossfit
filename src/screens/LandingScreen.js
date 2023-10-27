import React, { useContext, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, FlatList } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import { graphql  } from 'react-apollo';
import gql from 'graphql-tag';

const CONTINENT_QUERY = gql`
query { 
    getLanguages{ 
      Id 
      Name 
      Code 
      ImageURL
    } 
  } 
`;

const LandingScreen = ({ navigation, route }) => {

    const {
        getStart,
        setWelcomeText,
        setLoginandSignup,
        setContinueText,
        setEnterPhoneNumebr,
        setEnterYourName,
        setChooseLanguage,
        setOtpVerification,
        setEnterOtp,
        setDidntReceive,
        setErrorNumer,
        setErrorName,
        setLanguageList,
        enableLogin,
        setIsShowLanguage,
    } = useContext(AuthContext);

    const [languagesList, setLanguagesList] = React.useState([]);
    const [isFetch, setIsFetch] = React.useState(false);

    useEffect(() => {
        setLoginandSignup('Log in or Sign up')
        setContinueText('Continue')
        setChooseLanguage('Choose your language')
        setOtpVerification('OTP Verification')
        setEnterOtp('Enter the OTP sent to')
        setDidntReceive('Didn`t recevice the OTP? Retry')
        setErrorNumer('Please enter your mobile number')
        setErrorName('Please enter your name')
    }, [])

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const onPressGetStart = async () => {
        console.log('datadatadatadatadatadata', languagesList);
        setLanguageList(languagesList)
        setIsShowLanguage((pre)=>!pre)
        navigation.navigate('EnterMobileNumberScreen',{isShow :false})
    }
    const updateDetails=(getLanguages)=> {
        setLanguagesList(getLanguages)
        setIsFetch(true)
    }
    const GetLanguageComponent = graphql(CONTINENT_QUERY)(props => {
        const { error, getLanguages, loading } = props.data;
        console.log('propspropspropspropsprops',props)
        if (getLanguages) {
           
            return (
                <View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', }}>
                        <Image style={styles.logo_image}
                            source={images.CROPFITWHITELOGO}>
                        </Image>
                        <View style={styles.view_bottom}>
                            <TouchableOpacity style={styles.startButton}
                                onPress={onPressGetStart}>
                                <Text style={styles.text_start}>{getStart}</Text>
                                <Image style={styles.arrow_image}
                                    source={images.GETSTARTARROW}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            );
        }
        return <Loading />;
    });

    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: colors.landing_background,justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', }}>
                <Image style={styles.logo_image}
                    source={images.CROPFITWHITELOGO}>
                </Image>
                <View style={styles.view_bottom}>
                    <TouchableOpacity style={styles.startButton}
                        onPress={onPressGetStart}>
                        <Text style={styles.text_start}>{getStart}</Text>
                        <Image style={styles.arrow_image}
                            source={images.GETSTARTARROW}></Image>
                    </TouchableOpacity>
                </View>
            </View>

        {/* <Query query={dogQuery} variables={{languageId: 1}}>
                {({loading, error, data}) => {
                    {console.log('datadatadatadata',data)}
                  if (loading) return <Text>Loading video...</Text>;
                  if (error)
                    return (
                      <Text>Uh oh, something went wrong: {error.message}</Text>
                    );
                  if (!data) {
                    return <Text>Could not find a video with that id.</Text>;
                  }
                  return <Text>{'sdjjsdjsdjsjdjsd'}</Text>;
                }}
              </Query> */}
            {/*  */}
            {/* {loading && <Loading />} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo_image: {
        width: 100,
        height: 126,
    },
    view_bottom: {
        width: '100%',
        height: 40,
        position: 'absolute',
        bottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        flexDirection: 'row',
        width: '85%',
        height: 40,
        borderRadius: 5,
        borderColor: colors.landing_border,
        borderWidth: 1,
        backgroundColor: colors.landing_background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_start: {
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 15,
        color: colors.white_color
    },
    arrow_image: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 10,
    },
});


export default LandingScreen;




import React, { useContext, useState, useEffect } from 'react'
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image, Alert, BackHandler } from 'react-native';
import { colors, fonts, images } from '../core';
import { AuthContext } from '../components/AuthContext';
import LanguageInfoCell from './LanguageInfoCell';
import EncryptedStorage from 'react-native-encrypted-storage';
import moment from "moment";
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '../components/Loading';

const ADDLANGUAGE_QUERY = gql`
mutation ($LanguageName: String!, $LanguageCode: String!){
    addLanguage(LanguageName: $LanguageName , LanguageCode: $LanguageCode) 
    { 
        Id
        Name
        Code
        ImageURL
    } 
  }
`;

const LanguageSelectionComponent = ({
    onPressContinue,
    languageArray,
    onPressBackClick,
    isEnterNumber,
}) => {
    const {
        chooseLanguage,
        continueText,
        setLanguageList,
        languageAlert,
    } = useContext(AuthContext);

    const [listOfLanguage, setListOfLanguage] = useState([]);
    const [selectedLanguageId, setSelectedLanguageId] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedLanguageCode, setSelectedLanguageCode] = useState('');
    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [addLanguage, { loading, error, data }] = useMutation(ADDLANGUAGE_QUERY);

    useEffect(() => {
        setTimeout(async () => {
            console.log('langauges 32233223', languageArray)
            setLanguageList(languageArray);
            var templist = languageArray;
            var langauges = []
            templist.map((languageInfo, i) => {
                var tempInfo = {
                    "Code": languageInfo.Code,
                    "Id": languageInfo.Id,
                    "Name": languageInfo.Name,
                    "ImageURL": languageInfo.ImageURL,
                    isSelected: false
                }
                langauges.push(tempInfo)
            })
            setListOfLanguage(langauges);
        }, 10);
    }, [])

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            return true;
        });

        return () => backHandler.remove();
    },[])

    const onPressSelectLanguage = (item) => {
        setSelectedLanguageId(item.Id);
        setSelectedLanguage(item.Name);
        setSelectedLanguageCode(item.Code);
        var templist = listOfLanguage;
        var langaugesTemp = []
        templist.map((languageInfo, i) => {
            var tempInfo = languageInfo;
            tempInfo.isSelected = (item.Id == languageInfo.Id) ? true : false
            langaugesTemp.push(tempInfo)
        })
        setListOfLanguage(langaugesTemp);
    }
    const saveYourLanguage = async () => {
        console.log('isEnterNumber ---------------', isEnterNumber)

        if (selectedLanguage == '') {
            Alert.alert('', languageAlert, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            console.log("what is the languageId");
            console.log(selectedLanguageId);

            if (isEnterNumber == true) {
                try {
                    await EncryptedStorage.setItem('languageId', selectedLanguageId);
                } catch (e) {
                    console.log('error ---------------', e)
                }
                onPressContinue(selectedLanguageId, selectedLanguage)
            }
            else {
                try {

                  
                    await EncryptedStorage.setItem('languageId', selectedLanguageId);
                } catch (e) {
                    console.log('error ---------------', e)
                }
                onPressContinue(selectedLanguageId, selectedLanguage)

                // setLoadingIndicator(true);
                // try {
                //     await EncryptedStorage.setItem('languageId', selectedLanguageId);
                // } catch (e) {
                //     console.log('error ---------------', e)
                // }

                // addLanguage({
                //     variables: { LanguageName: selectedLanguage, LanguageCode: selectedLanguageCode }
                // })
                //     .then(res => {
                //         setLoadingIndicator(false)
                //         console.log('res ------------------', res);
                //         onPressBackClick();
                //     })
                //     .catch(e => {
                //         setLoadingIndicator(false)
                //         console.log('errer ------------------', e.message);
                //     });
            }
        }
    }
    return (
        <View style={styles.container}>
            {!isEnterNumber && (
                <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '72%' }}
                    onPress={onPressBackClick}>
                    <Image style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: colors.white_color }}
                        source={images.LANGUAGECLOSEICON}>
                    </Image>
                </TouchableOpacity>
            )}
            <View style={styles.view_inner}>
                <Text style={styles.choose_text}>{chooseLanguage}</Text>
                <FlatList style={{ marginTop: 15, marginLeft: 15, width: '90%', }}
                    data={listOfLanguage}
                    numColumns={2}
                    keyExtractor={(x, i) => i}
                    renderItem={({ item, index }) => (
                        <LanguageInfoCell
                            props={item}
                            onPressSelectLanguage={() =>
                                onPressSelectLanguage(item)
                            } />
                    )}
                />
                <View style={{ marginTop: 10, marginBottom: 20, width: '100%', height: 45, alignItems: 'center' }}>
                    <TouchableOpacity style={styles.continue_touch}
                        onPress={() =>
                            saveYourLanguage()
                        }>
                        <Text style={styles.continue_text}>{continueText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {loadingIndicator && <Loading />}
        </View>
    );
};

export default LanguageSelectionComponent;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    view_inner: {
        width: '100%',
        height: '70%',
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: colors.white_color,
    },
    choose_text: {
        marginLeft: 25,
        marginTop: 25,
        fontFamily: fonts.MONTSERRAT_SIMEBOLD,
        fontSize: 18,
        color: colors.text_Color
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
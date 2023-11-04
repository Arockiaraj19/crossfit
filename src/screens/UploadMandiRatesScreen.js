import { useMutation } from '@apollo/react-hooks';
import { Credentials } from "aws-sdk";
import S3 from "aws-sdk/clients/s3";
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

import * as ImagePicker from "react-native-image-picker";
import { PERMISSIONS, RESULTS, check,request } from 'react-native-permissions';
import DeviceInfo from 'react-native-device-info';
import { AuthContext } from '../components/AuthContext';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import uploadImageToStorage from '../helpers/uploadImage';
import UUIDv4 from '../helpers/uuid';
const UPDATEMANDIRATE_QUERY = gql`
mutation ($fileName: String!, $filePath: String!,$title: String!){ 
    addMandiRates(fileName: $fileName , filePath: $filePath ,title: $title ) 
    
  }
`;

const UploadMandiRatesScreen = ({ navigation, route }) => {

    const {
        browseFile,
        useCamera,
        locationMandi,
        uploaDMandi,
        mandiratesSuccess,
        enterLocation,
        mandiTitle,
        enterMandiTitle
    } = useContext(AuthContext);

    const [loadingIndicator, setLoadingIndicator] = React.useState(false);
    const [mandiImage, setMandiImage] = React.useState('');
    const [mandiImageUrl, setMandiImageUrl] = React.useState('');
    const [mandiLocation, setMandiLocation] = React.useState('');
    const [addMandiRates, { loading, error, data }] = useMutation(UPDATEMANDIRATE_QUERY);
    const [uuid, setUUID] = React.useState('');
    const [fileType, setFileType] = React.useState('image/jpeg');
    const [fileExtension, setFileExtension] = React.useState('.jpg');
    const [isPhoto, setIsPhoto] = React.useState(false);
    const [title, setTitle] = useState('')

    let options = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
        quality: 0.3,
        cameraType: 'back'
    };

  

    const onPressBack = () => {
        navigation.goBack();
    }
    const handleChoosePhoto = async () => {
        ImagePicker.launchImageLibrary(
            {
                mediaType: 'photo',//'video'
                includeBase64: false,
                quality: 0.3,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('User cancelled image picker');
                } else {
                    setMandiImage(response.assets[0].uri)
                    // uploadImage(Platform.OS === "android" ? ('file://' + response.assets[0].uri) : response.assets[0].uri);
                }
            },
        )

        // try {
        //     const res = await DocumentPicker.pick({
        //         type: [DocumentPicker.types.allFiles],
        //     });
        //     if (res) {
        //         console.log('res', res);
        //         uploadFile(res[0]);
        //     }
        // } catch (error) {
        //     console.log('error attaching file', error);
        // }
    };
    const uploadFile = async (attachement) => {
        let formUpload = new FormData();
        formUpload.append('file', attachement);
        formUpload.append('fileName', attachement.name);
        setFileType(attachement.type);
        setFileExtension(attachement.name);
        setIsPhoto(false);
        setMandiImage(attachement.uri);
        console.log("what is the attachment");
        console.log(attachement.uri);
    };
    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'App needs camera permission',
                    },
                );
                console.log("read camera persmission");
                console.log(granted);
                // If CAMERA Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else return true;
    };

    const requestExternalWritePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Write Permission',
                        message: 'App needs write permission',
                    },
                );
                 console.log("write storage persmission");
                                console.log(granted);
                // If WRITE_EXTERNAL_STORAGE Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                alert('Write permission err', err);
            }
            return false;
        } else return true;
    };
    const handleCamera = async () => {
        let isCameraPermitted = await requestCameraPermission();
      //  let isStoragePermitted = await requestExternalWritePermission();
        console.log(isCameraPermitted);
      //  console.log(isStoragePermitted);
        if (isCameraPermitted ) {
        console.log("hadleCamera");
            ImagePicker.launchCamera(options, (res) => {
            console.log(options);
            console.log(res);
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    console.log('User tapped custom button: ', res.customButton);
                    alert(res.customButton);
                } else {
                    setIsPhoto(true)
                    setMandiImage(res.assets[0].uri)
                    // uploadImage(Platform.OS === "android" ? ('file://' + res.assets[0].uri) : res.assets[0].uri);
                }
            });
        }
    };
    const access = new Credentials({
        accessKeyId: "AKIASVAYFY3SML3QPD5N",
        secretAccessKey: "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",
        // accessKeyId: "AKIASVAYFY3SJI2MOFUY",
        // secretAccessKey: "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",
    });

    const s3 = new S3({
        credentials: access,
        region: "ap-south-1", //"us-west-2"
        signatureVersion: "v4",
    });

    const fetchUploadUrl = async (data, fileSelected) => {
        try {
            let res = await fetch(data, {
                method: 'PUT',
                body: fileSelected,
            })
            return res;
        } catch (error) {
            return error;
        }
    }
    const uploadImage = async () => {
        if (mandiImage == '') {
            Alert.alert('', 'Please select file', [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (mandiLocation.trim() == '') {
            Alert.alert('', enterLocation, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else if (title.trim() == '') {
            Alert.alert('', enterMandiTitle, [{
                text: 'OK', onPress: () => {
                    return;
                },
            },
            ]);
        }
        else {
            setLoadingIndicator(true);


            const profileImage = await uploadImageToStorage(mandiImage);
            setTimeout(async () => {

                setMandiImageUrl(profileImage)
                onPressUploadMandi(profileImage)
            }, 100);
        }

    }
    const onPressRemoveImage = () => {
        setMandiImage('')
    }
    const onPressUploadMandi = (uploadImageUrl) => {
        addMandiRates({
            variables: { fileName: mandiLocation, filePath: uploadImageUrl, title: title }
        })
            .then(res => {
                setLoadingIndicator(false)
                console.log('res ------------------', res);
                Alert.alert('', mandiratesSuccess, [{
                    text: 'Ok',
                    onPress: () => {
                        onPressBack()
                        return;
                    },
                },
                ]);
            })
            .catch(e => {
                setLoadingIndicator(false)
                console.log('errer ------------------', e.message);
            });
    }
    useEffect(() => {
        if (Platform.OS == "android" && DeviceInfo.getApiLevelSync() >= 33) {
            requestPermission();
        }
   
        return () => { };
    }, []);
    async function requestPermission() {
        try {
            check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES)
                .then((result) => {
                    console.log("what is the camera permission");
                    console.log(result);
                    if (result != RESULTS.GRANTED) {
                        request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then((finalResult) => {
                          console.log("what is the request in image permissions");
                          console.log(finalResult);
                        });
                    }

                })
                .catch((error) => {
                    // …
                });

        } catch (err) {
            console.log("what is the permission error");
            console.log(err);

        }
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
                    {/* <Text style={[styles.text_title, { marginLeft: 10 }]}>{profileText}</Text> */}
                </View>
            </View>
            <View style={{ marginBottom: 10, width: '100%', height: '80%', }}>
                <ScrollView style={{ width: '100%', height: '70%', }}>
                    <View style={{ width: '100%', height: 180, alignItems: 'center', }}>
                        <View style={styles.view_box}>
                            <TouchableOpacity style={styles.view_InnerBox}
                                onPress={handleChoosePhoto}>
                                <Image style={{ width: 45, height: 45, }}
                                    source={images.BROWSEFILE}></Image>
                                <Text style={styles.text_file}>{'Browse File'}</Text>
                            </TouchableOpacity>
                            <View style={{ width: 1, height: 100, backgroundColor: '#dddddd' }}>

                            </View>
                            <TouchableOpacity style={styles.view_InnerBox}
                                onPress={handleCamera}>
                                <Image style={{ width: 45, height: 45 }}
                                    source={images.TAKEPHOTO}></Image>
                                <Text style={styles.text_file}>{'Use Camera'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {(mandiImage != '' && !isPhoto) && (
                        <View style={{ marginTop: 15, width: '100%', height: 200, flexDirection: 'row', }}>
                            <View style={{ width: '80%', height: 200, alignItems: 'center', flexDirection: 'row', }}>
                                <Image style={{ marginLeft: 20, width: 100, height: 100, borderRadius: 5 }}
                                    source={images.DOCUMENTICON}>
                                </Image>
                                <Text style={[styles.text_file, { width: '58%', marginLeft: 10, marginTop: 0, }]}>{fileExtension}</Text>
                            </View>
                            <View style={{ marginLeft: 5, width: '18%', height: 200, justifyContent: 'center', alignItems: 'center', }}>
                                <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', }}
                                    onPress={onPressRemoveImage}>
                                    <Image style={{ width: 35, height: 35 }}
                                        source={images.REMOVEICON}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    {(mandiImage != '' && isPhoto) && (
                        <View style={{ marginTop: 15, width: '100%', height: 200, flexDirection: 'row', }}>
                            <View style={{ width: '80%', height: 200, justifyContent: 'center', alignItems: 'center', }}>
                                <Image style={{ width: 100, height: 100, borderRadius: 5 }}
                                    source={images.DOCUMENTICON}>
                                </Image>
                            </View>
                            <View style={{ marginLeft: 5, width: '18%', height: 200, justifyContent: 'center', alignItems: 'center', }}>
                                <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignItems: 'center', }}
                                    onPress={onPressRemoveImage}>
                                    <Image style={{ width: 35, height: 35 }}
                                        source={images.REMOVEICON}></Image>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    <View style={{ marginTop: 20, width: '100%', height: 100, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={styles.text_heading}>{locationMandi}</Text>
                        <View style={styles.view_textInput}>
                            <TextInput style={styles.textInput_view}
                                placeholder={locationMandi}
                                value={mandiLocation}
                                onChangeText={setMandiLocation}
                                keyboardType='default'
                            />
                        </View>
                    </View>
                    <View style={{ marginTop: 10, width: '100%', height: 100, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={styles.text_heading}>{mandiTitle}</Text>
                        <View style={styles.view_textInput}>
                            <TextInput style={styles.textInput_view}
                                placeholder={mandiTitle}
                                value={title}
                                onChangeText={setTitle}
                                keyboardType='default'
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
            <View style={styles.view_edit}>
                <TouchableOpacity style={styles.view_editbutton}
                    onPress={uploadImage}>
                    <Text style={styles.label_edit}> {uploaDMandi} </Text>
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
    view_edit: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        width: '100%',
    },
    view_editbutton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 42,
        width: '83%',
        borderRadius: 4,
        backgroundColor: 'rgba(1, 165, 82, 1.0)'
    },
    label_edit: {
        color: 'white',
        fontSize: 18,
        fontFamily: fonts.BARLOW_SEMIBOLD,
    },
    view_box: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '90%',
        height: 150,
        borderRadius: 6,
        borderStyle: 'dashed',
        borderColor: 'lightgray',
        borderWidth: 1,
    },
    view_InnerBox: {
        marginLeft: 5,
        width: '45%',
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text_file: {
        marginTop: 20,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 16,
        color: colors.black_color,
    },
    view_textInput: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        height: 40,
        borderColor: '#dddddd',
        borderWidth: 1,
        borderRadius: 4,
    },
    textInput_view: {
        marginLeft: 10,
        width: '95%',
        height: 40,
        fontSize: 16,
        color: colors.text_Color,
    },
    text_heading: {
        position: 'absolute',
        left: 20,
        top: 5,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        fontSize: 15,
        color: colors.text_Color,
    },
});

export default UploadMandiRatesScreen;


import { useEffect, useState } from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import { colors, fonts, images } from "../core";

const SplashScreen = () => {

    useEffect(() => {
        getVersion();
    }, [])
    const [version, setVersion] = useState('');
    const getVersion = async () => {
        try {
            const updateNeeded = await VersionCheck.getCurrentVersion();
            console.log("what is the current version");
            console.log(updateNeeded);
            setVersion(updateNeeded);
        } catch (err) {
            console.log(err)
        }
    }

    return <View style={styles.container}>
        <Image style={styles.logo_image}
            source={images.CROPFITWHITELOGO} />

        <View style={{
            position: 'absolute',
            bottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Text style={{
                fontFamily: fonts.MONTSERRAT_MEDIUM,
                fontSize: 12,
                color: colors.white_color,
                marginBottom: 5
            }}>v {version}</Text>
            <Text style={{
                fontFamily: fonts.MONTSERRAT_MEDIUM,
                fontSize: 12,
                marginBottom: 10,
                color: colors.white_color,
            }}>© 2023 Thalavady Farmers Foundation - Dev</Text>
        </View>
    </View >

    // <View style={{
    //     width: "100%",
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     marginBottom: 10
    // }}>
    //     

    // </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.landing_background,
    },
    logo_image: {
        width: 150,
        height: 176,
    },
    containerModal: {
        flex: 1,
        width: '90%',
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: '90%',
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 5,
    },
    toastBox: {
        borderLeftWidth: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
    },
});

export default SplashScreen
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import VersionCheck from 'react-native-version-check';
import { colors, fonts } from "../../../core";

const VersionComponent = () => {

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

    return <View style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10
    }}>
        <Text style={{
            fontFamily: fonts.MONTSERRAT_MEDIUM,
            fontSize: 16,
            color: colors.black_color,
        }}>Version-{version} Copyright 2023</Text>
        <Text style={{
            fontFamily: fonts.MONTSERRAT_MEDIUM,
            fontSize: 16,
            color: colors.white_color,
        }}>Thalavady Farmers Foundation</Text>

    </View>
}

export default VersionComponent
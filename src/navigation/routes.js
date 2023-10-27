import React, { useContext } from 'react'
import { useTheme } from '@react-navigation/native';;
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/LandingScreen';
import EnterMobileNumberScreen from '../screens/EnterMobileNumberScreen';
import OTPVerficationScreen from '../screens/OTPVerficationScreen';
import LanguageListScreen from '../screens/LanguageListScreen';
import { AuthContext } from '../components/AuthContext';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();

const Root = () => {

    const {  enableLogin } = useContext(AuthContext)
    return (
        <Stack.Navigator
            initialRouteName={enableLogin ? 'LoginScreen' : 'LandingScreen'}
        >
            <Stack.Screen
                name="LandingScreen"
                component={LandingScreen}
                options={{ headerShown: false, gestureEnabled: false, }}
            />
            <Stack.Screen
                name='LoginScreen'
                component={LoginScreen}
                options={{ headerShown: false, gestureEnabled: false, }}
            />
            <Stack.Screen
                name="EnterMobileNumberScreen"
                component={EnterMobileNumberScreen}
                options={{ headerShown: false, gestureEnabled: false, }}
            />
            <Stack.Screen
                name="OTPVerficationScreen"
                component={OTPVerficationScreen}
                options={{ headerShown: false, gestureEnabled: false, }}
            />
            <Stack.Screen
                name="LanguageListScreen"
                component={LanguageListScreen}
                options={{ headerShown: false, presentation: 'transparentModal', }}
            />
        </Stack.Navigator>
    );
}

export default Root;
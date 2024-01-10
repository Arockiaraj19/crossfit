import { addEventListener } from "@react-native-community/netinfo";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useContext, useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../components/AuthContext';
import { colors, fonts, images } from '../core';
import HomeScreen from '../features/homeview/view/HomeScreen';
import BuyProductsScreen from './BuyProductsScreen';
import SellProductsScreen from './SellProductsScreen';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  const {
    home,
    buy,
    sell,
    setIsBackOption,
    internet
  } = useContext(AuthContext);


  const callfunction = async () => {
    try {
      await EncryptedStorage.setItem('isBack', '');
    } catch (e) {
      console.log('error ---------------', e)
    }
  }

  useEffect(() => {
    const unsubscribe = addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    }
  }, [])

  const [isConnected, setConnected] = useState(true);
  return (
    <View style={{ flex: 1, }}>
      {!isConnected ? <View style={{ flex: 1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",}}>
        <Text style={{ fontSize: 18,}}>{internet}</Text>
        <View style={{  width: '100%', height: 45, alignItems: 'center',marginTop:15 }}>
                <TouchableOpacity style={styles.continue_touch}
                    onPress={()=>{

                    }}>
                    <Text style={styles.continue_text}>{"Retry"}</Text>
                </TouchableOpacity>
            </View>
      </View> : <Tab.Navigator

        screenOptions={{
          lazy: false,
          tabBarShowLabel: false,
          tabBarStyle: { backgroundColor: colors.white_color, borderTopWidth: 0, height: Platform.OS === 'ios' ? 105 : 75 },
          headerShown: false,
          tabBarActiveTintColor: colors.white_color,
        }}>
        <Tab.Screen

          name="HomeScreen"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ width: (focused) ? 90 : 0, height: 5, marginTop: Platform.OS === 'ios' ? 0 : -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
                <Image
                  resizeMode='contain'
                  style={{ width: 35, height: 35, }}
                  source={focused ? images.HOMEACTIVEICON : images.HOMEICON} />
                <Text style={{
                  marginTop: 2,
                  fontWeight: "bold",
                  color: focused ? colors.landing_background : 'gray',
                  fontSize: 17,
                  fontFamily: fonts.MONTSERRAT_MEDIUM,
                }}> {home} </Text>
              </View>
            )
          }}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ isUpdate: true }),
          })}
        />
        <Tab.Screen

          name="BuyProductsScreen"
          component={BuyProductsScreen}

          setParams={{ 'isupdate': true }}
          options={{

            tabBarIcon: ({ focused }) => (

              <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                {/* {(callfunction())} */}
                <View style={{ width: (focused) ? 90 : 0, height: 5, marginTop: Platform.OS === 'ios' ? 0 : -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
                <Image
                  resizeMode='contain'
                  style={{ width: 35, height: 35, }}
                  source={focused ? images.BUYACTIVEICON : images.BUYICON} />
                <Text style={{
                  marginTop: 2,
                  color: focused ? colors.landing_background : 'gray',
                  fontSize: 17,
                  fontWeight: "bold",
                  fontFamily: fonts.MONTSERRAT_MEDIUM,
                }}> {buy} </Text>
              </View>
            )
          }}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ isUpdate: true }),
          })}
        />
        <Tab.Screen

          name="SellProductsScreen"
          component={SellProductsScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                {/* {(callfunction())} */}
                <View style={{ width: (focused) ? 90 : 0, height: 5, marginTop: Platform.OS === 'ios' ? 0 : -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
                <Image
                  resizeMode='contain'
                  style={{ width: 35, height: 35, }}
                  source={focused ? images.SELLACTIVEICON : images.SELLCON} />
                <Text style={{
                  marginTop: 2,
                  color: focused ? colors.landing_background : 'gray',
                  fontSize: 17,
                  fontWeight: "bold",
                  fontFamily: fonts.MONTSERRAT_MEDIUM,
                }}> {sell} </Text>
              </View>
            )
          }}
          listeners={({ navigation }) => ({
            blur: () => navigation.setParams({ isUpdate: true }),
          })}
        />

      </Tab.Navigator>}
    </View>
  );
};
export default React.memo(TabNavigator);

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continue_touch: {
    width: '40%',
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
});


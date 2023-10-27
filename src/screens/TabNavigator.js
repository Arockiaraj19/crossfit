import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Image,Platform } from 'react-native';
import { colors, fonts, images } from '../core';
import HomeScreen from '../features/homeview/view/HomeScreen';
import BuyProductsScreen from './BuyProductsScreen';
import SellProductsScreen from './SellProductsScreen';
import BidsProductsScreen from './BidsProductsScreen';
import { AuthContext } from '../components/AuthContext';
import EncryptedStorage from 'react-native-encrypted-storage';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {

  const {
    home,
    buy,
    sell,
    setIsBackOption,
} = useContext(AuthContext);

  // useEffect(() => {
    
  // }, [])
  const callfunction = async()=> {
    try {
      await EncryptedStorage.setItem('isBack', '');
    } catch (e) {
        console.log('error ---------------', e)
    }
  }
  return (
    <View style={{ flex: 1, }}>
      <Tab.Navigator
      
          screenOptions={{

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
                    style={{ width: 35, height:35, }}
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
            setParams={{'isupdate' : false}}
            options={{
              tabBarIcon: ({ focused }) => (
                
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                  {/* {(callfunction())} */}
                  <View style={{  width: (focused) ? 90 : 0, height: 5, marginTop: Platform.OS === 'ios' ? 0 : -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
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
                  <View style={{  width: (focused) ? 90 : 0, height: 5, marginTop:Platform.OS === 'ios' ? 0 : -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
                  <Image
                    resizeMode='contain'
                    style={{ width: 35, height: 35,}}
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
          {/* <Tab.Screen
            name="BidsProductsScreen"
            component={BidsProductsScreen}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                  <View style={{  width: (focused) ? 90 : 0, height: 5, marginTop: -4, marginLeft: 5, marginRight: 5, marginBottom: 5, borderBottomLeftRadius: 4, borderBottomRightRadius: 4, }} />
                  <Image
                    resizeMode='contain'
                    style={{ width: 20, height: 20, }}
                    source={focused ? images.BIDSACTIVEICON : images.BIDESICON} />
                  <Text style={{
                    marginTop: 2,
                    color: focused ? colors.landing_background : 'gray',
                    fontSize: 12,
                    fontFamily: fonts.MONTSERRAT_MEDIUM,
                  }}> Bids </Text>
                </View>
              )
            }}
            listeners={({ navigation }) => ({
              blur: () => navigation.setParams({ isUpdate: true }),
            })}
          /> */}
        </Tab.Navigator>
    </View>
  );
};
export default TabNavigator;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


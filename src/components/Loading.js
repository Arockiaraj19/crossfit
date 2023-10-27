import React from 'react'
import { useTheme } from '@react-navigation/native';;
import {Dimensions, StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import { colors } from '../core';

const Loading = () => {
  var deviceHeight = Dimensions.get("window").height;
  const { themeColors } = useTheme();
  const styles = makeStyles(themeColors)
  return (
    <View style={[styles.wrapper, {height: deviceHeight}]}>
      <ActivityIndicator size="large" color={colors.white_color} />
      {/* <Text style={styles.text}>Loading...</Text> */}
    </View>
  );
};

export default Loading;

const makeStyles = (themeColor) => StyleSheet.create({    
  wrapper: {
    width: '100%',
    height: '140%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor:  "rgba(0,0,0,0.5)",
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginTop: 16,
  },
});
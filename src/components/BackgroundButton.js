import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform, } from 'react-native';
import { colors, fonts, } from '../core';


const BackgroundButton = ({
	isDarkTheme,
	categoryName,
	bgColor,
	selected,
	onPressSelectCategory,
}) => {
	const styles = makeStyles(isDarkTheme);

	return (
		<TouchableOpacity style={styles.touchable} onPress={onPressSelectCategory}>
			<View style={[styles.view, { backgroundColor:(selected == categoryName) ? bgColor : '#c5ecd7' }]}>
				<Text style={[styles.text,  { color:(selected == categoryName) ? colors.white_color : bgColor }]}>{categoryName}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default BackgroundButton;

const makeStyles = isDarkTheme =>
	StyleSheet.create({
		view: {
			marginTop: 5,
			marginRight: 1,
			flexDirection: 'row',
			borderRadius: 4,
			backgroundColor: '#242636',
			height: 30,
			alignItems: 'center',
			justifyContent: 'center',
			paddingLeft: 8,
			paddingRight: 8,
			overflow: 'hidden',
		},
		touchable: {
			marginLeft: 4,
			marginRight: 4,
			marginBottom: 8
		},
		image: {
			marginRight: 8,
			backgroundColor: 'red',
		},
		text: {
			fontSize: 13,
			fontFamily: fonts.MONTSERRAT_REGULAR,
			textAlign: 'center',
			color: colors.landing_background,
		}
	});


// export default class BackgroundButton extends React.Component {
// 	render() {
// 		const styles = this.makeStyles();
// 		return (
// 			<TouchableOpacity style={styles.touchable} onPress={this.props.onPress}>

// 			</TouchableOpacity>
// 		);
// 	}
// 	makeStyles() {
// 		return StyleSheet.create({

// 		});
// 	}
// }
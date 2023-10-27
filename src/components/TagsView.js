import React from 'react';
import {
	StyleSheet,
	View,
	Platform,
} from 'react-native';
import BackgroundButton from '../components/BackgroundButton';

const TagsView = ({
	isDarkTheme,
	allCategories,
	selected,
	bgColor,
	onPressSelectCategory,
}) => {
	const styles = makeStyles(isDarkTheme);
	
	const onPress =(categoryInfo)=> {
		onPressSelectCategory(categoryInfo);
	};
	return (
		<View style={styles.container}>
			{allCategories.map((data, index) => {
                {console.log('datadatadatadatadatadata',data)}
				return (
					<BackgroundButton
						bgColor={bgColor}
						borderColor={1}
						onPressSelectCategory={() => {
							onPress(data);
						}}
						key={index}
						selected={selected}
						categoryName={data.Name} />
				);
			})}
		</View>
	);
};

export default TagsView;

const makeStyles = isDarkTheme =>
StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 15,
        marginRight: 15,
    },
});

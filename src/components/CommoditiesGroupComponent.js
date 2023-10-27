import React, { useEffect } from 'react'
import { View, StyleSheet, FlatList,Text } from 'react-native';
import { colors, fonts } from '../core';
import CommoditiesItemComponent from '../components/CommoditiesItemComponent';
import SubCategoryComponent from '../components/SubCategoryComponent';

const CommoditiesGroupComponent = ({
    props,
    comingSoon,
    isBuy,
    onPressSubCategortItem,
    onPressSubCategortDetail,
    onPressEnquireDetail,
    isGroup,
}) => {
    return (
        <View style={styles.container}>
           {(props!=null && props.length>0) ?
            <FlatList style={styles.list}
                data={props}
                numColumns={2}
                keyExtractor={(x, i) => i}
                renderItem={({ item, index }) => ((isGroup) ?
                    <CommoditiesItemComponent
                        props={item}
                        isBuy={isBuy}
                        index={index}
                        onPressSelectItem={onPressSubCategortItem} /> :
                    <SubCategoryComponent
                        props={item}
                        index={index}
                        isBuy={isBuy}
                        onPressSubCategortDetail={()=> 
                            onPressSubCategortDetail(item)
                        }
                        onPressEnquireDetail={()=> 
                            onPressEnquireDetail(item)
                        } />
                )}
            /> : <Text style={styles.text_empty}>{comingSoon}</Text>
           } 
           
        </View>
    );
};

export default CommoditiesGroupComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    list: {
        width: '100%',
    },
    text_empty: {
        width: '100%',
        textAlign: 'center',
        marginTop: 75,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color
    },
});
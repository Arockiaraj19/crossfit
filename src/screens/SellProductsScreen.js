import gql from 'graphql-tag';
import React, { useContext, useEffect } from 'react';
import { Query, graphql } from 'react-apollo';
import { BackHandler, FlatList, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import { AuthContext } from '../components/AuthContext';
import CommoditiesGroupComponent from '../components/CommoditiesGroupComponent';
import CommoditiesInfoComponent from '../components/CommoditiesInfoComponent';
import HeaderComponents from '../components/HeaderComponents';
import Loading from '../components/Loading';
import { colors, fonts, images } from '../core';
import { getIsBack } from '../helpers/AppManager';

const COMMODITYTYPE_QUERY = gql`
query {

    getcommodities{
    
      Id
    
      Name
    
      Code
    
      ImageURL
    
      Commoditygroups{
    
        Id
    
        Name
    
        Code
    
        ImageURL
    
      }
    
    }
    
    }
`;

const SUDCATEGORY_QUERY = gql`
query commodityChildByGroup($groupId: ID!){
    commodityChildByGroup(groupId:$groupId) {
      Id
  
      Name
  
      Code
    
      ImageURL

      ShowEnquiry
      
      MSP
      
      IsLotAvailable
    }
  }
`;

const SellProductsScreen = ({ navigation, route }) => {
    console.log("selle products screen");
    const [searchText, setSearchText] = React.useState('');
    const [isFetchDate, setIsFetchDate] = React.useState(false);
    const [isFetch, setIsFetch] = React.useState(false);
    const [isShowCategory, setIsShowCategory] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [state, setState] = React.useState({
        categortTitle: '',
        isSubcategory: false,
        isShowSubCategory: false,
        subCategoryId: 0,
        getcommoditiesList: [],
        commoditiesGroupList: [],
        subCategoryList: [],
        mainCommoditiesGroupList: [],
        mainSubCategoryList: [],
    });

    const [backActions, setBackActions] = React.useState({
        isClickCategory: false,
        isClickSubCategory: false,
        categoryId: 0,
        subCategoryId: 0
    });

    const {
        buySearchPlaceholder,
        loginToken,
        comingSoon,
    } = useContext(AuthContext);



    const reloadSellScreen = async () => {
        setState({
            ...state,
            isShowSubCategory: false,
            getcommoditiesList: [],
            commoditiesGroupList: [],
            subCategoryList: [],
            mainCommoditiesGroupList: [],
            mainSubCategoryList: [],
        });
        // const reload = await EncryptedStorage.getItem('reloadSell');
        //  if(reload === "true"){
        //     setIsFetchDate(true);
        //     setLoading(true);
        //  }
    }

    React.useCallback(() => {
        let isActive = true;
        reloadSellScreen()
        setLoading(true);
        setIsFetchDate(true);
        setTimeout(async () => {
            try {
                var backPage = await getIsBack()
                if (backPage != 'yes') {
                    setState({
                        ...state,
                        isShowSubCategory: false,
                        getcommoditiesList: [],
                        commoditiesGroupList: [],
                        subCategoryList: [],
                        mainCommoditiesGroupList: [],
                        mainSubCategoryList: [],
                    });
                    setIsFetchDate(true);
                    setLoading(true);
                }
                updateBack();
            } catch (e) {
                console.log(e);
            }
        }, 100);
        return () => {
            isActive = false;
        };
    }, [])

    const updateBack = async () => {
        try {
            await EncryptedStorage.setItem('isBack', '');
        } catch (e) {
            console.log('error ---------------', e)
        }
    }

    useEffect(() => {
        if (BackHandler) {
            BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
            return () => {
                BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
            };
        }

    }, [backActions])

    const handleBackButtonClick = () => {
        debugger;
        if (backActions.isClickSubCategory) {
            setIsShowCategory(true);
            var curentDate = { title: '', Id: backActions.categoryId };
            onPressSelectItem(curentDate);
        } else {
            navigation.navigate('HomeScreen')
        }
        return true;
    }
    useEffect(() => {
        setState({
            ...state,
            isShowSubCategory: false,
            getcommoditiesList: [],
            commoditiesGroupList: [],
            subCategoryList: [],
            mainCommoditiesGroupList: [],
            mainSubCategoryList: [],
        });
        setIsFetchDate(true);
        setLoading(true);
        // return () => backHandler.remove()
    }, [])
    const onSearch = () => {
        if (state.isShowSubCategory) {
            if (searchText != '') {
                const filtered = state.mainSubCategoryList.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(searchText)));
                setState({
                    ...state,
                    subCategoryList: filtered,
                });
            }
            else {
                setState({
                    ...state,
                    subCategoryList: state.mainSubCategoryList,
                });
            }
        }
        else {
            if (searchText != '') {
                const filtered = state.mainCommoditiesGroupList.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(searchText)));
                console.log('filteredfilteredfiltered', state.mainCommoditiesGroupList)
                setState({
                    ...state,
                    commoditiesGroupList: filtered,
                });
            }
            else {
                setState({
                    ...state,
                    commoditiesGroupList: state.mainCommoditiesGroupList,
                    subCategocaryList: [],
                });
            }
        }
    }
    const GetCommodityTypeComponent = graphql(COMMODITYTYPE_QUERY)(props => {
        const { error, data, loading } = props.data;
        if (error) {
            setIsFetchDate(false);
            { console.log('errorerrorerror', error) }
            return <View />;
        }
        if (!loading) {
            if (props.data?.getcommodities != undefined) {
                setTimeout(async () => {
                    updateValue(props.data.getcommodities);
                }, 500);
                return <View />;

            }
            return <View />;
        }
        return <View />;
    });
    const updateSubValue = () => {
        setTimeout(async () => {
            setState({
                ...state,
                isSubcategory: false,
            });
        }, 500);
    }
    const updateSubCategoryInfo = (data) => {
        console.log('data.commodityChildByGroup', data.commodityChildByGroup);
        setTimeout(async () => {
            setIsShowCategory(true);
            setState({
                ...state,
                isSubcategory: false,
                isShowSubCategory: true,
                subCategoryList: data.commodityChildByGroup,
                mainSubCategoryList: data.commodityChildByGroup,
            });
        }, 100);
    }
    const updateValue = (commoditiesList) => {
        console.log("update value");
        setLoading(false)
        setIsFetchDate(false);
        setIsFetch(true);
        EncryptedStorage.setItem('reloadSell', "false");
        setIsShowCategory(true);
        var title = '';
        var templist = commoditiesList;
        var commoditiesListTemp = []
        var commoditiesGroupListTemp = []
        if (templist != undefined) {
            templist.map((commoditiesInfo, i) => {
                var tempInfo = commoditiesInfo;
                tempInfo.isSelected = (i == 0) ? true : false
                commoditiesListTemp.push(tempInfo)
                if (i == 0) {
                    title = tempInfo.Name;
                    commoditiesGroupListTemp = tempInfo.Commoditygroups;
                }
            });
            if (templist && templist.length && templist.length > 0) {
                setBackActions({
                    ...backActions,
                    isClickCategory: true,
                    isClickSubCategory: false,
                    categoryId: templist[0].Id
                });
            }

        }
        setState({
            ...state,
            categortTitle: title,
            getcommoditiesList: commoditiesListTemp,
            commoditiesGroupList: commoditiesGroupListTemp,
            mainCommoditiesGroupList: commoditiesGroupListTemp,
        });
    }
    const onPressSelectItem = (item) => {
        console.log("its clicked");
        setSearchText('')
        var templist = state.getcommoditiesList;
        var commoditiesListTemp = []
        var commoditiesGroupListTemp = []
        var title = '';
        templist.map((commoditiesInfo, i) => {
            var tempInfo = commoditiesInfo;
            tempInfo.isSelected = (item.Id == commoditiesInfo.Id) ? true : false
            if (item.Id == commoditiesInfo.Id) {
                title = tempInfo.Name;
                commoditiesGroupListTemp = tempInfo.Commoditygroups;
            }
            commoditiesListTemp.push(tempInfo)
        })
        setState({
            ...state,
            categortTitle: title,
            isShowSubCategory: false,
            isSubcategory: false,
            getcommoditiesList: commoditiesListTemp,
            commoditiesGroupList: commoditiesGroupListTemp,
            mainCommoditiesGroupList: commoditiesGroupListTemp,
        });
        setBackActions({
            ...backActions,
            isClickCategory: true,
            isClickSubCategory: false,
            categoryId: item.Id
        });

    }
    const onPressSubCategortItem = (item) => {
        console.log("sub Category Called");
        setSearchText('')
        setIsShowCategory(false);
        setState({
            ...state,
            categortTitle: item.Name,
            subCategoryId: item.Id,
            isSubcategory: true,
        });
        setBackActions({
            ...backActions,
            isClickCategory: false,
            isClickSubCategory: true
        });

        console.log('sub category', backActions)

    }
    const onPressSubCategortDetail = async (item) => {

        console.log("onPressSubCategoryDetails");
        try {
            await EncryptedStorage.setItem('isBack', 'yes');
            await EncryptedStorage.setItem('currentPage', 'deliveryAddress');
        } catch (e) {
            console.log('error ---------------', e)
        }
        setSearchText('')

        navigation.navigate('DeliveryAddressScreen', { details: item, isType: 'sell' });
    }
    const onPressShowLanguage = async () => {
        try {
            await EncryptedStorage.setItem('isBack', 'yes');
        } catch (e) {
            console.log('error ---------------', e)
        }
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile = async () => {
        try {
            await EncryptedStorage.setItem('isBack', 'yes');
        } catch (e) {
            console.log('error ---------------', e)
        }
        navigation.navigate('ProfileDetailScreen')
    }
    const onPressRemoveSearch = () => {
        setSearchText('')
        if (state.isShowSubCategory) {
            setState({
                ...state,
                subCategoryList: state.mainSubCategoryList,
            });
        }
        else {
            setState({
                ...state,
                commoditiesGroupList: state.mainCommoditiesGroupList,
                subCategocaryList: [],
            });
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.view_header}>
                <HeaderComponents
                    headerTitle={state.categortTitle}
                    isBackButton={false}
                    onPressProile={onPressProile}
                    onPressShowLanguage={onPressShowLanguage} />
            </View>
            <View style={styles.view_mainSearch}>
                <View style={styles.view_Search}>
                    <Image style={styles.search_icon}
                        source={images.SEARCHICON} />
                    <TextInput style={styles.search_Input}
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                        autoCapitalize='words'
                        autoCorrect={false}
                        returnKeyType='search'
                        placeholder={buySearchPlaceholder}
                        placeholderTextColor={colors.search_placeholder}
                        onSubmitEditing={() => onSearch()}>
                    </TextInput>
                    {(searchText != '') && (
                        <TouchableOpacity style={{ marginLeft: 5, justifyContent: 'center', alignItems: 'center', width: 24, height: 24, borderRadius: 12, backgroundColor: 'lightgray' }}
                            onPress={onPressRemoveSearch}>
                            <Text>{'X'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {(isFetchDate) && (
                <View>
                    <GetCommodityTypeComponent />
                </View>
            )}
            {(state.isSubcategory) && (
                <Query query={SUDCATEGORY_QUERY} variables={{ groupId: state.subCategoryId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                updateSubValue(true);
                            return <View />
                        };
                        if (error) {
                            updateSubValue(false);
                            return <View />;
                        }
                        if (!data) {
                            updateSubValue(false);
                            return <View />;
                        }
                        updateSubCategoryInfo(data);
                        return <View />
                    }}
                </Query>
            )}
            {(isFetch) && (
                <View style={{ width: '100%', height: '81%', flexDirection: 'row' }}>
                    <View style={styles.view_left}>
                        <FlatList
                            style={{ flex: 1 }}
                            data={state.getcommoditiesList}
                            keyExtractor={(x, i) => i}
                            renderItem={({ item, index }) => {
                                return (
                                    <CommoditiesInfoComponent
                                        key={index.toString()}
                                        props={item}
                                        onPressSelectItem={onPressSelectItem} />
                                )
                            }}
                        />
                    </View>
                    {/* <View style={{ marginLeft: 8, width: '77%', height: '100%', }}>
                        {backActions.isClickCategory}</View> */}
                    {(isShowCategory) && (
                        <View style={{ marginLeft: 8, width: '77%', height: '100%', }}>
                            {(state.isShowSubCategory) ?
                                <CommoditiesGroupComponent
                                    props={state.subCategoryList}
                                    isBuy={false}
                                    comingSoon={''}
                                    onPressSubCategortDetail={onPressSubCategortDetail}
                                    onPressEnquireDetail={onPressSubCategortDetail}
                                    isGroup={false}
                                /> :
                                <CommoditiesGroupComponent
                                    props={state.commoditiesGroupList}
                                    isBuy={false}
                                    comingSoon={''}
                                    onPressSubCategortItem={onPressSubCategortItem}
                                    isGroup={true}
                                />}
                        </View>
                    )}
                </View>
            )}
            {loading && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white_color,
        alignItems: 'center'
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
    view_mainSearch: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        alignItems: 'center',
    },
    view_Search: {
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: colors.white_color,
        height: 40,
        width: '90%',
        marginLeft: 20,
        borderRadius: 4,
        borderColor: colors.line_background,
        borderWidth: 1,
    },
    search_icon: {
        marginTop: 3,
        marginLeft: 12,
        width: 15,
        height: 15,
    },
    search_Input: {
        width: '80%',
        marginLeft: 8,
        height: 40,
        fontSize: 14,
        fontFamily: fonts.MONTSERRAT_REGULAR,
        color: colors.black_color,
        paddingVertical: 0,
    },
    view_left: {
        flexDirection: 'row',
        width: 90,
        height: '100%',
        backgroundColor: colors.white_color,
        shadowColor: "#000000",
        shadowOffset: { width: 1, height: 0 }, // change this for more shadow
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
    }
});

export default React.memo(SellProductsScreen);


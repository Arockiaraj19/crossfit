import React, { useEffect, useContext } from 'react';
import { StyleSheet, View, Image, Text, Pressable, Platform } from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GETBIDSBYLOT_QUERY = gql`
query getBidsbyLotId($lotId: ID!){
    getBidsbyLotId(lotId:$lotId) {
        Id
        LotId
        UserAddressId
        BidNumber
        UserId
        AddressInfo
        IsOrganic
        Quantity
        QuantityUnit
        QuantityValue
        QuantityCode
        CommodityChildName
        CommodityChildURL
        AskingPrice
        BidPrice
        LotQuantity
        LotQuantityUnit
        LotQuantityValue
        LotQuantityCode
        CreatedOn
        Status
        StatusValue
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CurrentLotQuantity

    }
  }
`;
const ViewBidDetailsScreen = ({ navigation, route }) => {
    const {
        bidView,
        bidPrice,
    } = useContext(AuthContext);

    const [isFetch, setIsFetch] = useState(false);
    const [loadingIndicator, setLoadingIndicator] = useState(false);
    const [arrayOfList, setArrayOfList] = React.useState([]);

    useEffect(() => {
    
    }, [])
    
    const onPressBack=()=> {
        navigation.goBack();
    }
    const onPressShowLanguage=()=> {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile =()=> {
        navigation.navigate('ProfileDetailScreen')
    }
    const updateSubValue = () => {
        setTimeout(async () => {
            setIsFetch(false)
            setLoadingIndicator(false)
        }, 500);
    }
    const updateBidsInfo = (data) => {
        console.log('datadatadatadatadatadata',data)
        setTimeout(async () => {
            setIsFetch(true);
            setLoadingIndicator(false)
            setArrayOfList(data.getBidsbyLotId)
        }, 100);
    }
    return (
        <View style={styles.container}>
           <View style={styles.view_header}>
                <HeaderComponents
                 headerTitle={bidView}
                 onPressBack={onPressBack}
                 isBackButton={true}
                 onPressProile={onPressProile}
                 onPressShowLanguage={onPressShowLanguage}/>
            </View>
            {(!isFetch) && (
               <Query query={GETBIDSBYLOT_QUERY} variables={{ lotId: route.params.lotId }}>
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
                   updateBidsInfo(data);
                   return <View />
               }}
           </Query>
            )}
            {loadingIndicator && <Loading />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.background_color,
    },
    view_header: {
        width: '100%',
        height: (Platform.OS == 'android') ? 60 : 90,
        backgroundColor: colors.white_color,
    },
});

export default ViewBidDetailsScreen;


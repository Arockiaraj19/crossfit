import React, { useEffect, useContext,useState } from 'react';
import { StyleSheet, View, FlatList, Platform, Alert, Text} from 'react-native';
import { colors, fonts, images } from '../core';
import HeaderComponents from '../components/HeaderComponents';
import { AuthContext } from '../components/AuthContext';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { useMutation } from '@apollo/react-hooks';
import { useFocusEffect } from '@react-navigation/native';

import EnquiryInfoComponents from '../components/EnquiryInfoComponents';
import { fetchDataFromServer } from '../helpers/QueryFetching';
import Loading from '../components/Loading';
import { GETENQUIRIES_QUERY } from '../helpers/Schema';
import { showToastMessage } from '../helpers/AppManager';

const DELETEENQUIRY_QUERY = gql`
mutation ($enquiryId: ID!){
    deleteEnquiry(enquiryId: $enquiryId) 
    
  }
`;

const EnquiryListScreen = ({ navigation, route }) => {

    const {
        myExpert,
        availableQuality,
        gradeText,
        deliverOn,
        updateon,
        editEnquiry,
        deleteEnquiryText,
        viewResponses,
        deleteEnquiryAlert,
        bidView,
        organic,
        noEnquiry,
    } = useContext(AuthContext);

    const [isFetchDate, setIsFetchDate] = React.useState(false);
    const [arrayOfList, setArrayOfList] = React.useState([]);
    const [deleteEnquiry, { loading, error, data }] = useMutation(DELETEENQUIRY_QUERY);
    const [isEmpty, setIsEmpty] = React.useState(false);
    const [isLoading,setLoading] = useState(false)
    const {getData : getEnquiry, loading : enquiryLoading, error : enquiryError, data : enquiryData} = fetchDataFromServer(GETENQUIRIES_QUERY)

    useFocusEffect(
        React.useCallback(() => {
            let isActive = true;
            getEnquiry()
            setIsFetchDate(true);
            return () => {
                isActive = false;
            };
        }, [])
    );

    useEffect(() => {
    updateValue(enquiryData?.getEnquiries)
    }, [enquiryData?.getEnquiries])

    const updateValue = (enquiries) => {
        setIsFetchDate(false);
        if(enquiries?.length == 0){
            setIsEmpty(true)
        }
        else {
            setIsEmpty(false)
        }
        setArrayOfList(enquiries);
    }
    const onPressShowLanguage = () => {
        navigation.navigate('LanguageListScreen')
    }
    const onPressProile =()=> {
        navigation.navigate('ProfileDetailScreen')
    }
    const onPressBack = () => {
        if(route.params.isProfile){
            navigation.goBack();
        }
        else {
            navigation.navigate('HomeScreen');
        }
    }
    const onPressEnquiryEdit = (item) => {
        var params = item
        params. addressId = item.UserAddressId
        console.log('itemitemitemitem',params)

        navigation.navigate('UpdateEnquiryScreen', { enquiryInfo: params, isEdit: true , isProfile: route?.params?.isProfile});
    }
    const onPressEnquiryDelete = (item) => {
        Alert.alert('', deleteEnquiryAlert, [{
            text: 'Cancel', onPress: () => { return; },
        },
        {
            text: 'Yes',
            onPress: () => {
                setLoading(true)
                deleteEnquiry({
                    variables: { enquiryId: parseInt(item.Id) }
                })
                    .then(res => {
                        setLoading(false)
                        showToastMessage('toastPopup',`${item.CommodityChild} ${res.data.deleteEnquiry}`)
                        getEnquiry()
                    })
                    .catch(e => {
                        setLoading(false)
                    });
                return;
            },
        },
        ]);
    }
    const onPressEnquiryDetail =(item)=> {
        
        console.log("onPressEnquiryDetail",item);
        navigation.navigate('ViewResponseEnquiryScreen', { details : item})
    }
    return (
        <View style={styles.container}>
           <View style={styles.view_header}>
                <HeaderComponents
                 headerTitle={myExpert}
                 isBackButton={true}
                 onPressBack={onPressBack}
                 onPressProile={onPressProile}
                 onPressShowLanguage={onPressShowLanguage}/>
            </View>
            {(isEmpty) && (
                    <Text style={styles.text_empty}>{noEnquiry}</Text>
                 )} 
            {!enquiryLoading ? (     
            <FlatList
                style={{ flex: 1, marginBottom: 10, }}
                data={arrayOfList}
                keyExtractor={(x, i) => i}
                renderItem={({ item, index }) => {
                    return (
                        <EnquiryInfoComponents
                            props={item}
                            bidView={bidView}
                            organic={organic}
                            availableQuality={availableQuality}
                            updateon={updateon}
                            DeliveryOn={deliverOn}
                            editEnquiry={editEnquiry}
                            deleteEnquiryText={deleteEnquiryText}
                            viewResponses={viewResponses}
                            gradeText={gradeText}
                            onPressLotEdit={onPressEnquiryEdit}
                            onPressLotDelete={onPressEnquiryDelete}
                            onPressEnquiryDetail={onPressEnquiryDetail} />
                    )
                }}
            /> )
            : <Loading/>
           }
           {isLoading && <Loading />}
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
    text_empty: {
        width: '100%',
        textAlign: 'center',
        marginTop: 75,
        fontFamily: fonts.MONTSERRAT_MEDIUM,
        fontSize: 18,
        color: colors.text_Color
    },
});

export default EnquiryListScreen;


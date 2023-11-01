import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GETADDRESSTYPE_QUERY = gql`
query { 
    getAddressTypes{ 
      Id 
      Name 
      Code 
      ImageURL
    } 
  } 
`;

const GETUSERSTATE_QUERY = gql`
query { 
    getStates{ 
      Id 
      Name 
      Code 
      ImageURL
    } 
  } 
`;

const GETDISTRICT_QUERY = gql`
query districtsByState($stateId: ID!){
    districtsByState(stateId:$stateId) {
      Id
  
      Name
  
      Code
    
    }
  }
`;

const GETTOWN_QUERY = gql`
query getTowns($districtId: ID!){
    getTowns(districtId:$districtId) {
        Id

        Name
      
        Code
      
        Taluks{
      
          Id
      
          Name
      
          Code
      
        }
    }
  }
`;

const GETGRADE_QUERY = gql`
query { 
    getGrades{ 
      Id 
      Name 
      Code 
    } 
  } 
`;

const GETWEIGHT_QUERY = gql`
query { 
    getWeight{ 
      Id 
      Name 
      Code 
    } 
  } 
`;

const GETLOTS_QUERY = gql`
query { 
    getLots{ 
        Id
        LotNumber
        AddressInfo
        CommodityChild
        CommodityChildImageURL
        CommodityChildId
        UserAddressId
        AddressInfoId
        Quantity
        CultivatedArea
        CultivatedAreaUnit
        IsOrganic
        UnitQuantity
        QuantityCode
        QuantityActualCode
        QuantityUnit
        SellerPrice
        GradeValue
        GradeId
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CreatedOn
        Status
        BidCount
        MSP
        IsLotEditable
    },
    getLotStatus{
        Id
        Name
        Code
  }
}
`;

const GETBIDS_QUERY = gql`
query { 
    getBids{ 
        Id
        LotId
        BidNumber
        AddressInfo
        UserAddressId
        Quantity
        QuantityValue
        QuantityUnit
        QuantityCode
        CommodityChildName
        CommodityChildURL
        BidPrice
        AskingPrice
        LotQuantity
        LotQuantityUnit
        LotQuantityValue
        LotQuantityCode
        CreatedOn
        Status
        QuantityActualCode
        MSP
        StatusValue
    },
    getBidStatus{
        Id
        Name
        Code
    }
  } 
`;
const GETROLES_QUERY = gql`
query { 
    getRoles{ 
      Id 
      Name 
      Code 
    } 
  } 
`;
const GETMANDIRATES_QUERY = gql`
query { 
    getMandiRates{ 
      Id 
      FileName
      Title
      UploaderName
      UploadedDate
      FilePath
    } 
  } 
`;
const GETVIEWMORELOTS_QUERY = gql`
query { 
    getDashboardLotViewMore{ 
        Id
        Name
        ImageURL
        Description
        Url
        DataCount
    }
}
`;

const GETVIEWMOREENQUIRIES_QUERY = gql`
query { 
    getDashboardEnquiryViewMore{ 
        Id
        Name
        ImageURL
        Description
        Url
        DataCount
    }
}
`;

const SALLERINFOLIST_QUERY = gql`
query getLotsByCommodityGroup($commodityGroupId: ID!){
    getLotsByCommodityGroup(commodityGroupId:$commodityGroupId) {
        Id
        LotNumber
        AddressInfo
        CommodityChild
        CommodityChildId
        UserAddressId
        AddressInfoId
        CommodityChildImageURL
        Quantity
        CultivatedArea
        CultivatedAreaUnit
        IsOrganic
        UnitQuantity
        QuantityCode
        QuantityUnit
        SellerPrice
        GradeValue
        GradeId
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        CreatedOn
        Status
        StatusValue
        BidCount
        MSP
    }
  }
`;

const SHOWENQUIRIES_QUERY = gql`
query showInterestedEnquiries($enquiryId: ID!){
    showInterestedEnquiries(enquiryId:$enquiryId) {
        Id
        EnquiryNumber
        UserId
        UserAddressId
        GradeId
        CommodityChild
        CommodityChildImageURL
        AddressInfo
        Quantity
        QuantityCode
        DeliveryOn
        CreatedOn
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        Status
        GradeValue
        ResponseCount
    }
  }
`;

const GETENQUIRIESBYCOMMODITYGROP_QUERY = gql`
query getenquiriesByCommodityGroup($commodityGroupId: ID!){
    getenquiriesByCommodityGroup(commodityGroupId:$commodityGroupId) {
        Id
        EnquiryNumber
        UserId
        UserAddressId
        GradeId
        CommodityChild
        CommodityChildImageURL
        AddressInfo
        Quantity
        UnitQuantity
        QuantityUnit
        QuantityCode
        DeliveryOn
        CreatedOn
        UserName
        MobileNo
        ProfilePicImageURL
        Rating
        Status
        GradeValue
        ResponseCount
        CommodityGroupId
    }
  }
`;

const privacyPolicyInfo_Query = gql`
query getPrivacyPolicyInfo{
    getPrivacyPolicyInfo 
  }
`;

const GETVIEWNOTIFICATION_QUERY = gql`
query {
     getNotificationData {
         Id
         NotificationId
         DeviceToken
         RedirectPage
         NotificationTitle
         NotificationBody
         NotificationType
         DeliveryOn
         BidPrice
         Quantity
         CommodityChild
     }
}
`

const DataFetchComponents = ({
    isType,
    selectedId,
    updateLoading,
    updateDate,
}) => {

    const [isFetching, setIsFetching] = useState(true);

    const updateValue = (value) => {
        if(value){
            updateLoading(true)
         //   setIsFetching(false);
        }else{
            updateLoading(false);
        }
        
    }
    const GetAddressTypeComponent = graphql(GETADDRESSTYPE_QUERY)(props => {
        const { error, getAddressTypes, loading } = props.data;
        { console.log('what is the type result',getAddressTypes) }
        if (getAddressTypes !=undefined && getAddressTypes) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getAddressTypes)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('what is the type error', error);
             updateValue(false);
            return (
                <View>
                </View>
            );
        }
        if(!error){
            setTimeout(async () => {
                updateValue(true);
            }, 500);
        }
        
        return <View />;
    });
  

    const GetGradeComponent = graphql(GETGRADE_QUERY)(props => {
        const { error, getGrades, loading } = props.data;
        { console.log('propspropsprops', props) }
        if (getGrades) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getGrades)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (loading) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(true);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(false);
            updateValue(true);
        }, 500);
        return <View />;
    });

    const GetWeightComponent = graphql(GETWEIGHT_QUERY)(props => {
        const { error, getWeight, loading } = props.data;
        { console.log('propspropsprops', props) }
        if (getWeight) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getWeight)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            updateLoading(false);
            console.log('errorerrorerrorerror', error);
            return (
                <View>
                </View>
            );
        }
        if (loading) {
            updateLoading(true);
            console.log('errorerrorerrorerror', error);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateValue(true);
        }, 500);
        return <View />;
    });

    const GetNotificationComponent = graphql(GETVIEWNOTIFICATION_QUERY)(props => {
        const { error, data, loading } = props;
        if(data.error) {
            updateLoading(false);
            return (
                <View></View>
            )
        }
        if(!data.loading){
          if(data.getNotificationData != undefined){
            setTimeout(async () => {
                updateLoading(false);
                updateDate(data?.getNotificationData)
            }, 100);
          }
           else if(data.getNotificationData == null){
            setTimeout(async () => {
                updateLoading(false);
                updateDate(data?.getNotificationData)
            }, 100);
        } 
        else {
            setTimeout(() => {
                updateLoading(true);
            }, 50);
        }
        return (
            <View>
            </View>
        );
        } 
        return (
            <View>
            </View>
        );
    })
    const GetViewMoreLotsComponent = graphql(GETVIEWMORELOTS_QUERY)(props => {
        const { error, data, loading } = props;
        if(!loading){
            { console.log('loadingloadingloadingloading', props.data?.getDashboardLotViewMore) }
            if(props.data?.getDashboardLotViewMore != undefined){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else if(props.data?.getDashboardLotViewMore ==null){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else {
                setTimeout(async () => {
                    updateLoading(true);
                }, 500);
            }
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(true);
            updateValue(true);
        }, 500);
        return <View />;
    });
    const GetViewMoreEnquiriesComponent = graphql(GETVIEWMOREENQUIRIES_QUERY)(props => {
        const { error, data, loading } = props;
        if(!loading){
            { console.log('loadingloadingloadingloading', props.data?.getDashboardEnquiryViewMore) }
            if(props.data?.getDashboardEnquiryViewMore != undefined){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else if(props.data?.getDashboardEnquiryViewMore ==null){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else {
                setTimeout(async () => {
                    updateLoading(true);
                }, 500);
            }
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(true);
            updateValue(true);
        }, 500);
        return <View />;
    });
    const GetLotsComponent = graphql(GETLOTS_QUERY)(props => {
        const { error, data, loading } = props;
        if(!loading){
            { console.log('loadingloadingloadingloading', props.data?.getLots) }
            if(props.data?.getLots != undefined){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else if(props.data?.getLots ==null){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else {
                setTimeout(async () => {
                    updateLoading(true);
                }, 500);
            }
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(true);
            updateValue(true);
        }, 500);
        return <View />;
    });

    const GetBidsComponent = graphql(GETBIDS_QUERY)(props => {
        const { error, data, loading } = props;
        { console.log('propspropspropsprops', props) }

        if(!loading){
            { console.log('loadingloadingloadingloading', props.data?.getBids) }
            if(props.data?.getBids != undefined){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else if(props.data?.getBids == null){
                setTimeout(async () => {
                    updateLoading(false);
                    updateDate(props.data)
                }, 500);
            }
            else {
                setTimeout(async () => {
                    updateLoading(true);
                }, 500);
            }
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(true);
            updateValue(true);
        }, 500);
        return <View />;
    });
    const GetUserStateComponent = graphql(GETUSERSTATE_QUERY)(props => {
        { console.log('Get State data') }

        const { error, getStates, loading } = props.data;
        { console.log('what is the state data', getStates) }
        if (getStates != undefined && getStates) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getStates)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            updateValue(false);
            console.log('what is the state error', error);
            return (
                <View>
                </View>
            );
        }
        if(!error){
            setTimeout(async () => {
                updateValue(true);
            }, 500);
        }
        
        return <View />;
    });
    const GetRolesComponent = graphql(GETROLES_QUERY)(props => {
        const { error, getRoles, loading } = props.data;
        { console.log('propspropsprops ---- ', props) }
        if (getRoles) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getRoles)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateLoading(false);
            updateValue(true);
        }, 500);
        return <View />;
    });
    const GetMandiRatesComponent = graphql(GETMANDIRATES_QUERY)(props => {
        const { error, getMandiRates, loading } = props.data;
        { console.log('propspropsprops111111 ---- ', props) }
        if (getMandiRates) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getMandiRates)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            setTimeout(async () => {
                updateLoading(false);
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if(loading){
            setTimeout(async () => {
                updateLoading(false);
                updateValue(true);
            }, 500);
        }
        return <View />;
    });
    const GetPolicyUrl = graphql(privacyPolicyInfo_Query)(props => {
        { console.log('propspropsprops ------------------11111111') }

        const { error, getPrivacyPolicyInfo, loading } = props.data;
        { console.log('propspropsprops ------------------', props) }
        if (getPrivacyPolicyInfo) {
            setTimeout(async () => {
                updateLoading(false);
                updateDate(getPrivacyPolicyInfo)
            }, 500);
            return (
                <View>
                </View>
            );
        }
        if (error) {
            console.log('errorerrorerrorerror', error);
            return (
                <View>
                </View>
            );
        }
        setTimeout(async () => {
            updateValue(true);
        }, 500);
        return <View />;
    });
    return (
        <View style={styles.container}>
          
            {(isFetching && (isType == 'Type')) && (
                <GetAddressTypeComponent />
            )}
            {(isFetching && (isType == 'State')) && (
                <GetUserStateComponent />
            )}
             {(isFetching && (isType == 'Grade')) && (
                <GetGradeComponent />
            )}
            {(isFetching && (isType == 'Weight')) && (
                <GetWeightComponent />
            )}
             {(isFetching && (isType == 'Lots')) && (
                <GetLotsComponent />
            )}
            {(isFetching && (isType == 'Bids')) && (
                <GetBidsComponent />
            )}
            {(isFetching && (isType == 'Role')) && (
                <GetRolesComponent />
            )}
             {(isFetching && (isType == 'ViewMoreLots')) && (
                <GetViewMoreLotsComponent />
            )}
            {(isFetching && (isType == 'Notification')) && (
                <GetNotificationComponent />
            )}

            {(isFetching && (isType == 'ViewMoreEnquiries')) && (
                <GetViewMoreEnquiriesComponent />
            )}
            {(isFetching && (isType == 'policy')) && (

                <GetPolicyUrl />
            )}
            {(isFetching && (isType == 'GetEnquiries')) && (
                <Query query={GETENQUIRIESBYCOMMODITYGROP_QUERY} variables={{ commodityGroupId: selectedId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                setTimeout(async () => {
                                    updateValue(true);
                                }, 100);
                            return <View />
                        };
                        if (error) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        if (!data) {
                            console.log('datadatadatadatadatadatadatadatadatadata',data)
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        setTimeout(async () => {
                            updateLoading(false);
                        }, 100);
                        updateDate(data)
                        return <View />
                    }}
                </Query>
            )}
            {(isFetching && (isType == 'SellerList')) && (
                <Query query={SALLERINFOLIST_QUERY} variables={{ commodityGroupId: selectedId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                setTimeout(async () => {
                                    updateValue(true);
                                }, 100);
                            return <View />
                        };
                        if (error) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        if (!data) {
                            console.log('datadatadatadatadatadatadatadatadatadata',data)
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        setTimeout(async () => {
                            updateLoading(false);
                        }, 100);
                        updateDate(data)
                        return <View />
                    }}
                </Query>
            )}
            {(isFetching && (isType == 'ViewResponse')) && (
                <Query query={SHOWENQUIRIES_QUERY} variables={{ enquiryId: selectedId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                setTimeout(async () => {
                                    updateValue(true);
                                }, 100);
                            return <View />
                        };
                        if (error) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        if (!data) {
                            console.log('datadatadatadatadatadatadatadatadatadata',data)
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        setTimeout(async () => {
                            updateLoading(false);
                        }, 100);
                        updateDate(data)
                        return <View />
                    }}
                </Query>
            )}
            {(isFetching && (isType == 'District')) && (
                <Query query={GETDISTRICT_QUERY} variables={{ stateId: selectedId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                setTimeout(async () => {
                                    updateValue(true);
                                }, 100);
                            return <View />
                        };
                        if (error) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        if (!data) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        setTimeout(async () => {
                            updateLoading(false);
                        }, 100);
                        updateDate(data.districtsByState)
                        return <View />
                    }}
                </Query>
            )}
            {(isFetching && (isType == 'Mandi')) && (
                <GetMandiRatesComponent />
            )}
            
            {(isFetching && (isType == 'Town')) && (
                <Query query={GETTOWN_QUERY} variables={{ districtId: selectedId }}>
                    {({ loading, error, data }) => {
                        if (loading) {
                            () =>
                                setTimeout(async () => {
                                    updateValue(true);
                                }, 100);
                            return <View />
                        };
                        if (error) {
                            console.log('errorerrorerrorerror', error)
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        if (!data) {
                            setTimeout(async () => {
                                updateLoading(false);
                            }, 100);
                            return <View />;
                        }
                        setTimeout(async () => {
                            updateLoading(false);
                        }, 100);
                        updateDate(data.getTowns)
                        return <View />
                    }}
                </Query>
            )}
        </View>
    );
};

export default DataFetchComponents;

const styles = StyleSheet.create({
    container: {
        width: 0,
        height: 0,
    },

});
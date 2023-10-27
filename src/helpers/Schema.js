import gql from 'graphql-tag';

export const GETVIEWMOREENQUIRIESDATA_QUERY = gql`
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
export const GETVIEWMORELOTSDATA_QUERY = gql`
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

export const GETVIEWLOTS_QUERY = gql`
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

export const GETENQUIRIES_QUERY = gql`
query {

    getEnquiries{
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
        CommodityChildId
    }
    }
`;

export const GETBIDS_QUERY = gql`
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

export const ALLOWMOBILENUMVIEW_QUERY = gql`
query($transactionid: ID!, $transactiontype :String!){
    allowtoViewMobileNo(transactionid : $transactionid, transactiontype : $transactiontype)
  }
`;

export const MOBILENUMBERAUDIT_QUERY = gql`
 mutation($transactionType :String!, $transactionId: ID!){
    addContactInformationLog(TransactionType : $transactionType, TransactionId : $transactionId)
 }
`;

export const USERINFORMATIONLOG_QUERY = gql`
   mutation {
    addUserInformationLog
   }
`;


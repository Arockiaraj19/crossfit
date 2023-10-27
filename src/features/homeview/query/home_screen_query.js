import gql from 'graphql-tag';

export const HOMEPAGEDETAIL_QUERY = gql`
query
{
  getDashboardData{
    HelpLine{
        Header
        Name
        ImageURL
        ContactDetails
        Url
      }
    CropfitClinic{
        Header
        Name
        ImageURL
        Description
        ContactDetails
        Url
    }
    Cropfit{
      Name
      ImageURL
      ContentImageURL
      Description
      Url
    }
    Lots {
      Id
      Name
      ImageURL
      Description
      DataCount
      Url
    }
    Enquiry {
        Id
        Name
        ImageURL
        Description
        DataCount
        Url
    }
    News {
       Name
      ImageURL
      Description
      Url
    }
    Advertisements {
      Header
      Name
      ImageURL
      Description
      ValidDays
      ValidInformation
      Url
    }
    Videos {
         Name
      ImageURL
      Description
      Url
    }
  },
  getReferalCode{
    UserId
    ReferalCode
    ValidUntil
    MessageContent
    ApplicationUrl
  }
  
}
`;

export const GET_ENQUIRY_QUERY = gql`
mutation($id: ID!){
    getenquiriesById(id:$id) {
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

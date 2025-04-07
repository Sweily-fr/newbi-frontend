import { gql } from '@apollo/client';

export const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      email
      profile {
        firstName
        lastName
        phone
        profilePicture
      }
      company {
        name
        email
        phone
        website
        logo
        siret
        vatNumber
        address {
          street
          city
          postalCode
          country
        }
        bankDetails {
          iban
          bic
          bankName
        }
      }
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UserProfileInput!) {
    updateProfile(input: $input) {
      id
      profile {
        firstName
        lastName
        phone
        profilePicture
      }
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($input: CompanyInput!) {
    updateCompany(input: $input) {
      id
      company {
        name
        email
        phone
        website
        logo
        siret
        vatNumber
        address {
          street
          city
          postalCode
          country
        }
        bankDetails {
          iban
          bic
          bankName
        }
      }
    }
  }
`;

export const UPLOAD_COMPANY_LOGO = gql`
  mutation UploadCompanyLogo($base64Image: String!) {
    uploadCompanyLogo(base64Image: $base64Image) {
      id
      company {
        name
        logo
      }
    }
  }
`;

export const DELETE_COMPANY_LOGO = gql`
  mutation DeleteCompanyLogo {
    deleteCompanyLogo {
      id
      company {
        name
        logo
      }
    }
  }
`;

export const UPLOAD_PROFILE_PICTURE = gql`
  mutation UploadProfilePicture($base64Image: String!) {
    uploadProfilePicture(base64Image: $base64Image) {
      id
      profile {
        firstName
        lastName
        profilePicture
      }
    }
  }
`;

export const DELETE_PROFILE_PICTURE = gql`
  mutation DeleteProfilePicture {
    deleteProfilePicture {
      id
      profile {
        firstName
        lastName
        profilePicture
      }
    }
  }
`;

export const DISABLE_ACCOUNT = gql`
  mutation DisableAccount($password: String!) {
    disableAccount(password: $password) {
      success
      message
    }
  }
`;

export const REACTIVATE_ACCOUNT = gql`
  mutation ReactivateAccount($email: String!, $password: String!) {
    reactivateAccount(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        profile {
          firstName
          lastName
        }
      }
    }
  }
`;

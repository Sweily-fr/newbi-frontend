import { gql } from '@apollo/client';

export const GET_EMAIL_SIGNATURES = gql`
  query GetEmailSignatures($page: Int, $limit: Int, $search: String) {
    emailSignatures(page: $page, limit: $limit, search: $search) {
      signatures {
        id
        name
        fullName
        jobTitle
        email
        phone
        mobilePhone
        website
        address
        companyName
        socialLinks {
          linkedin
          twitter
          facebook
          instagram
        }
        template
        primaryColor
        secondaryColor
        logoUrl
        showLogo
        profilePhotoUrl
        profilePhotoSize
        socialLinksDisplayMode
        socialLinksIconStyle
        socialLinksIconBgColor
        socialLinksIconColor
        socialLinksPosition
        layout
        horizontalSpacing
        verticalSpacing
        verticalAlignment
        imagesLayout
        fontFamily
        fontSize
        isDefault
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_EMAIL_SIGNATURE = gql`
  query GetEmailSignature($id: ID!) {
    emailSignature(id: $id) {
      id
      name
      fullName
      jobTitle
      email
      phone
      mobilePhone
      website
      address
      companyName
      socialLinks {
        linkedin
        twitter
        facebook
        instagram
      }
      template
      primaryColor
      secondaryColor
      logoUrl
      showLogo
      profilePhotoUrl
      profilePhotoSize
      socialLinksDisplayMode
      socialLinksIconStyle
      socialLinksIconBgColor
      socialLinksIconColor
      socialLinksPosition
      layout
      horizontalSpacing
      verticalSpacing
      verticalAlignment
      imagesLayout
      fontFamily
      fontSize
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const GET_DEFAULT_EMAIL_SIGNATURE = gql`
  query GetDefaultEmailSignature {
    defaultEmailSignature {
      id
      name
      fullName
      jobTitle
      email
      phone
      mobilePhone
      website
      address
      companyName
      socialLinks {
        linkedin
        twitter
        facebook
        instagram
      }
      template
      primaryColor
      secondaryColor
      logoUrl
      showLogo
      profilePhotoUrl
      profilePhotoSize
      socialLinksDisplayMode
      socialLinksIconStyle
      socialLinksIconBgColor
      socialLinksIconColor
      socialLinksPosition
      layout
      horizontalSpacing
      verticalSpacing
      verticalAlignment
      imagesLayout
      fontFamily
      fontSize
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_EMAIL_SIGNATURE = gql`
  mutation CreateEmailSignature($input: CreateEmailSignatureInput!) {
    createEmailSignature(input: $input) {
      id
      name
      fullName
      jobTitle
      email
      phone
      mobilePhone
      website
      address
      companyName
      socialLinks {
        linkedin
        twitter
        facebook
        instagram
      }
      template
      primaryColor
      secondaryColor
      logoUrl
      showLogo
      profilePhotoUrl
      profilePhotoSize
      socialLinksDisplayMode
      socialLinksIconStyle
      socialLinksIconBgColor
      socialLinksIconColor
      socialLinksPosition
      layout
      horizontalSpacing
      verticalSpacing
      verticalAlignment
      imagesLayout
      fontFamily
      fontSize
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_EMAIL_SIGNATURE = gql`
  mutation UpdateEmailSignature($id: ID!, $input: UpdateEmailSignatureInput!) {
    updateEmailSignature(id: $id, input: $input) {
      id
      name
      fullName
      jobTitle
      email
      phone
      mobilePhone
      website
      address
      companyName
      socialLinks {
        linkedin
        twitter
        facebook
        instagram
      }
      template
      primaryColor
      secondaryColor
      logoUrl
      showLogo
      profilePhotoUrl
      profilePhotoSize
      socialLinksDisplayMode
      socialLinksIconStyle
      socialLinksIconBgColor
      socialLinksIconColor
      socialLinksPosition
      layout
      horizontalSpacing
      verticalSpacing
      verticalAlignment
      imagesLayout
      fontFamily
      fontSize
      isDefault
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_EMAIL_SIGNATURE = gql`
  mutation DeleteEmailSignature($id: ID!) {
    deleteEmailSignature(id: $id)
  }
`;

export const SET_DEFAULT_EMAIL_SIGNATURE = gql`
  mutation SetDefaultEmailSignature($id: ID!) {
    setDefaultEmailSignature(id: $id) {
      id
      name
      fullName
      jobTitle
      email
      phone
      mobilePhone
      website
      address
      companyName
      socialLinks {
        linkedin
        twitter
        facebook
        instagram
      }
      template
      primaryColor
      secondaryColor
      logoUrl
      showLogo
      profilePhotoUrl
      profilePhotoSize
      socialLinksDisplayMode
      socialLinksIconStyle
      socialLinksIconBgColor
      socialLinksIconColor
      socialLinksPosition
      layout
      horizontalSpacing
      verticalSpacing
      verticalAlignment
      imagesLayout
      fontFamily
      fontSize
      isDefault
      createdAt
      updatedAt
    }
  }
`;

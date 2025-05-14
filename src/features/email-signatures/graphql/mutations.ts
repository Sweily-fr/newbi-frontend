import { gql } from '@apollo/client';

// Fragment pour les champs communs des signatures email
export const EMAIL_SIGNATURE_FIELDS = gql`
  fragment EmailSignatureFields on EmailSignature {
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
`;

// Mutation pour créer une signature email
export const CREATE_EMAIL_SIGNATURE = gql`
  mutation CreateEmailSignature($input: CreateEmailSignatureInput!) {
    createEmailSignature(input: $input) {
      ...EmailSignatureFields
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;

// Mutation pour mettre à jour une signature email
export const UPDATE_EMAIL_SIGNATURE = gql`
  mutation UpdateEmailSignature($id: ID!, $input: UpdateEmailSignatureInput!) {
    updateEmailSignature(id: $id, input: $input) {
      ...EmailSignatureFields
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;

// Mutation pour supprimer une signature email
export const DELETE_EMAIL_SIGNATURE = gql`
  mutation DeleteEmailSignature($id: ID!) {
    deleteEmailSignature(id: $id) {
      id
      success
      message
    }
  }
`;

// Mutation pour définir une signature email par défaut
export const SET_DEFAULT_EMAIL_SIGNATURE = gql`
  mutation SetDefaultEmailSignature($id: ID!) {
    setDefaultEmailSignature(id: $id) {
      ...EmailSignatureFields
    }
  }
  ${EMAIL_SIGNATURE_FIELDS}
`;

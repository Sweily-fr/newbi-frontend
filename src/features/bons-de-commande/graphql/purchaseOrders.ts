import { gql } from "@apollo/client";

export const PURCHASE_ORDER_FRAGMENT = gql`
  fragment PurchaseOrderFields on PurchaseOrder {
    id
    prefix
    number
    issueDate
    validUntil
    status
    headerNotes
    footerNotes
    termsAndConditions
    termsAndConditionsLinkTitle
    termsAndConditionsLink
    discount
    discountType
    discountAmount
    totalHT
    totalTTC
    totalVAT
    finalTotalHT
    finalTotalTTC
    createdAt
    updatedAt
    companyInfo {
      name
      email
      phone
      website
      siret
      vatNumber
      logo
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
    client {
      id
      name
      email
      type
      address {
        street
        city
        postalCode
        country
      }
      hasDifferentShippingAddress
      shippingAddress {
        street
        city
        postalCode
        country
      }
      siret
      vatNumber
      firstName
      lastName
    }
    items {
      description
      quantity
      unitPrice
      vatRate
      unit
      discount
      discountType
      details
      vatExemptionText
    }
    customFields {
      key
      value
    }
    convertedToInvoice {
      id
      prefix
      number
      status
      finalTotalTTC
    }
    linkedInvoices {
      id
      prefix
      number
      status
      finalTotalTTC
    }
  }
`;

export const GET_NEXT_PURCHASE_ORDER_NUMBER = gql`
  query NextPurchaseOrderNumber($prefix: String) {
    nextPurchaseOrderNumber(prefix: $prefix)
  }
`;

export const GET_PURCHASE_ORDERS = gql`
  query GetPurchaseOrders(
    $startDate: String
    $endDate: String
    $status: PurchaseOrderStatus
    $search: String
    $page: Int
    $limit: Int
  ) {
    purchaseOrders(
      startDate: $startDate
      endDate: $endDate
      status: $status
      search: $search
      page: $page
      limit: $limit
    ) {
      purchaseOrders {
        ...PurchaseOrderFields
      }
      totalCount
      hasNextPage
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

export const GET_PURCHASE_ORDER = gql`
  query GetPurchaseOrder($id: ID!) {
    purchaseOrder(id: $id) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

export const CREATE_PURCHASE_ORDER_MUTATION = gql`
  mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput!) {
    createPurchaseOrder(input: $input) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

export const UPDATE_PURCHASE_ORDER_MUTATION = gql`
  mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
    updatePurchaseOrder(id: $id, input: $input) {
      ...PurchaseOrderFields
    }
  }
  ${PURCHASE_ORDER_FRAGMENT}
`;

export const DELETE_PURCHASE_ORDER_MUTATION = gql`
  mutation DeletePurchaseOrder($id: ID!) {
    deletePurchaseOrder(id: $id)
  }
`;

export const CHANGE_PURCHASE_ORDER_STATUS_MUTATION = gql`
  mutation ChangePurchaseOrderStatus($id: ID!, $status: PurchaseOrderStatus!) {
    changePurchaseOrderStatus(id: $id, status: $status) {
      id
      status
      updatedAt
    }
  }
`;

export const CONVERT_PURCHASE_ORDER_TO_INVOICE_MUTATION = gql`
  mutation ConvertPurchaseOrderToInvoice(
    $id: ID!
    $distribution: [Float]
    $isDeposit: Boolean
    $skipValidation: Boolean
  ) {
    convertPurchaseOrderToInvoice(
      id: $id
      distribution: $distribution
      isDeposit: $isDeposit
      skipValidation: $skipValidation
    ) {
      id
      number
      prefix
      status
      totalHT
      totalTTC
      totalVAT
      isDeposit
      createdAt
      client {
        id
      }
      items {
        description
        quantity
        unitPrice
      }
    }
  }
`;

// Version détaillée de la mutation de conversion avec tous les champs client
export const CONVERT_PURCHASE_ORDER_TO_INVOICE_DETAILED_MUTATION = gql`
  mutation ConvertPurchaseOrderToInvoiceDetailed(
    $id: ID!
    $distribution: [Float]
    $isDeposit: Boolean
    $skipValidation: Boolean
  ) {
    convertPurchaseOrderToInvoice(
      id: $id
      distribution: $distribution
      isDeposit: $isDeposit
      skipValidation: $skipValidation
    ) {
      id
      number
      prefix
      status
      totalHT
      totalTTC
      totalVAT
      isDeposit
      createdAt
      client {
        id
        name
        email
        type
        address {
          street
          city
          postalCode
          country
        }
        hasDifferentShippingAddress
        shippingAddress {
          street
          city
          postalCode
          country
        }
        siret
        vatNumber
        firstName
        lastName
      }
      items {
        description
        quantity
        unitPrice
        vatRate
        unit
        discount
        discountType
        details
        vatExemptionText
      }
    }
  }
`;

export const GET_PURCHASE_ORDER_STATS = gql`
  query GetPurchaseOrderStats {
    purchaseOrderStats {
      totalCount
      draftCount
      pendingCount
      canceledCount
      completedCount
      totalAmount
      conversionRate
    }
  }
`;

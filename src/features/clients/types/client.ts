/**
 * Types liés aux clients et à leurs formulaires
 */

/**
 * Type de client
 */
export enum ClientType {
  INDIVIDUAL = 'INDIVIDUAL',
  COMPANY = 'COMPANY'
}

/**
 * Structure de données d'un client
 */
export interface ClientFormData {
  name: string;
  email: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  // Adresse de livraison
  hasDifferentShippingAddress?: boolean;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  type: ClientType;
  // Champs spécifiques aux entreprises
  siret?: string;
  vatNumber?: string;
  // Champs spécifiques aux particuliers
  firstName?: string;
  lastName?: string;
}

/**
 * Structure de données d'un client avec ID
 * Étend ClientFormData en ajoutant un identifiant unique
 */
export interface Client extends ClientFormData {
  id: string;
}

/**
 * Props pour le composant de formulaire client
 */
export interface ClientFormProps {
  initialData?: ClientFormData;
  onSubmit: (data: ClientFormData) => void;
  onCancel?: () => void;
  id?: string;
}

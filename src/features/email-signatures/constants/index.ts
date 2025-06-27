/**
 * Constantes pour la fonctionnalité de signature email
 */

/**
 * Options de disposition disponibles pour la signature
 */
export const LAYOUT_OPTIONS = [
  { value: 'horizontal', label: 'Horizontale' },
  { value: 'vertical', label: 'Verticale' },
  { value: 'stacked', label: 'Empilée' },
  { value: 'sideBySide', label: 'Côte à côte' },
] as const;

export type LayoutOption = typeof LAYOUT_OPTIONS[number]['value'];

/**
 * Options d'alignement du texte
 */
export const TEXT_ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Gauche' },
  { value: 'center', label: 'Centre' },
  { value: 'right', label: 'Droite' },
] as const;

export type TextAlignmentOption = typeof TEXT_ALIGNMENT_OPTIONS[number]['value'];

/**
 * Options de style de texte
 */
export const TEXT_STYLE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'underline', label: 'Souligné' },
  { value: 'overline', label: 'Ligne au-dessus' },
  { value: 'strikethrough', label: 'Barré' },
] as const;

export type TextStyleOption = typeof TEXT_STYLE_OPTIONS[number]['value'];

/**
 * Options d'affichage des icônes de réseaux sociaux
 */
export const SOCIAL_LINKS_DISPLAY_OPTIONS = [
  { value: 'icons', label: 'Icônes uniquement' },
  { value: 'text', label: 'Texte uniquement' },
  { value: 'both', label: 'Icônes et texte' },
] as const;

export type SocialLinksDisplayOption = typeof SOCIAL_LINKS_DISPLAY_OPTIONS[number]['value'];

/**
 * Options de style des icônes de réseaux sociaux
 */
export const SOCIAL_LINKS_ICON_STYLE_OPTIONS = [
  { value: 'plain', label: 'Simple' },
  { value: 'rounded', label: 'Arrondi' },
  { value: 'circle', label: 'Cercle' },
  { value: 'filled', label: 'Plein' },
] as const;

export type SocialLinksIconStyleOption = typeof SOCIAL_LINKS_ICON_STYLE_OPTIONS[number]['value'];

/**
 * Options de position des liens de réseaux sociaux
 */
export const SOCIAL_LINKS_POSITION_OPTIONS = [
  { value: 'bottom', label: 'En bas' },
  { value: 'right', label: 'À droite' },
  { value: 'left', label: 'À gauche' },
  { value: 'below-personal', label: 'Sous les informations personnelles' },
] as const;

export type SocialLinksPositionOption = typeof SOCIAL_LINKS_POSITION_OPTIONS[number]['value'];

/**
 * Options de police de caractères
 */
export const FONT_FAMILY_OPTIONS = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Helvetica, sans-serif', label: 'Helvetica' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Garamond, serif', label: 'Garamond' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Brush Script MT, cursive', label: 'Brush Script' },
] as const;

export type FontFamilyOption = typeof FONT_FAMILY_OPTIONS[number]['value'];

/**
 * Options de taille de police
 */
export const FONT_SIZE_OPTIONS = [
  { value: 10, label: 'Très petit (10px)' },
  { value: 12, label: 'Petit (12px)' },
  { value: 14, label: 'Moyen (14px)' },
  { value: 16, label: 'Grand (16px)' },
  { value: 18, label: 'Très grand (18px)' },
  { value: 20, label: 'Énorme (20px)' },
];

/**
 * Options d'espacement
 */
export const SPACING_OPTIONS = [
  { value: 0, label: 'Aucun' },
  { value: 4, label: 'Très petit (4px)' },
  { value: 8, label: 'Petit (8px)' },
  { value: 12, label: 'Moyen (12px)' },
  { value: 16, label: 'Grand (16px)' },
  { value: 24, label: 'Très grand (24px)' },
  { value: 32, label: 'Énorme (32px)' },
];

/**
 * Options de taille de logo
 */
export const LOGO_SIZE_OPTIONS = [
  { value: 50, label: 'Très petit (50px)' },
  { value: 80, label: 'Petit (80px)' },
  { value: 100, label: 'Moyen (100px)' },
  { value: 120, label: 'Grand (120px)' },
  { value: 150, label: 'Très grand (150px)' },
];

/**
 * Options de taille de photo de profil
 */
export const PROFILE_PHOTO_SIZE_OPTIONS = [
  { value: 40, label: 'Très petit (40px)' },
  { value: 60, label: 'Petit (60px)' },
  { value: 80, label: 'Moyen (80px)' },
  { value: 100, label: 'Grand (100px)' },
  { value: 120, label: 'Très grand (120px)' },
];

/**
 * Options de couleur prédéfinies
 */
export const COLOR_PRESETS = [
  // Couleurs primaires
  '#5b50ff', // Nouvelle Bleu
  '#3366FF', // Bleu vif
  '#FF4D4F', // Rouge
  '#52C41A', // Vert
  '#FAAD14', // Orange
  '#722ED1', // Violet
  '#13C2C2', // Cyan
  '#EB2F96', // Magenta
  '#F5222D', // Rouge foncé
  '#FA541C', // Orange foncé
  '#FA8C16', // Orange doré
  '#FADB14', // Jaune
  '#A0D911', // Vert citron
  '#73D13D', // Vert pomme
  '#36CFC9', // Turquoise
  '#1890FF', // Bleu clair
  '#2F54EB', // Bleu roi
  '#722ED1', // Violet
  '#EB2F96', // Rose
  
  // Nuances de gris
  '#000000', // Noir
  '#262626', // Gris très foncé
  '#595959', // Gris foncé
  '#8C8C8C', // Gris moyen
  '#BFBFBF', // Gris clair
  '#D9D9D9', // Gris très clair
  '#F0F0F0', // Gris pâle
  '#F5F5F5', // Gris très pâle
  '#FAFAFA', // Gris presque blanc
  '#FFFFFF', // Blanc
];

/**
 * Options de modèles de signature
 */
export const SIGNATURE_TEMPLATES = [
  {
    id: 1,
    name: 'Moderne',
    description: 'Design épuré avec une mise en page équilibrée',
    previewImage: '/images/signature-templates/modern-preview.png',
  },
  {
    id: 2,
    name: 'Classique',
    description: 'Style traditionnel avec une touche professionnelle',
    previewImage: '/images/signature-templates/classic-preview.png',
  },
  {
    id: 3,
    name: 'Minimaliste',
    description: 'Simple et élégant avec un espacement généreux',
    previewImage: '/images/signature-templates/minimalist-preview.png',
  },
  {
    id: 4,
    name: 'Créatif',
    description: 'Design moderne avec des éléments visuels accrocheurs',
    previewImage: '/images/signature-templates/creative-preview.png',
  },
  {
    id: 5,
    name: 'Professionnel',
    description: 'Style corporatif avec une hiérarchie claire',
    previewImage: '/images/signature-templates/professional-preview.png',
  },
  {
    id: 6,
    name: 'Élégant',
    description: 'Design raffiné avec des polices élégantes',
    previewImage: '/images/signature-templates/elegant-preview.png',
  },
  {
    id: 7,
    name: 'Moderne avec photo',
    description: 'Mise en page moderne intégrant une photo de profil',
    previewImage: '/images/signature-templates/modern-with-photo-preview.png',
  },
  {
    id: 8,
    name: 'Réseaux sociaux',
    description: 'Mise en avant des liens vers les réseaux sociaux',
    previewImage: '/images/signature-templates/social-preview.png',
  },
  {
    id: 9,
    name: 'Vertical',
    description: 'Mise en page verticale optimisée pour la lisibilité',
    previewImage: '/images/signature-templates/vertical-preview.png',
  },
  {
    id: 10,
    name: 'Horizontal',
    description: 'Mise en page horizontale pour une utilisation optimale de l\'espace',
    previewImage: '/images/signature-templates/horizontal-preview.png',
  },
  {
    id: 11,
    name: 'Avec bannière',
    description: 'Inclut une bannière personnalisable en haut de la signature',
    previewImage: '/images/signature-templates/banner-preview.png',
  },
  {
    id: 12,
    name: 'Avec séparateur',
    description: 'Utilise des séparateurs pour une meilleure organisation visuelle',
    previewImage: '/images/signature-templates/separator-preview.png',
  },
];

export type SignatureTemplate = typeof SIGNATURE_TEMPLATES[number];

/**
 * Valeurs par défaut pour une nouvelle signature
 */
export const DEFAULT_SIGNATURE_VALUES: Partial<import('./types').EmailSignature> = {
  name: 'Nouvelle signature',
  fullName: '',
  jobTitle: '',
  email: '',
  phone: '',
  companyName: '',
  primaryColor: '#5b50ff',
  secondaryColor: '#333333',
  fontFamily: 'Arial, sans-serif',
  fontSize: 12,
  textStyle: 'normal',
  layout: 'horizontal',
  textAlignment: 'left',
  verticalSpacing: 8,
  horizontalSpacing: 16,
  iconTextSpacing: 8,
  showLogo: true,
  showProfilePhoto: false,
  showEmailIcon: true,
  showPhoneIcon: true,
  showAddressIcon: true,
  showWebsiteIcon: true,
  socialLinksDisplayMode: 'icons',
  socialLinksIconStyle: 'plain',
  socialLinksPosition: 'bottom',
  socialLinks: {
    linkedin: '',
    twitter: '',
    facebook: '',
    instagram: '',
  },
} as const;

/**
 * Types de fichiers autorisés pour le téléchargement
 */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Taille maximale des fichiers (5 Mo)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo

/**
 * Dimensions maximales des images
 */
export const MAX_IMAGE_DIMENSIONS = {
  width: 2000,
  height: 2000,
} as const;

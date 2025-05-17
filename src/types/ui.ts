import { ButtonHTMLAttributes, FormHTMLAttributes, ReactNode, ChangeEvent, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { FieldError, UseFormRegister, RegisterOptions } from 'react-hook-form';

/**
 * Interfaces pour les composants UI
 */

// Button
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loaderPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

// Form
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
}

// FormActions
export interface FormActionsProps {
  onCancel?: () => void;
  cancelText?: string;
  submitText?: string;
  isSubmitting?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

// FieldGroup
export interface FieldGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
  spacing?: 'tight' | 'normal' | 'loose';
}

// TextField
export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label?: string;
  type?: string;
  // React Hook Form props (optionnelles)
  register?: UseFormRegister<any>;
  error?: FieldError | string;
  validation?: RegisterOptions;
  // Props standard pour utilisation sans React Hook Form
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  helpText?: string;
}

// TextArea
export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  id: string;
  name: string;
  label?: string;
  // React Hook Form props (optionnelles)
  register?: UseFormRegister<any>;
  error?: FieldError | string;
  validation?: RegisterOptions;
  // Props standard pour utilisation sans React Hook Form
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  helpText?: string;
  rows?: number;
}

// Select
export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  id: string;
  name: string;
  label?: string;
  options: SelectOption[];
  // React Hook Form props (optionnelles)
  register?: UseFormRegister<any>;
  error?: FieldError | string;
  // Props standard pour utilisation sans React Hook Form
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  selectClassName?: string;
  helpText?: string;
}

// Checkbox
export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label: string;
  // React Hook Form props (optionnelles)
  register?: UseFormRegister<any>;
  error?: FieldError;
  // Props standard pour utilisation sans React Hook Form
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  helpText?: string;
  variant?: 'default' | 'blue' | 'minus';
}

// Radio
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id: string;
  name: string;
  label: string;
  value: string;
  // React Hook Form props (optionnelles)
  register?: UseFormRegister<any>;
  error?: FieldError;
  // Props standard pour utilisation sans React Hook Form
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  helpText?: string;
}

// ImageUploader
export interface ImageUploaderProps {
  /**
   * URL de l'image existante
   */
  imageUrl?: string;
  /**
   * URL de base de l'API pour les images
   */
  apiBaseUrl?: string;
  /**
   * Image en prévisualisation (base64)
   */
  previewImage?: string | null;
  /**
   * Indique si une opération est en cours (upload, suppression)
   */
  isLoading?: boolean;
  /**
   * Message à afficher pendant le chargement
   */
  loadingMessage?: string;
  /**
   * Fonction appelée lors de la sélection d'un fichier
   */
  onFileSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Fonction appelée lors de la suppression de l'image
   */
  onDelete?: () => void;
  /**
   * Référence vers l'input file
   */
  fileInputRef?: React.RefObject<HTMLInputElement>;
  /**
   * Taille maximale du fichier en MB
   */
  maxSizeMB?: number;
  /**
   * Types de fichiers acceptés
   */
  acceptedFileTypes?: string;
  /**
   * Classe CSS additionnelle
   */
  className?: string;
  /**
   * Texte d'aide
   */
  helpText?: string;
}

// Dropdown
export interface DropdownItem {
  label: string | React.ReactNode;
  onClick: () => void;
  hasDivider?: boolean;
  className?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  tooltip?: string;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  position?: 'left' | 'right';
  width?: string;
  className?: string;
}

// Avatar
export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  name?: string;
  bgColor?: string;
  textColor?: string;
  hasRing?: boolean;
  ringColor?: string;
  className?: string;
  onClick?: () => void;
}

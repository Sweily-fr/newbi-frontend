import { ContentAnalysisResult } from '../../types';

// Types pour les popups
export interface LinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, isInternal: boolean, linkText?: string) => void;
  initialSelection: string;
  noSelection?: boolean;
}

export interface ImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, alt: string, width?: string, height?: string) => void;
}

export interface EditImagePopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageElement: HTMLImageElement | null;
  onSubmit: (alt: string, width: string, height: string) => void;
}

export interface RichTextEditorProps {
  placeholder?: string;
}

import React from 'react';

export interface LinkPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (url: string, isInternal: boolean, linkText?: string) => void;
  initialSelection: string;
  noSelection?: boolean;
}

export interface EditorToolbarProps {
  activeFormats: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    h1: boolean;
    h2: boolean;
    h3: boolean;
    p: boolean;
    ul: boolean;
    ol: boolean;
  };
  isLinkSelected: boolean;
  isAnalyzing: boolean;
  handleFormatAction: (action: string, value?: string) => void;
  handleRemoveLink: () => void;
  handleLinkButtonClick: (e: React.MouseEvent) => void;
  handleImageButtonClick: (e: React.MouseEvent) => void;
  handleAnalyzeContent: () => void;
}

import React from 'react';

export const EditorStyles: React.FC = () => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: `
        /* La classe keyword-highlight est désactivée - les titres n'ont plus de bordure spéciale */
        .keyword-highlight {
          /* Styles supprimés */
        }
        
        /* Styles pour les liens */
        [contenteditable] a[data-link-type="internal"] {
          color: #5b50ff;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        [contenteditable] a[data-link-type="internal"]:hover {
          color: #4a41e0;
        }
        
        [contenteditable] a[data-link-type="external"] {
          color: #8a82ff;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        [contenteditable] a[data-link-type="external"]:hover {
          color: #7a71ff;
        }
        
        /* Style pour les mots complexes */
        .complex-word {
          color: #ff4d4f;
          font-weight: 500;
          position: relative;
          white-space: normal; /* Permet le retour à la ligne pour les mots complexes aussi */
        }
        
        /* Règles CSS pour empêcher la coupure des mots */
        .rich-text-editor {
          width: 100% !important;
        }
        
        /* Style pour l'éditeur et tous ses éléments */
        [contenteditable],
        [contenteditable] p,
        [contenteditable] div,
        [contenteditable] span,
        [contenteditable] a,
        [contenteditable] strong,
        [contenteditable] em,
        [contenteditable] b,
        [contenteditable] i,
        [contenteditable] u {
          /* Propriétés essentielles pour empêcher la coupure des mots */
          word-break: keep-all !important; /* Empêche la coupure des mots */
          overflow-wrap: break-word !important; /* Force le passage à la ligne */
          word-wrap: break-word !important; /* Pour compatibilité */
          
          /* Désactiver toutes les formes de césure */
          -webkit-hyphens: none !important;
          -moz-hyphens: none !important;
          -ms-hyphens: none !important;
          hyphens: none !important;
          
          /* Gestion de l'espace blanc */
          white-space: normal !important;
        }
        
        /* Style spécifique pour les paragraphes */
        [contenteditable] p {
          width: 100% !important;
          max-width: 100% !important;
          display: block !important;
        }
        
        /* Style pour le texte en général */
        [contenteditable] {
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Empêcher les mots de dépasser de leur conteneur */
        [contenteditable] * {
          max-width: 100% !important;
        }
        
        /* Style pour les mots complexes au survol */
        .complex-word:hover::after {
          content: 'Mot complexe';
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #ff4d4f;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
        }
        
        /* Styles pour les titres */
        [contenteditable] h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        [contenteditable] h2 {
          font-size: 1.5rem;
          font-weight: bold;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #1f2937;
        }
        
        [contenteditable] h3 {
          font-size: 1.25rem;
          font-weight: bold;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #374151;
        }
        
        [contenteditable] p {
          font-size: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }
        
        /* Styles pour les listes à puces */
        [contenteditable] ul {
          list-style-type: disc;
          margin-left: 2rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        [contenteditable] ul li {
          margin-bottom: 0.25rem;
          color: #4b5563;
        }
        
        /* Styles pour les listes numérotées */
        [contenteditable] ol {
          list-style-type: decimal;
          margin-left: 2rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        [contenteditable] ol li {
          margin-bottom: 0.25rem;
          color: #4b5563;
        }
        
        /* Style pour le placeholder */
        [contenteditable].empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          font-style: italic;
          pointer-events: none;
          display: block;
        }
      `
    }} />
  );
};

export default EditorStyles;

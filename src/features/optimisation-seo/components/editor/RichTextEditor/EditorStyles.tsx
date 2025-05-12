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

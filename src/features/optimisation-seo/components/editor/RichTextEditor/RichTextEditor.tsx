import React, { useRef, useEffect, useCallback } from 'react';
import { calculateWordCount } from './utils';

interface RichTextEditorProps {
  placeholder?: string;
  className?: string;
  content?: string;
  onContentChange?: (content: string) => void;
  onWordCountChange?: (count: number) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  placeholder = 'Écrivez votre contenu ici...',
  className = '',
  content = '',
  onContentChange,
  onWordCountChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  // Sauvegarder la position du curseur
  const saveCursorPosition = useCallback((containerEl: HTMLElement, range: Range) => {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(containerEl);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const start = preCaretRange.toString().length;

    return {
      start,
      end: start + range.toString().length
    };
  }, []);

  // Restaurer la position du curseur
  const restoreCursorPosition = useCallback((containerEl: HTMLElement, savedPosition: { start: number, end: number }) => {
    let charIndex = 0;
    const range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);

    const nodeStack: Node[] = [containerEl];
    let node: Node | undefined;
    let foundStart = false;
    let stop = false;

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === Node.TEXT_NODE) {
        const nextCharIndex = charIndex + (node.textContent?.length || 0);

        if (!foundStart && savedPosition.start >= charIndex && savedPosition.start <= nextCharIndex) {
          range.setStart(node, savedPosition.start - charIndex);
          foundStart = true;
        }

        if (foundStart && savedPosition.end >= charIndex && savedPosition.end <= nextCharIndex) {
          range.setEnd(node, savedPosition.end - charIndex);
          stop = true;
        }

        charIndex = nextCharIndex;
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        let i = node.childNodes.length;
        while (i--) {
          nodeStack.push(node.childNodes[i]);
        }
      }
    }

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, []);

  // Gérer le changement de contenu
  const handleContentChange = useCallback((newContent: string) => {
    if (!editorRef.current) return newContent;

    const selection = window.getSelection();
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    const cursorPosition = range ? saveCursorPosition(editorRef.current, range) : null;

    editorRef.current.innerHTML = newContent;

    if (cursorPosition) {
      restoreCursorPosition(editorRef.current, cursorPosition);
    }

    return newContent;
  }, [saveCursorPosition, restoreCursorPosition]);

  // Gérer l'événement d'entrée
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;

    const currentContent = editorRef.current.innerHTML;
    handleContentChange(currentContent);

    const wordCount = calculateWordCount(editorRef.current.innerText);
    onWordCountChange?.(wordCount);
    onContentChange?.(currentContent);
  }, [handleContentChange, onWordCountChange, onContentChange]);

  // Initialisation de l'éditeur
  useEffect(() => {
    if (editorRef.current && content !== undefined) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  // Configuration de l'éditeur
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Rendre l'éditeur éditable
    editor.contentEditable = 'true';
    editor.addEventListener('input', handleInput);
    
    // Nettoyage
    return () => {
      editor.removeEventListener('input', handleInput);
    };
  }, [handleInput]);

  return (
    <div className={`rich-text-editor ${className}`}>
      <div 
        ref={editorRef}
        className={`editor-content ${!content ? 'empty' : ''}`}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;

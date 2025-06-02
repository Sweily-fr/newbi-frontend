import React from 'react';
import { formatFileSize, getFileIcon, isImage } from '../utils/fileUtils';
import { CloseCircle, DocumentText, Image } from 'iconsax-react';

interface FilePreviewProps {
  files: File[];
  onRemove: (index: number) => void;
  className?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({
  files,
  onRemove,
  className = '',
}) => {
  if (files.length === 0) return null;

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Fichiers sélectionnés ({files.length})</h3>
        <p className="text-sm text-gray-500">
          Taille totale: {formatFileSize(totalSize)}
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[#f0eeff] mr-3">
                {isImage(file.type) ? (
                  <Image size="20" color="#5b50ff" variant="Bulk" />
                ) : (
                  <DocumentText size="20" color="#5b50ff" variant="Bulk" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {file.type || 'Type inconnu'}
                </p>
              </div>
              <button
                onClick={() => onRemove(index)}
                className="flex-shrink-0 ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Supprimer le fichier"
              >
                <CloseCircle size="20" color="#718096" variant="Bulk" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilePreview;

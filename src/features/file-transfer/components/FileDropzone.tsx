import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { formatFileSize } from '../utils/fileUtils';
import { DocumentUpload } from 'iconsax-react';

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // en octets
  accept?: Record<string, string[]>;
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesSelected,
  maxFiles = 20,
  maxSize = 10 * 1024 * 1024 * 1024, // 10GB par défaut
  accept,
  className = '',
}) => {
  const [rejectedFiles, setRejectedFiles] = useState<{
    file: File;
    reason: string;
  }[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      // Gérer les fichiers acceptés
      if (acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }

      // Gérer les fichiers rejetés
      const rejected = fileRejections.map((rejection) => ({
        file: rejection.file,
        reason: rejection.errors[0].message,
      }));
      setRejectedFiles(rejected);
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-[#5b50ff] bg-[#f0eeff]'
            : 'border-gray-300 hover:border-[#5b50ff] hover:bg-[#f0eeff]'
        } ${className}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center">
          <DocumentUpload
            size="48"
            color={isDragActive ? '#5b50ff' : '#718096'}
            variant="Bulk"
            className="mb-4"
          />
          <p className="text-lg font-medium mb-2">
            {isDragActive
              ? 'Déposez les fichiers ici...'
              : 'Glissez-déposez vos fichiers ici'}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            ou <span className="text-[#5b50ff] font-medium">parcourez</span> pour sélectionner des fichiers
          </p>
          <div className="text-xs text-gray-500">
            <p>Maximum {maxFiles} fichiers</p>
            <p>Taille maximale par fichier: {formatFileSize(maxSize)}</p>
          </div>
        </div>
      </div>

      {rejectedFiles.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Fichiers non acceptés:
          </h4>
          <ul className="text-xs text-red-700 list-disc pl-5">
            {rejectedFiles.map((rejection, index) => (
              <li key={index}>
                {rejection.file.name} - {rejection.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileDropzone;

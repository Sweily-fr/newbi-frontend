import React from 'react';
import { FileUploadProgress } from '../types';
import { CloseCircle, TickCircle } from 'iconsax-react';

interface UploadProgressProps {
  progressItems: FileUploadProgress[];
  className?: string;
}

const UploadProgress: React.FC<UploadProgressProps> = ({
  progressItems,
  className = '',
}) => {
  if (progressItems.length === 0) return null;

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-medium mb-4">Progression de l'upload</h3>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {progressItems.map((item, index) => (
            <div
              key={index}
              className="p-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-medium truncate max-w-[70%]">
                  {item.fileName}
                </p>
                <div className="flex items-center">
                  {item.status === 'success' && (
                    <TickCircle size="18" color="#10B981" variant="Bulk" />
                  )}
                  {item.status === 'error' && (
                    <CloseCircle size="18" color="#EF4444" variant="Bulk" />
                  )}
                  <span className="text-xs ml-2">
                    {item.status === 'pending' && 'En attente...'}
                    {item.status === 'uploading' && `${Math.round(item.progress)}%`}
                    {item.status === 'success' && 'Terminé'}
                    {item.status === 'error' && 'Erreur'}
                  </span>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    item.status === 'error'
                      ? 'bg-red-500'
                      : item.status === 'success'
                      ? 'bg-green-500'
                      : 'bg-[#5b50ff]'
                  }`}
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>

              {item.error && (
                <p className="text-xs text-red-500 mt-1">{item.error}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadProgress;

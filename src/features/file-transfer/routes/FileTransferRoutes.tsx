import React from 'react';
import { useLocation } from 'react-router-dom';
import FileTransferPage from '../components/FileTransferPage';
import { FileTransferDownloadPage } from '../pages/FileTransferDownloadPage';

const FileTransferRoutes: React.FC = () => {
  const location = useLocation();
  const isDownloadPage = location.pathname.includes('/download');
  
  // Rendu conditionnel basé sur le chemin actuel
  return isDownloadPage ? <FileTransferDownloadPage /> : <FileTransferPage />;
};

export default FileTransferRoutes;

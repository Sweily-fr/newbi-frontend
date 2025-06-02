import React from 'react';
import { useLocation } from 'react-router-dom';
import FileTransferPage from '../components/FileTransferPage';
import FileDownloadPage from '../components/FileDownloadPage';

const FileTransferRoutes: React.FC = () => {
  const location = useLocation();
  const isDownloadPage = location.pathname.includes('/download');
  
  // Rendu conditionnel basé sur le chemin actuel
  return isDownloadPage ? <FileDownloadPage /> : <FileTransferPage />;
};

export default FileTransferRoutes;

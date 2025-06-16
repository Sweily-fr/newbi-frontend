import React from 'react';
import { Helmet } from 'react-helmet';
import FileTransferRoutes from '../features/file-transfer/routes/FileTransferRoutes';

const FileTransferPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Transfert de fichiers volumineux | Newbi</title>
        <meta 
          name="description" 
          content="Transférez des fichiers volumineux en toute sécurité jusqu'à 100Go sans limite de téléchargement avec Newbi." 
        />
      </Helmet>
      <FileTransferRoutes />
    </>
  );
};

export default FileTransferPage;

import React, { useState } from 'react';
import { ProductsTable, Product } from './ProductsTable';
import { ProductFormModal } from '../../forms/products/ProductFormModal';
import { useApolloClient, useMutation } from '@apollo/client';
import { DELETE_PRODUCT } from '../../../graphql/products';
import { ConfirmationModal } from '../../feedback/ConfirmationModal';
import { Notification } from '../../feedback/Notification';

export const ProductsManager: React.FC = () => {
  // États pour le formulaire d'ajout/modification
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // États pour la confirmation de suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  const client = useApolloClient();
  
  // Mutation pour supprimer un produit
  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };
  
  // Ouvrir la modal de confirmation de suppression
  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  // Fermer la modal de confirmation de suppression
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };
  
  // Confirmer la suppression du produit
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct({
        variables: { id: productToDelete.id }
      });
      
      // Rafraîchir les données après suppression
      client.refetchQueries({
        include: ['GetProducts'],
      });
      
      // Afficher une notification de succès
      Notification.success(`Le produit "${productToDelete.name}" a été supprimé avec succès`, {
        position: 'bottom-left'
      });
      
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      
      // Afficher une notification d'erreur
      Notification.error('Erreur lors de la suppression du produit');
    }
  };

  const handleSuccess = () => {
    // Rafraîchir les données après ajout/modification
    client.refetchQueries({
      include: ['GetProducts'],
    });
  };

  return (
    <div>
      <ProductsTable 
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />
      
      {isModalOpen && (
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          onSuccess={handleSuccess}
        />
      )}
      
      {isDeleteModalOpen && productToDelete && (
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Supprimer le produit"
          message={`Êtes-vous sûr de vouloir supprimer le produit "${productToDelete.name}" ? Cette action est irréversible.`}
          confirmButtonText="Supprimer"
          confirmButtonVariant="danger"
          isLoading={deleteLoading}
        />
      )}
    </div>
  );
};

import React, { useState, ChangeEvent } from 'react';
import { useKanbanBoards } from '../../hooks/useKanbanBoards';
import { Link } from 'react-router-dom';
import { Add, ArrowRight2, Calendar, Note1, User, Edit2, Trash } from 'iconsax-react';
import { Button, Modal, TextField, TextArea } from '../../../../components';
import { logger } from '../../../../utils/logger';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { KanbanBoard, KanbanUser } from '../../types/kanban';

export const KanbanBoardsList: React.FC = () => {
  // États pour les modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [editBoardTitle, setEditBoardTitle] = useState('');
  const [editBoardDescription, setEditBoardDescription] = useState('');
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Note: Nous n'utilisons pas l'utilisateur connecté pour l'instant, mais il sera nécessaire plus tard pour les permissions
  
  // Récupérer les tableaux Kanban
  const {
    boards,
    hasMore,
    boardsLoading,
    boardsError,
    createBoard,
    updateBoard,
    deleteBoard,
    loadMoreBoards,
    refetchBoards
  } = useKanbanBoards();
  
  // Gérer la création d'un nouveau tableau
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await createBoard({
        title: newBoardTitle,
        description: newBoardDescription.trim() ? newBoardDescription : undefined
      });
      setNewBoardTitle('');
      setNewBoardDescription('');
      setIsCreateModalOpen(false);
    } catch (error) {
      logger.error("Erreur lors de la création du tableau:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ouvrir la modal d'édition
  const openEditModal = (board: KanbanBoard) => {
    setSelectedBoardId(board.id);
    setEditBoardTitle(board.title);
    setEditBoardDescription(board.description || '');
    setIsEditModalOpen(true);
  };

  // Ouvrir la modal de suppression
  const openDeleteModal = (boardId: string) => {
    setSelectedBoardId(boardId);
    setIsDeleteModalOpen(true);
  };

  // Gérer la modification d'un tableau
  const handleUpdateBoard = async () => {
    if (!selectedBoardId || !editBoardTitle.trim()) return;
    
    setIsLoading(true);
    try {
      await updateBoard(selectedBoardId, {
        title: editBoardTitle,
        description: editBoardDescription.trim() ? editBoardDescription : undefined
      });
      setIsEditModalOpen(false);
      // Actualiser la liste des tableaux pour voir les modifications en temps réel
      await refetchBoards();
    } catch (error) {
      logger.error("Erreur lors de la modification du tableau:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gérer la suppression d'un tableau
  const handleDeleteBoard = async () => {
    if (!selectedBoardId) return;
    
    setIsLoading(true);
    try {
      await deleteBoard(selectedBoardId);
      setIsDeleteModalOpen(false);
      // Actualiser la liste des tableaux pour voir les suppressions en temps réel
      await refetchBoards();
    } catch (error) {
      logger.error("Erreur lors de la suppression du tableau:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Mes tableaux Kanban</h1>
          <p className="text-gray-600 mt-1">
            Gérez vos projets et tâches avec des tableaux Kanban intuitifs
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-xl"
        >
          <Add size="20" className="mr-2" color="#ffffff" />
          Nouveau tableau
        </Button>
      </div>
      
      {/* Liste des tableaux */}
      {boardsLoading && boards.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b50ff]"></div>
        </div>
      ) : boardsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Une erreur est survenue lors du chargement des tableaux.</p>
        </div>
      ) : boards.length === 0 ? (
        <div className="bg-[#f0eeff] border border-[#5b50ff]/20 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#e6e1ff] p-4 rounded-full">
              <Note1 size="32" variant="Bold" color="#5b50ff" />
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Aucun tableau Kanban</h2>
          <p className="text-gray-600 mb-6">
            Créez votre premier tableau pour commencer à organiser vos tâches et projets.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white rounded-xl"
          >
            <Add size="20" className="mr-2" color="#ffffff" />
            Créer un tableau
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board: KanbanBoard) => (
              <div 
                key={board.id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow group relative"
              >
                {/* Menu d'actions */}
                <div className="absolute top-4 right-4 flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openEditModal(board);
                    }}
                    className="p-1.5 rounded-full hover:bg-[#f0eeff] text-gray-500 hover:text-[#5b50ff] transition-colors"
                    title="Modifier"
                  >
                    <Edit2 size="16" color="currentColor" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openDeleteModal(board.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash size="16" color="currentColor" />
                  </button>
                </div>
                
                <Link
                  to={`/kanban/${board.id}`}
                  className="block">
                <h2 className="text-lg font-medium text-gray-800 mb-2 group-hover:text-[#5b50ff] transition-colors">
                  {board.title}
                </h2>
                
                {board.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{board.description}</p>
                )}
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size="16" variant="Linear" className="mr-1" color="#6b7280" />
                    <span>
                      {format(new Date(board.createdAt), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    {board.members.length > 0 && (
                      <div className="flex -space-x-2 mr-2">
                        {board.members.slice(0, 3).map((member: KanbanUser) => (
                          <div
                            key={member.id}
                            className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#f0eeff]"
                            title={member.email}
                          >
                            {/* Utiliser un avatar générique car le backend ne fournit pas d'avatar */}
                            <div className="w-full h-full flex items-center justify-center">
                              <User size="14" variant="Bold" color="#5b50ff" />
                            </div>
                          </div>
                        ))}
                        {board.members.length > 3 && (
                          <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                            +{board.members.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <ArrowRight2
                      size="18"
                      color="#5b50ff"
                      variant="Linear"
                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                    />
                  </div>
                </div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Bouton "Charger plus" */}
          {hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                variant="secondary"
                onClick={loadMoreBoards}
                disabled={boardsLoading}
                isLoading={boardsLoading}
              >
                Charger plus
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* Modal de création de tableau */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Créer un nouveau tableau Kanban"
      >
        <div className="p-4">
          <TextField
            id="board-title"
            name="board-title"
            label="Titre"
            value={newBoardTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewBoardTitle(e.target.value)}
            placeholder="Titre du tableau"
            required
            className="mb-4"
          />
          
          <TextArea
            id="board-description"
            name="board-description"
            label="Description (optionnelle)"
            value={newBoardDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewBoardDescription(e.target.value)}
            placeholder="Description du tableau"
            className="mb-6"
            rows={4}
          />
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateBoard}
              disabled={!newBoardTitle.trim() || isLoading}
              isLoading={isLoading}
              className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white"
            >
              Créer
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de modification de tableau */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modifier le tableau Kanban"
      >
        <div className="p-4">
          <TextField
            id="edit-board-title"
            name="edit-board-title"
            label="Titre"
            value={editBoardTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEditBoardTitle(e.target.value)}
            placeholder="Titre du tableau"
            required
            className="mb-4"
          />
          
          <TextArea
            id="edit-board-description"
            name="edit-board-description"
            label="Description (optionnelle)"
            value={editBoardDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setEditBoardDescription(e.target.value)}
            placeholder="Description du tableau"
            className="mb-6"
            rows={4}
          />
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdateBoard}
              disabled={!editBoardTitle.trim() || isLoading}
              isLoading={isLoading}
              className="bg-[#5b50ff] hover:bg-[#4a41e0] text-white"
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
      
      {/* Modal de confirmation de suppression */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Supprimer le tableau Kanban"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Êtes-vous sûr de vouloir supprimer ce tableau Kanban ?</p>
            <p className="text-red-600 text-sm">Cette action est irréversible et supprimera toutes les colonnes et tâches associées.</p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteBoard}
              isLoading={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

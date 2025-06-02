import React from 'react';
import { useParams } from 'react-router-dom';
import { KanbanBoardsList } from '../features/kanban/components/business/KanbanBoardsList';
import { KanbanBoard } from '../features/kanban/components/business/KanbanBoard';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/specific/SEO/SEOHead';

const KanbanPage: React.FC = () => {
  // Récupérer l'ID du tableau depuis l'URL
  const { boardId } = useParams<{ boardId?: string }>();
  
  // Récupérer l'utilisateur connecté (la route protégée garantit déjà que l'utilisateur est connecté)
  const { user } = useAuth();
  
  // Vérifier si l'utilisateur est abonné premium
  const isPremiumUser = user?.subscription?.status === 'active';
  
  // Convertir l'utilisateur au format attendu par les composants Kanban
  const kanbanUser = user ? {
    _id: user._id,
    name: user.name || user.email.split('@')[0],
    email: user.email,
    avatar: user.avatar || undefined
  } : {
    _id: 'guest',
    name: 'Invité',
    email: '',
    avatar: undefined
  };
  
  // Liste des utilisateurs disponibles (pour l'instant, juste l'utilisateur connecté)
  const availableUsers = [kanbanUser];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={boardId ? "Tableau Kanban | Newbi" : "Gestion des tâches Kanban | Newbi"}
        description="Gérez vos tâches et vos projets avec un tableau Kanban intuitif et efficace"
        keywords="kanban, gestion de tâches, productivité, organisation, projets"
        schemaType="WebApplication"
        canonicalUrl={boardId ? `https://www.newbi.fr/kanban/${boardId}` : "https://www.newbi.fr/kanban"}
        additionalSchemaData={{
          'applicationCategory': 'ProductivityApplication',
          'operatingSystem': 'Web'
        }}
        isPremium={isPremiumUser}
      />
      
      <div className="container mx-auto px-4 py-6">
        {boardId ? (
          // Afficher un tableau spécifique
          <KanbanBoard
            boardId={boardId}
            currentUser={kanbanUser}
            availableUsers={availableUsers}
          />
        ) : (
          // Afficher la liste des tableaux
          <KanbanBoardsList />
        )}
      </div>
    </div>
  );
};

export default KanbanPage;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { isTokenExpired } from '../../../utils/auth';
import { Notification } from '../../../components/feedback';

/**
 * Composant qui surveille l'expiration de la session et affiche une notification
 * lorsque l'utilisateur est déconnecté automatiquement
 */
export const SessionExpiredNotification = () => {
  const { isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Vérifier si l'utilisateur vient d être déconnecté à cause d'un token expiré
    const wasAuthenticated = localStorage.getItem('was_authenticated') === 'true';
    
    if (wasAuthenticated && !isAuthenticated && (!token || isTokenExpired(token))) {
      // Afficher une notification
      Notification.error('Vous avez été déconnecté.', {
        duration: 5000,
        position: 'bottom-left',
        onClose: () => {
          // Rediriger vers la page de connexion après la notification
          navigate('/login');
        }
      });
      
      // Réinitialiser l'indicateur
      localStorage.removeItem('was_authenticated');
    }
    
    // Si l'utilisateur est authentifié, mettre à jour l'indicateur
    if (isAuthenticated) {
      localStorage.setItem('was_authenticated', 'true');
    }
  }, [isAuthenticated, token, navigate]);
  
  // Ce composant ne rend rien visuellement
  return null;
};

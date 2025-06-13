import React, { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired, decodeToken } from '../utils/auth';
import { activityTracker } from '../utils/activityTracker';
import { AuthContextType, User } from '../types/auth';

// Interface déplacée vers types/auth.ts

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token && !isTokenExpired(token));
  const [user, setUser] = useState<User | null>(null);

  // Fonction de déconnexion définie avant les useEffect pour pouvoir être utilisée dans ceux-ci
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
      
      // Extraire les informations de l'utilisateur du token
      try {
        const userData = decodeToken(storedToken);
        if (userData && userData.userId) {
          // Récupérer les données utilisateur depuis l'API
          fetch(`/api/users/${userData.userId}`, {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          })
          .then(res => res.json())
          .then(data => {
            if (data && data.user) {
              setUser(data.user);
            }
          })
          .catch(err => {
            console.error('Erreur lors de la récupération des données utilisateur:', err);
          });
        }
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    } else if (storedToken) {
      // Si le token est expiré, déconnecter l'utilisateur
      logout();
    }
  }, []);

  // Vérifier périodiquement si le token est expiré (toutes les minutes)
  useEffect(() => {
    const checkTokenExpiration = () => {
      const currentToken = localStorage.getItem('token');
      if (currentToken && isTokenExpired(currentToken)) {
        logout();
      }
    };

    // Vérifier immédiatement
    checkTokenExpiration();

    // Puis vérifier toutes les minutes
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Initialiser le tracker d'activité pour gérer la déconnexion après inactivité
  useEffect(() => {
    if (isAuthenticated) {
      // Initialiser le tracker d'activité seulement si l'utilisateur est authentifié
      activityTracker.init(logout);
    }
    
    return () => {
      // Nettoyer le tracker lors du démontage du composant
      activityTracker.cleanup();
    };
  }, [isAuthenticated]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    
    // Extraire les informations de l'utilisateur du token
    try {
      const userData = decodeToken(newToken);
      if (userData && userData.userId) {
        // Récupérer les données utilisateur depuis l'API
        fetch(`/api/users/${userData.userId}`, {
          headers: {
            'Authorization': `Bearer ${newToken}`
          }
        })
        .then(res => res.json())
        .then(data => {
          if (data && data.user) {
            setUser(data.user);
          }
        })
        .catch(err => {
          console.error('Erreur lors de la récupération des données utilisateur:', err);
        });
      }
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
    }
    
    // Réinitialiser le tracker d'activité lors de la connexion
    activityTracker.init(logout);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

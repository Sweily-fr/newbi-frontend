import { createContext, useContext, useState, useEffect } from 'react';
import { isTokenExpired } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token && !isTokenExpired(token));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
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
        console.log('Token expiré, déconnexion automatique');
        logout();
      }
    };

    // Vérifier immédiatement
    checkTokenExpiration();

    // Puis vérifier toutes les minutes
    const interval = setInterval(checkTokenExpiration, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

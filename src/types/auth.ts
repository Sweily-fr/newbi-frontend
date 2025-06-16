export interface User {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  subscription?: {
    status: 'active' | 'inactive' | 'canceled' | 'pending';
    plan?: string;
    expiresAt?: string;
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

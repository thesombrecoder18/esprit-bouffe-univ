import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { mockUsers } from '@/data/mockData';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'tickets'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est connecté au démarrage
    const savedUser = localStorage.getItem('espeat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une requête de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('espeat_user', JSON.stringify(foundUser));
      toast({
        title: "Connexion réussie",
        description: `Bienvenue ${foundUser.prenom} !`,
      });
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'tickets'> & { password: string }): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulation d'une requête d'inscription
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      toast({
        title: "Erreur d'inscription",
        description: "Un compte avec cet email existe déjà",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      nom: userData.nom,
      prenom: userData.prenom,
      email: userData.email,
      role: userData.role,
      numeroEtudiant: userData.numeroEtudiant,
      tickets: userData.role === 'etudiant' ? { ndekki: 0, repas: 0 } : undefined,
    };

    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('espeat_user', JSON.stringify(newUser));
    
    toast({
      title: "Inscription réussie",
      description: "Votre compte a été créé avec succès !",
    });
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('espeat_user');
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('espeat_user', JSON.stringify(updatedUser));
      
      // Mettre à jour aussi dans les données simulées
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
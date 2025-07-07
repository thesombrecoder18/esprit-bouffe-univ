import { User, Restaurant, Menu, MenuProposition, Statistiques, TicketShare } from '@/types';

export const mockUsers: User[] = [
  {
    id: 'etudiant1',
    nom: 'Diop',
    prenom: 'Aminata',
    email: 'aminata.diop@esp.sn',
    role: 'etudiant',
    numeroEtudiant: 'ESP2023001',
    tickets: { ndekki: 5, repas: 3 }
  },
  {
    id: 'etudiant2',
    nom: 'Fall',
    prenom: 'Moussa',
    email: 'moussa.fall@esp.sn',
    role: 'etudiant',
    numeroEtudiant: 'ESP2023002',
    tickets: { ndekki: 2, repas: 8 }
  },
  {
    id: 'agent1',
    nom: 'Ndiaye',
    prenom: 'Fatou',
    email: 'fatou.ndiaye@esp.sn',
    role: 'agent'
  },
  {
    id: 'gerant1',
    nom: 'Sarr',
    prenom: 'Ibrahima',
    email: 'ibrahima.sarr@esp.sn',
    role: 'gerant'
  },
  {
    id: 'restaurateur1',
    nom: 'Ba',
    prenom: 'Awa',
    email: 'awa.ba@esp.sn',
    role: 'restaurateur'
  }
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'resto1',
    nom: 'Restaurant ESP',
    localisation: 'UCAD - École Supérieure Polytechnique',
    horaires: {
      matin: '06h-10h',
      midi: '12h-14h',
      soir: '19h-21h'
    }
  },
  {
    id: 'resto2',
    nom: 'Restaurant ENSEPT',
    localisation: 'UCAD - École Normale Supérieure',
    horaires: {
      matin: '06h-10h',
      midi: '12h-14h',
      soir: '19h-21h'
    }
  }
];

export const mockMenus: Menu[] = [
  {
    id: 'menu1',
    date: '2025-01-15',
    plats: {
      ndekki: ['Pain + Lait + Stick de café + Beurre/Mayonnaise + Fromage/Chocolat'],
      repas: ['Thiéboudienne', 'Yassa Poulet', 'Mafé Bœuf']
    },
    restaurantId: 'resto1'
  },
  {
    id: 'menu2',
    date: '2025-01-15',
    plats: {
      ndekki: ['Pain + Lait + Stick de café + Beurre/Mayonnaise + Fromage/Chocolat'],
      repas: ['Soupou Kanja', 'Domoda', 'Caldou Poisson']
    },
    restaurantId: 'resto2'
  }
];

export const mockMenuPropositions: MenuProposition[] = [
  {
    id: 'prop1',
    etudiantId: 'etudiant1',
    etudiantNom: 'Aminata Diop',
    proposition: 'Ajouter du Ngalax comme dessert',
    date: '2025-01-15T10:30:00.000Z',
    restaurantId: 'resto1'
  },
  {
    id: 'prop2',
    etudiantId: 'etudiant2',
    etudiantNom: 'Moussa Fall',
    proposition: 'Proposer du Thiéré au poisson le vendredi',
    date: '2025-01-14T14:45:00.000Z',
    restaurantId: 'resto1'
  }
];

export const mockStatistiques: Statistiques = {
  recetteJournaliere: 125000,
  recetteMensuelle: 2750000,
  recetteAnnuelle: 35000000,
  ticketsVendus: {
    ndekki: 1250,
    repas: 875
  },
  platsVendus: {
    ndekki: 1180,
    repas: 820
  }
};

export let mockTicketShares: TicketShare[] = [
  {
    id: 'share1',
    destinataire: 'Moussa Fall',
    numeroEtudiant: 'ESP2023002',
    nombreNdekki: 2,
    nombreRepas: 1,
    date: '2025-01-15T12:30:00.000Z'
  }
];

// Fonctions utilitaires pour manipuler les données simulées
export const addTicketShare = (share: Omit<TicketShare, 'id'>) => {
  const newShare: TicketShare = {
    ...share,
    id: `share_${Date.now()}`
  };
  mockTicketShares.push(newShare);
  return newShare;
};

export const updateUserTickets = (userId: string, tickets: { ndekki: number; repas: number }) => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1 && mockUsers[userIndex].tickets) {
    mockUsers[userIndex].tickets = tickets;
  }
};

export const addMenuProposition = (proposition: Omit<MenuProposition, 'id'>) => {
  const newProposition: MenuProposition = {
    ...proposition,
    id: `prop_${Date.now()}`
  };
  mockMenuPropositions.push(newProposition);
  return newProposition;
};

export const addUser = (user: Omit<User, 'id'>) => {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}`
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = (userId: string, updates: Partial<User>) => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  }
  return null;
};

export const deleteUser = (userId: string) => {
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    const deletedUser = mockUsers[userIndex];
    mockUsers.splice(userIndex, 1);
    return deletedUser;
  }
  return null;
};
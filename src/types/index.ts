export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'etudiant' | 'agent' | 'gerant' | 'restaurateur';
  tickets?: UserTickets;
  numeroEtudiant?: string;
}

export interface UserTickets {
  ndekki: number;
  repas: number;
}

export interface TicketShare {
  id: string;
  destinataire: string;
  nombreNdekki: number;
  nombreRepas: number;
  date: string;
}

export interface Restaurant {
  id: string;
  nom: string;
  localisation: string;
  horaires: {
    matin: string;
    midi: string;
    soir: string;
  };
}

export interface Menu {
  id: string;
  date: string;
  plats: {
    ndekki: string[];
    repas: string[];
  };
  restaurantId: string;
}

export interface MenuProposition {
  id: string;
  etudiantId: string;
  etudiantNom: string;
  proposition: string;
  date: string;
  restaurantId: string;
}

export interface Statistiques {
  recetteJournaliere: number;
  recetteMensuelle: number;
  recetteAnnuelle: number;
  ticketsVendus: {
    ndekki: number;
    repas: number;
  };
  platsVendus: {
    ndekki: number;
    repas: number;
  };
}

export interface QRCodeScan {
  etudiantId: string;
  etudiantNom: string;
  typeTicket: 'ndekki' | 'repas';
  nombre: number;
}
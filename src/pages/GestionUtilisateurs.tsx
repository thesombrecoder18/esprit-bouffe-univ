import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Users, UserPlus, Search, Filter, MoreVertical, Edit, Trash2, Mail } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { mockUsers, addUser, updateUser as updateUserData, deleteUser } from '@/data/mockData';
import { User } from '@/types';

const GestionUtilisateurs = () => {
  const { user } = useAuth();
  const [utilisateurs, setUtilisateurs] = useState(mockUsers);
  const [filtreRole, setFiltreRole] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [utilisateurSelectionne, setUtilisateurSelectionne] = useState<User | null>(null);
  const [isModifying, setIsModifying] = useState(false);
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '' as User['role'] | '',
    numeroEtudiant: ''
  });

  const getRoleDisplayName = (role: string) => {
    const roleNames = {
      etudiant: 'Étudiant',
      agent: 'Agent',
      gerant: 'Gérant',
      restaurateur: 'Restaurateur'
    };
    return roleNames[role as keyof typeof roleNames] || role;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'etudiant': return 'default';
      case 'agent': return 'secondary';
      case 'gerant': return 'destructive';
      case 'restaurateur': return 'outline';
      default: return 'default';
    }
  };

  const utilisateursFiltres = utilisateurs.filter(u => {
    const matchRole = filtreRole === 'tous' || u.role === filtreRole;
    const matchRecherche = recherche === '' || 
      u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.email.toLowerCase().includes(recherche.toLowerCase()) ||
      (u.numeroEtudiant && u.numeroEtudiant.toLowerCase().includes(recherche.toLowerCase()));
    
    return matchRole && matchRecherche;
  });

  const statistiques = {
    total: utilisateurs.length,
    etudiants: utilisateurs.filter(u => u.role === 'etudiant').length,
    agents: utilisateurs.filter(u => u.role === 'agent').length,
    gerants: utilisateurs.filter(u => u.role === 'gerant').length,
    restaurateurs: utilisateurs.filter(u => u.role === 'restaurateur').length,
  };

  const resetForm = () => {
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      role: '',
      numeroEtudiant: ''
    });
    setUtilisateurSelectionne(null);
    setIsModifying(false);
  };

  const handleSupprimerUtilisateur = (userId: string) => {
    const deletedUser = deleteUser(userId);
    if (deletedUser) {
      setUtilisateurs(mockUsers);
      toast({
        title: "Utilisateur supprimé",
        description: `${deletedUser.prenom} ${deletedUser.nom} a été supprimé avec succès.`,
      });
    }
  };

  const handleModifierUtilisateur = (utilisateur: User) => {
    setUtilisateurSelectionne(utilisateur);
    setFormData({
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      role: utilisateur.role,
      numeroEtudiant: utilisateur.numeroEtudiant || ''
    });
    setIsModifying(true);
    setIsDialogOpen(true);
  };

  const handleAjouterUtilisateur = () => {
    setIsModifying(false);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSauvegarderUtilisateur = () => {
    if (!formData.prenom || !formData.nom || !formData.email || !formData.role) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si l'email existe déjà (sauf pour modification)
    const emailExists = mockUsers.some(u => 
      u.email === formData.email && 
      (!isModifying || u.id !== utilisateurSelectionne?.id)
    );
    
    if (emailExists) {
      toast({
        title: "Erreur",
        description: "Cette adresse email est déjà utilisée.",
        variant: "destructive"
      });
      return;
    }

    if (isModifying && utilisateurSelectionne) {
      // Modification
      const updatedUser = updateUserData(utilisateurSelectionne.id, {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role as User['role'],
        numeroEtudiant: formData.role === 'etudiant' ? formData.numeroEtudiant : undefined,
        tickets: formData.role === 'etudiant' ? { ndekki: 0, repas: 0 } : undefined
      });

      if (updatedUser) {
        setUtilisateurs([...mockUsers]);
        toast({
          title: "Utilisateur modifié",
          description: `${updatedUser.prenom} ${updatedUser.nom} a été modifié avec succès.`,
        });
      }
    } else {
      // Ajout
      const newUser = addUser({
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        role: formData.role as User['role'],
        numeroEtudiant: formData.role === 'etudiant' ? formData.numeroEtudiant || `ESP${new Date().getFullYear()}${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}` : undefined,
        tickets: formData.role === 'etudiant' ? { ndekki: 0, repas: 0 } : undefined
      });

      setUtilisateurs([...mockUsers]);
      toast({
        title: "Utilisateur créé",
        description: `${newUser.prenom} ${newUser.nom} a été ajouté avec succès.`,
      });
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEnvoyerEmail = (email: string, nom: string) => {
    // Simulation d'envoi d'email
    toast({
      title: "Email envoyé",
      description: `Un email a été envoyé à ${nom} (${email}).`,
    });
  };

  if (user?.role !== 'gerant') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux gérants.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des utilisateurs</h1>
            <p className="text-muted-foreground">
              Gérez tous les utilisateurs de la plateforme
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAjouterUtilisateur}>
              <UserPlus className="h-4 w-4 mr-2" />
              Nouvel utilisateur
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isModifying ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </DialogTitle>
              <DialogDescription>
                {isModifying 
                  ? 'Modifiez les informations de l\'utilisateur.'
                  : 'Ajoutez un nouvel utilisateur à la plateforme ESP\'eat.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom *</Label>
                  <Input 
                    id="prenom" 
                    placeholder="Prénom" 
                    value={formData.prenom}
                    onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom *</Label>
                  <Input 
                    id="nom" 
                    placeholder="Nom" 
                    value={formData.nom}
                    onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="email@esp.sn" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as User['role'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="etudiant">Étudiant</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="restaurateur">Restaurateur</SelectItem>
                    <SelectItem value="gerant">Gérant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.role === 'etudiant' && (
                <div className="space-y-2">
                  <Label htmlFor="numeroEtudiant">Numéro étudiant</Label>
                  <Input 
                    id="numeroEtudiant" 
                    placeholder="ESP2025001 (optionnel, généré automatiquement)" 
                    value={formData.numeroEtudiant}
                    onChange={(e) => setFormData(prev => ({ ...prev, numeroEtudiant: e.target.value }))}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSauvegarderUtilisateur}>
                {isModifying ? 'Modifier' : 'Créer'} l'utilisateur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.total}</div>
            <p className="text-xs text-muted-foreground">Total utilisateurs</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.etudiants}</div>
            <p className="text-xs text-muted-foreground">Étudiants</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-secondary">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.agents}</div>
            <p className="text-xs text-muted-foreground">Agents</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.restaurateurs}</div>
            <p className="text-xs text-muted-foreground">Restaurateurs</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.gerants}</div>
            <p className="text-xs text-muted-foreground">Gérants</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="recherche">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="recherche"
                  placeholder="Nom, prénom, email ou numéro étudiant..."
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filtre-role">Filtrer par rôle</Label>
              <Select value={filtreRole} onValueChange={setFiltreRole}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les rôles</SelectItem>
                  <SelectItem value="etudiant">Étudiants</SelectItem>
                  <SelectItem value="agent">Agents</SelectItem>
                  <SelectItem value="gerant">Gérants</SelectItem>
                  <SelectItem value="restaurateur">Restaurateurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({utilisateursFiltres.length})</CardTitle>
          <CardDescription>
            Liste de tous les utilisateurs correspondant aux critères
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {utilisateursFiltres.map((utilisateur) => (
              <Card key={utilisateur.id} className="border-l-4 border-l-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                        {utilisateur.prenom.charAt(0)}{utilisateur.nom.charAt(0)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">
                            {utilisateur.prenom} {utilisateur.nom}
                          </h3>
                          <Badge variant={getRoleBadgeVariant(utilisateur.role)}>
                            {getRoleDisplayName(utilisateur.role)}
                          </Badge>
                          {utilisateur.numeroEtudiant && (
                            <Badge variant="outline" className="text-xs">
                              {utilisateur.numeroEtudiant}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{utilisateur.email}</p>
                        {utilisateur.tickets && (
                          <div className="flex items-center gap-2 text-xs">
                            <Badge variant="secondary">
                              {utilisateur.tickets.ndekki} Ndekki
                            </Badge>
                            <Badge variant="outline">
                              {utilisateur.tickets.repas} Repas
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleModifierUtilisateur(utilisateur)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEnvoyerEmail(utilisateur.email, `${utilisateur.prenom} ${utilisateur.nom}`)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Envoyer un email
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleSupprimerUtilisateur(utilisateur.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {utilisateursFiltres.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucun utilisateur trouvé avec ces critères
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionUtilisateurs;
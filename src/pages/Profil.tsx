import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { User, Mail, Hash, Eye, EyeOff } from 'lucide-react';

const Profil = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
    numeroEtudiant: user?.numeroEtudiant || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const getInitials = (nom: string, prenom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSaveProfile = () => {
    if (user) {
      updateUser({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        numeroEtudiant: formData.numeroEtudiant || undefined
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
      
      setIsEditing(false);
    }
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    // Simulation du changement de mot de passe
    toast({
      title: "Mot de passe modifié",
      description: "Votre mot de passe a été changé avec succès.",
    });

    setFormData(prev => ({
      ...prev,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-lg">
            {getInitials(user.nom, user.prenom)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{user.prenom} {user.nom}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleDisplayName(user.role)}
            </Badge>
            {user.numeroEtudiant && (
              <Badge variant="outline">{user.numeroEtudiant}</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Informations personnelles */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Gérez vos informations de profil
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setFormData({
                    nom: user?.nom || '',
                    prenom: user?.prenom || '',
                    email: user?.email || '',
                    numeroEtudiant: user?.numeroEtudiant || '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="pl-10"
                />
              </div>
            </div>

            {user.role === 'etudiant' && (
              <div className="space-y-2">
                <Label htmlFor="numeroEtudiant">Numéro étudiant</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="numeroEtudiant"
                    name="numeroEtudiant"
                    value={formData.numeroEtudiant}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Ex: ESP2023001"
                  />
                </div>
              </div>
            )}

            {isEditing && (
              <Button onClick={handleSaveProfile} className="w-full">
                Sauvegarder les modifications
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Changer le mot de passe */}
        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>
              Changez votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  value={formData.oldPassword}
                  onChange={handleInputChange}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>

            <Button 
              onClick={handleChangePassword} 
              className="w-full"
              disabled={!formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
            >
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informations du compte */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du compte</CardTitle>
          <CardDescription>
            Détails de votre compte ESP'eat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-muted-foreground">Rôle</Label>
              <p className="font-medium">{getRoleDisplayName(user.role)}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium">{user.email}</p>
            </div>
            {user.tickets && (
              <>
                <div>
                  <Label className="text-sm text-muted-foreground">Tickets Ndekki</Label>
                  <p className="font-medium text-primary">{user.tickets.ndekki}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tickets Repas</Label>
                  <p className="font-medium text-accent">{user.tickets.repas}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profil;
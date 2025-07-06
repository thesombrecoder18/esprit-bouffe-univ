import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { mockUsers, addTicketShare, updateUserTickets } from '@/data/mockData';
import { Share2, Plus, Minus, UtensilsCrossed, Search, UserCheck } from 'lucide-react';

const PartagerTickets = () => {
  const { user, updateUser } = useAuth();
  const [destinataire, setDestinataire] = useState('');
  const [nombreNdekki, setNombreNdekki] = useState(0);
  const [nombreRepas, setNombreRepas] = useState(0);
  const [rechercheDestinataire, setRechercheDestinataire] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Filtrer les étudiants disponibles (excluant l'utilisateur actuel)
  const etudiantsDisponibles = mockUsers
    .filter(u => u.role === 'etudiant' && u.id !== user?.id)
    .filter(u => 
      rechercheDestinataire === '' || 
      `${u.prenom} ${u.nom}`.toLowerCase().includes(rechercheDestinataire.toLowerCase()) ||
      u.email.toLowerCase().includes(rechercheDestinataire.toLowerCase())
    );

  const totalTicketsAPartager = nombreNdekki + nombreRepas;
  const ticketsDisponibles = (user?.tickets?.ndekki || 0) + (user?.tickets?.repas || 0);

  const handlePartage = async () => {
    if (!destinataire) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un destinataire",
        variant: "destructive"
      });
      return;
    }

    if (totalTicketsAPartager === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins un ticket à partager",
        variant: "destructive"
      });
      return;
    }

    if (nombreNdekki > (user?.tickets?.ndekki || 0)) {
      toast({
        title: "Erreur",
        description: "Vous n'avez pas assez de tickets Ndekki",
        variant: "destructive"
      });
      return;
    }

    if (nombreRepas > (user?.tickets?.repas || 0)) {
      toast({
        title: "Erreur",
        description: "Vous n'avez pas assez de tickets Repas",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulation du processus de partage
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Trouver le destinataire
      const destinataireUser = mockUsers.find(u => u.id === destinataire);
      if (!destinataireUser) {
        throw new Error("Destinataire non trouvé");
      }

      // Mettre à jour les tickets de l'utilisateur actuel
      const nouveauxTicketsUtilisateur = {
        ndekki: (user?.tickets?.ndekki || 0) - nombreNdekki,
        repas: (user?.tickets?.repas || 0) - nombreRepas
      };

      // Mettre à jour les tickets du destinataire
      const nouveauxTicketsDestinataire = {
        ndekki: (destinataireUser.tickets?.ndekki || 0) + nombreNdekki,
        repas: (destinataireUser.tickets?.repas || 0) + nombreRepas
      };

      // Enregistrer le partage
      addTicketShare({
        destinataire: `${destinataireUser.prenom} ${destinataireUser.nom}`,
        nombreNdekki,
        nombreRepas,
        date: new Date().toISOString()
      });

      // Mettre à jour les données
      updateUser({ tickets: nouveauxTicketsUtilisateur });
      updateUserTickets(user?.id || '', nouveauxTicketsUtilisateur);
      updateUserTickets(destinataire, nouveauxTicketsDestinataire);

      toast({
        title: "Partage réussi !",
        description: `Vous avez partagé ${nombreNdekki} ticket(s) Ndekki et ${nombreRepas} ticket(s) Repas avec ${destinataireUser.prenom} ${destinataireUser.nom}`,
      });

      // Réinitialiser le formulaire
      setDestinataire('');
      setNombreNdekki(0);
      setNombreRepas(0);
      setRechercheDestinataire('');

    } catch (error) {
      toast({
        title: "Erreur de partage",
        description: "Une erreur s'est produite lors du partage. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Partager des tickets
        </h1>
        <p className="text-muted-foreground">
          Partagez vos tickets avec d'autres étudiants
        </p>
      </div>

      {/* Solde actuel */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Vos tickets disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user?.tickets?.ndekki || 0}</div>
              <p className="text-sm text-muted-foreground">Tickets Ndekki</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{user?.tickets?.repas || 0}</div>
              <p className="text-sm text-muted-foreground">Tickets Repas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection du destinataire */}
      <Card>
        <CardHeader>
          <CardTitle>Choisir le destinataire</CardTitle>
          <CardDescription>
            Sélectionnez l'étudiant avec qui partager vos tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recherche">Rechercher un étudiant</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="recherche"
                placeholder="Nom, prénom ou email..."
                value={rechercheDestinataire}
                onChange={(e) => setRechercheDestinataire(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {rechercheDestinataire && (
            <div className="max-h-60 overflow-y-auto space-y-2">
              {etudiantsDisponibles.length > 0 ? (
                etudiantsDisponibles.map((etudiant) => (
                  <div
                    key={etudiant.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      destinataire === etudiant.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-muted-foreground/50'
                    }`}
                    onClick={() => setDestinataire(etudiant.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{etudiant.prenom} {etudiant.nom}</p>
                        <p className="text-sm text-muted-foreground">{etudiant.email}</p>
                        <p className="text-xs text-muted-foreground">{etudiant.numeroEtudiant}</p>
                      </div>
                      {destinataire === etudiant.id && (
                        <UserCheck className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Aucun étudiant trouvé
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sélection des tickets à partager */}
      {destinataire && (
        <Card>
          <CardHeader>
            <CardTitle>Tickets à partager</CardTitle>
            <CardDescription>
              Choisissez le nombre de tickets à partager
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tickets Ndekki */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tickets Ndekki</h3>
                  <p className="text-sm text-muted-foreground">
                    Disponibles: {user?.tickets?.ndekki || 0}
                  </p>
                </div>
                <Badge variant="outline" className="text-primary border-primary/50">
                  50F CFA
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreNdekki(Math.max(0, nombreNdekki - 1))}
                  disabled={nombreNdekki <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-20 text-center">
                  <Input
                    type="number"
                    value={nombreNdekki}
                    onChange={(e) => setNombreNdekki(Math.max(0, Math.min(user?.tickets?.ndekki || 0, parseInt(e.target.value) || 0)))}
                    className="text-center"
                    min="0"
                    max={user?.tickets?.ndekki || 0}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreNdekki(Math.min(user?.tickets?.ndekki || 0, nombreNdekki + 1))}
                  disabled={nombreNdekki >= (user?.tickets?.ndekki || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tickets Repas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tickets Repas</h3>
                  <p className="text-sm text-muted-foreground">
                    Disponibles: {user?.tickets?.repas || 0}
                  </p>
                </div>
                <Badge variant="outline" className="text-accent border-accent/50">
                  100F CFA
                </Badge>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreRepas(Math.max(0, nombreRepas - 1))}
                  disabled={nombreRepas <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="w-20 text-center">
                  <Input
                    type="number"
                    value={nombreRepas}
                    onChange={(e) => setNombreRepas(Math.max(0, Math.min(user?.tickets?.repas || 0, parseInt(e.target.value) || 0)))}
                    className="text-center"
                    min="0"
                    max={user?.tickets?.repas || 0}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreRepas(Math.min(user?.tickets?.repas || 0, nombreRepas + 1))}
                  disabled={nombreRepas >= (user?.tickets?.repas || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirmation du partage */}
      {destinataire && totalTicketsAPartager > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmer le partage</CardTitle>
            <CardDescription>
              Vérifiez les détails avant de confirmer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between">
                <span>Destinataire:</span>
                <span className="font-medium">
                  {mockUsers.find(u => u.id === destinataire)?.prenom} {mockUsers.find(u => u.id === destinataire)?.nom}
                </span>
              </div>
              {nombreNdekki > 0 && (
                <div className="flex justify-between">
                  <span>Tickets Ndekki:</span>
                  <span className="font-medium text-primary">{nombreNdekki}</span>
                </div>
              )}
              {nombreRepas > 0 && (
                <div className="flex justify-between">
                  <span>Tickets Repas:</span>
                  <span className="font-medium text-accent">{nombreRepas}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total à partager:</span>
                <span>{totalTicketsAPartager} ticket(s)</span>
              </div>
            </div>

            <Button
              onClick={handlePartage}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Partage en cours...
                </>
              ) : (
                <>
                  <Share2 className="mr-2 h-4 w-4" />
                  Confirmer le partage
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartagerTickets;
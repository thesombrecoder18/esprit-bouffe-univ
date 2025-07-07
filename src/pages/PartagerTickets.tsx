import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { mockUsers, addTicketShare, updateUserTickets, mockTicketShares } from '@/data/mockData';
import { Share2, Plus, Minus, UtensilsCrossed, History } from 'lucide-react';

const PartagerTickets = () => {
  const { user, updateUser } = useAuth();
  const [destinataire, setDestinataire] = useState('');
  const [numeroEtudiant, setNumeroEtudiant] = useState('');
  const [nombreNdekki, setNombreNdekki] = useState(0);
  const [nombreRepas, setNombreRepas] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const totalTicketsAPartager = nombreNdekki + nombreRepas;

  const handlePartage = async () => {
    if (!destinataire.trim() || !numeroEtudiant.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le nom et le numéro de carte étudiant",
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

      // Mettre à jour les tickets de l'utilisateur actuel
      const nouveauxTicketsUtilisateur = {
        ndekki: (user?.tickets?.ndekki || 0) - nombreNdekki,
        repas: (user?.tickets?.repas || 0) - nombreRepas
      };

      // Enregistrer le partage
      addTicketShare({
        destinataire: destinataire.trim(),
        numeroEtudiant: numeroEtudiant.trim(),
        nombreNdekki,
        nombreRepas,
        date: new Date().toISOString()
      });

      // Mettre à jour les données
      updateUser({ tickets: nouveauxTicketsUtilisateur });

      toast({
        title: "Partage réussi !",
        description: `Vous avez partagé ${nombreNdekki} ticket(s) Ndekki et ${nombreRepas} ticket(s) Repas avec ${destinataire}`,
      });

      // Réinitialiser le formulaire
      setDestinataire('');
      setNumeroEtudiant('');
      setNombreNdekki(0);
      setNombreRepas(0);

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

      {/* Informations du destinataire */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du destinataire</CardTitle>
          <CardDescription>
            Entrez les informations de l'étudiant qui recevra les tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="numeroEtudiant">Numéro de carte étudiant</Label>
            <Input
              id="numeroEtudiant"
              placeholder="Ex: ESP2023045"
              value={numeroEtudiant}
              onChange={(e) => setNumeroEtudiant(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="destinataire">Nom complet du destinataire</Label>
            <Input
              id="destinataire"
              placeholder="Prénom et nom de l'étudiant"
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Sélection des tickets à partager */}
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

      {/* Confirmation du partage */}
      {totalTicketsAPartager > 0 && destinataire.trim() && numeroEtudiant.trim() && (
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
                <span className="font-medium">{destinataire}</span>
              </div>
              <div className="flex justify-between">
                <span>Numéro étudiant:</span>
                <span className="font-medium">{numeroEtudiant}</span>
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

      {/* Historique des partages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des partages
          </CardTitle>
          <CardDescription>
            Vos derniers partages de tickets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockTicketShares.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Aucun partage effectué
              </p>
            </div>
          ) : (
            mockTicketShares.map((share) => (
              <Card key={share.id} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium">{share.destinataire}</p>
                      <p className="text-sm text-muted-foreground">
                        Carte: {share.numeroEtudiant}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(share.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {share.nombreNdekki > 0 && (
                      <Badge variant="outline" className="text-primary border-primary/50">
                        {share.nombreNdekki} Ndekki
                      </Badge>
                    )}
                    {share.nombreRepas > 0 && (
                      <Badge variant="outline" className="text-accent border-accent/50">
                        {share.nombreRepas} Repas
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PartagerTickets;
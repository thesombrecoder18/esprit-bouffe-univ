import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Smartphone, Plus, Minus, UtensilsCrossed } from 'lucide-react';
import { updateUserTickets } from '@/data/mockData';

const AcheterTickets = () => {
  const { user, updateUser } = useAuth();
  const [nombreNdekki, setNombreNdekki] = useState(1);
  const [nombreRepas, setNombreRepas] = useState(1);
  const [moyenPaiement, setMoyenPaiement] = useState<'wave' | 'orange_money' | ''>('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const prixNdekki = 50;
  const prixRepas = 100;
  const totalNdekki = nombreNdekki * prixNdekki;
  const totalRepas = nombreRepas * prixRepas;
  const totalGeneral = totalNdekki + totalRepas;

  const handleAchat = async () => {
    if (!moyenPaiement) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un moyen de paiement",
        variant: "destructive"
      });
      return;
    }

    if (!numeroTelephone) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir votre numéro de téléphone",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // Simulation du processus de paiement
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mise à jour des tickets utilisateur
      const nouveauxTickets = {
        ndekki: (user?.tickets?.ndekki || 0) + nombreNdekki,
        repas: (user?.tickets?.repas || 0) + nombreRepas
      };

      updateUser({ tickets: nouveauxTickets });
      updateUserTickets(user?.id || '', nouveauxTickets);

      toast({
        title: "Achat réussi !",
        description: `Vous avez acheté ${nombreNdekki} ticket(s) Ndekki et ${nombreRepas} ticket(s) Repas`,
      });

      // Réinitialiser le formulaire
      setNombreNdekki(1);
      setNombreRepas(1);
      setMoyenPaiement('');
      setNumeroTelephone('');

    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur s'est produite lors du paiement. Veuillez réessayer.",
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
          Acheter des tickets
        </h1>
        <p className="text-muted-foreground">
          Rechargez votre compte avec des tickets Ndekki et Repas
        </p>
      </div>

      <div className="grid gap-6">
        {/* Solde actuel */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Votre solde actuel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{user?.tickets?.ndekki || 0}</div>
                <p className="text-sm text-muted-foreground">Tickets Ndekki</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{user?.tickets?.repas || 0}</div>
                <p className="text-sm text-muted-foreground">Tickets Repas</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {((user?.tickets?.ndekki || 0) * 50 + (user?.tickets?.repas || 0) * 100).toLocaleString()}F
                </div>
                <p className="text-sm text-muted-foreground">Valeur totale</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des tickets */}
        <Card>
          <CardHeader>
            <CardTitle>Sélectionner les tickets</CardTitle>
            <CardDescription>
              Choisissez le nombre de tickets à acheter
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tickets Ndekki */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tickets Ndekki</h3>
                  <p className="text-sm text-muted-foreground">Petit-déjeuner • 50F CFA</p>
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
                    onChange={(e) => setNombreNdekki(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center"
                    min="0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreNdekki(nombreNdekki + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="ml-auto">
                  <span className="font-medium">{totalNdekki.toLocaleString()}F CFA</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Tickets Repas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Tickets Repas</h3>
                  <p className="text-sm text-muted-foreground">Déjeuner / Dîner • 100F CFA</p>
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
                    onChange={(e) => setNombreRepas(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-center"
                    min="0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNombreRepas(nombreRepas + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <div className="ml-auto">
                  <span className="font-medium">{totalRepas.toLocaleString()}F CFA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif et paiement */}
        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
            <CardDescription>
              Choisissez votre moyen de paiement et confirmez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Récapitulatif */}
            <div className="p-4 rounded-lg bg-muted/50 space-y-2">
              <div className="flex justify-between">
                <span>{nombreNdekki} Ticket(s) Ndekki</span>
                <span>{totalNdekki.toLocaleString()}F CFA</span>
              </div>
              <div className="flex justify-between">
                <span>{nombreRepas} Ticket(s) Repas</span>
                <span>{totalRepas.toLocaleString()}F CFA</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">{totalGeneral.toLocaleString()}F CFA</span>
              </div>
            </div>

            {/* Moyens de paiement */}
            <div className="space-y-3">
              <Label>Moyen de paiement</Label>
              <Select value={moyenPaiement} onValueChange={(value: any) => setMoyenPaiement(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un moyen de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wave">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      Wave
                    </div>
                  </SelectItem>
                  <SelectItem value="orange_money">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-orange-600" />
                      Orange Money
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Numéro de téléphone */}
            <div className="space-y-2">
              <Label htmlFor="telephone">Numéro de téléphone</Label>
              <Input
                id="telephone"
                type="tel"
                placeholder="77 123 45 67"
                value={numeroTelephone}
                onChange={(e) => setNumeroTelephone(e.target.value)}
              />
            </div>

            {/* Bouton de confirmation */}
            <Button
              onClick={handleAchat}
              disabled={isLoading || totalGeneral === 0}
              className="w-full bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg"
              size="lg"
            >
              {isLoading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Traitement en cours...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Confirmer l'achat • {totalGeneral.toLocaleString()}F CFA
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcheterTickets;
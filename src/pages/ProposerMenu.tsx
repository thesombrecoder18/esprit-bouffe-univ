import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { ChefHat, Send, Calendar, MapPin, Clock } from 'lucide-react';
import { mockRestaurants } from '@/data/mockData';

const ProposerMenu = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    restaurantId: '',
    dateProposition: '',
    typeMenu: '',
    proposition: '',
    commentaire: ''
  });

  const [propositions, setPropositions] = useState([
    {
      id: '1',
      date: '2024-01-15',
      restaurantNom: 'Restaurant ESP',
      proposition: 'Thieboudienne rouge avec légumes frais, salade de concombre et pain',
      typeMenu: 'repas',
      statut: 'en_attente'
    },
    {
      id: '2',
      date: '2024-01-12',
      restaurantNom: 'Restaurant ENSEPT',
      proposition: 'Ndekki au poisson avec riz parfumé et sauce tomate',
      typeMenu: 'ndekki',
      statut: 'accepte'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProposition = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.restaurantId || !formData.dateProposition || !formData.typeMenu || !formData.proposition) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    const selectedRestaurant = mockRestaurants.find(r => r.id === formData.restaurantId);
    
    const nouvelleProposition = {
      id: Date.now().toString(),
      date: formData.dateProposition,
      restaurantNom: selectedRestaurant?.nom || '',
      proposition: formData.proposition,
      typeMenu: formData.typeMenu,
      statut: 'en_attente'
    };

    setPropositions(prev => [nouvelleProposition, ...prev]);

    toast({
      title: "Proposition envoyée",
      description: "Votre proposition de menu a été envoyée au restaurateur !",
    });

    // Reset form
    setFormData({
      restaurantId: '',
      dateProposition: '',
      typeMenu: '',
      proposition: '',
      commentaire: ''
    });
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'en_attente':
        return <Badge variant="outline">En attente</Badge>;
      case 'accepte':
        return <Badge variant="default">Accepté</Badge>;
      case 'refuse':
        return <Badge variant="destructive">Refusé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    return type === 'ndekki' 
      ? <Badge variant="secondary">Ndekki</Badge>
      : <Badge variant="outline">Repas</Badge>;
  };

  if (user?.role !== 'etudiant') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux étudiants.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="flex items-center gap-3">
        <ChefHat className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Proposer un menu</h1>
          <p className="text-muted-foreground">
            Suggérez des idées de plats aux restaurateurs
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulaire de proposition */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Nouvelle proposition
            </CardTitle>
            <CardDescription>
              Proposez un menu pour un restaurant et une date spécifique
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitProposition} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="restaurantId">Restaurant *</Label>
                  <Select value={formData.restaurantId} onValueChange={(value) => handleSelectChange('restaurantId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un restaurant" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRestaurants.map((restaurant) => (
                        <SelectItem key={restaurant.id} value={restaurant.id}>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {restaurant.nom}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateProposition">Date souhaitée *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="dateProposition"
                      name="dateProposition"
                      type="date"
                      value={formData.dateProposition}
                      onChange={handleInputChange}
                      className="pl-10"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="typeMenu">Type de menu *</Label>
                <Select value={formData.typeMenu} onValueChange={(value) => handleSelectChange('typeMenu', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir le type de menu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ndekki">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Ndekki</Badge>
                        Menu léger (50F CFA)
                      </div>
                    </SelectItem>
                    <SelectItem value="repas">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Repas</Badge>
                        Menu complet (100F CFA)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proposition">Votre proposition de menu *</Label>
                <Textarea
                  id="proposition"
                  name="proposition"
                  value={formData.proposition}
                  onChange={handleInputChange}
                  placeholder="Décrivez votre proposition de menu en détail..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
                <Textarea
                  id="commentaire"
                  name="commentaire"
                  value={formData.commentaire}
                  onChange={handleInputChange}
                  placeholder="Ajoutez des précisions ou justifications..."
                  className="min-h-[80px]"
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Envoyer la proposition
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Historique des propositions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Mes propositions
            </CardTitle>
            <CardDescription>
              Historique de vos propositions de menus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {propositions.length === 0 ? (
                <div className="text-center py-8">
                  <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Aucune proposition pour le moment
                  </p>
                </div>
              ) : (
                propositions.map((proposition) => (
                  <Card key={proposition.id} className="border-l-4 border-l-primary/20">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {proposition.date}
                          </Badge>
                          {getTypeBadge(proposition.typeMenu)}
                        </div>
                        {getStatutBadge(proposition.statut)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {proposition.restaurantNom}
                        </div>
                        
                        <p className="text-sm font-medium leading-relaxed">
                          {proposition.proposition}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conseils */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils pour une bonne proposition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Soyez précis :</strong> Décrivez les plats, les accompagnements et la présentation</p>
          <p>• <strong>Pensez local :</strong> Privilégiez les ingrédients disponibles localement</p>
          <p>• <strong>Considérez le prix :</strong> Adaptez votre proposition au budget du type de menu</p>
          <p>• <strong>Soyez créatif :</strong> Proposez des variantes ou des associations originales</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProposerMenu;
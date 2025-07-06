import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { mockRestaurants, mockMenus } from '@/data/mockData';
import { MapPin, Clock, UtensilsCrossed, ChefHat, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Restaurants = () => {
  const navigate = useNavigate();

  const getMenuForRestaurant = (restaurantId: string) => {
    return mockMenus.find(menu => menu.restaurantId === restaurantId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Nos restaurants
        </h1>
        <p className="text-muted-foreground">
          Découvrez les restaurants universitaires de l'ESP et de l'ENSEPT
        </p>
      </div>

      {/* Informations générales */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Université Cheikh Anta Diop (UCAD)</p>
            <p className="text-muted-foreground">
              Campus universitaire - Dakar, Sénégal
            </p>
            <Badge variant="outline" className="text-primary border-primary/50">
              Accès facile depuis les deux écoles
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Horaires généraux */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-accent" />
            Horaires de service
          </CardTitle>
          <CardDescription>
            Tous nos restaurants suivent les mêmes horaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/5 to-transparent border border-primary/20">
              <h3 className="font-semibold text-primary mb-2">Petit-déjeuner</h3>
              <p className="text-2xl font-bold">06h - 10h</p>
              <p className="text-sm text-muted-foreground mt-1">Tickets Ndekki</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/5 to-transparent border border-accent/20">
              <h3 className="font-semibold text-accent mb-2">Déjeuner</h3>
              <p className="text-2xl font-bold">12h - 14h</p>
              <p className="text-sm text-muted-foreground mt-1">Tickets Repas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/5 to-transparent border border-success/20">
              <h3 className="font-semibold text-success mb-2">Dîner</h3>
              <p className="text-2xl font-bold">19h - 21h</p>
              <p className="text-sm text-muted-foreground mt-1">Tickets Repas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des restaurants */}
      <div className="grid gap-6 md:grid-cols-2">
        {mockRestaurants.map((restaurant) => {
          const menu = getMenuForRestaurant(restaurant.id);
          
          return (
            <Card key={restaurant.id} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    {restaurant.nom}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-warning fill-current" />
                    <span className="text-sm font-medium">4.3</span>
                  </div>
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {restaurant.localisation}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                
                {/* Menu du jour */}
                {menu && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Menu du jour</h4>
                      <Badge variant="secondary">
                        {formatDate(menu.date)}
                      </Badge>
                    </div>
                    
                    {/* Ndekki */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary/50">
                          Ndekki - 50F CFA
                        </Badge>
                      </div>
                      <div className="pl-4">
                        {menu.plats.ndekki.map((plat, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            • {plat}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Repas */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-accent border-accent/50">
                          Repas - 100F CFA
                        </Badge>
                      </div>
                      <div className="pl-4">
                        {menu.plats.repas.map((plat, index) => (
                          <p key={index} className="text-sm text-muted-foreground">
                            • {plat}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Informations supplémentaires */}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Service continu</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
                      <span>Places assises</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Participez à l'amélioration</CardTitle>
          <CardDescription>
            Votre avis compte pour améliorer nos services
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/proposer-menu')}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <ChefHat className="mr-2 h-4 w-4" />
            Proposer un menu
          </Button>
          <Button variant="outline">
            <Star className="mr-2 h-4 w-4" />
            Laisser un avis
          </Button>
        </CardContent>
      </Card>

      {/* Informations pratiques */}
      <Card className="border-muted/50">
        <CardHeader>
          <CardTitle className="text-base">ℹ️ Informations pratiques</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Paiement:</strong> Uniquement par tickets ESP'eat</p>
          <p>• <strong>Commande:</strong> Présentez votre QR code à l'agent</p>
          <p>• <strong>Retard:</strong> Les services ferment à l'heure précise</p>
          <p>• <strong>Hygiène:</strong> Tous nos restaurants respectent les normes sanitaires</p>
          <p>• <strong>Halal:</strong> Tous nos plats sont certifiés halal</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Restaurants;
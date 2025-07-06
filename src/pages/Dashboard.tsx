import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Share2, 
  MapPin, 
  ChefHat, 
  BarChart3, 
  QrCode,
  UtensilsCrossed,
  TrendingUp,
  Users,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const EtudiantDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Ndekki</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{user?.tickets?.ndekki || 0}</div>
            <p className="text-xs text-muted-foreground">50F CFA chacun</p>
          </CardContent>
        </Card>
        
        <Card className="border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Repas</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{user?.tickets?.repas || 0}</div>
            <p className="text-xs text-muted-foreground">100F CFA chacun</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {((user?.tickets?.ndekki || 0) * 50 + (user?.tickets?.repas || 0) * 100).toLocaleString()}F
            </div>
            <p className="text-xs text-muted-foreground">CFA</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
            <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
              Actif
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Étudiant ESP</div>
            <p className="text-xs text-muted-foreground">{user?.numeroEtudiant}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Gérez vos tickets et explorez les services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => navigate('/acheter-tickets')} 
              className="w-full justify-start bg-gradient-to-r from-primary to-primary-glow"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Acheter des tickets
            </Button>
            <Button 
              onClick={() => navigate('/partager-tickets')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Partager des tickets
            </Button>
            <Button 
              onClick={() => navigate('/restaurants')} 
              variant="outline" 
              className="w-full justify-start"
            >
              <MapPin className="mr-2 h-4 w-4" />
              Voir les restaurants
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Menu du jour</CardTitle>
            <CardDescription>Restaurant ESP - UCAD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2 text-primary">Ndekki (50F)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Attaya + Pain</li>
                  <li>• Café + Beignet</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2 text-accent">Repas (100F)</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Thiéboudienne</li>
                  <li>• Yassa Poulet</li>
                </ul>
              </div>
              <Button 
                onClick={() => navigate('/proposer-menu')} 
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <ChefHat className="mr-2 h-4 w-4" />
                Proposer un menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AgentDashboard = () => (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Scanner QR Code
          </CardTitle>
          <CardDescription>Validez les tickets des étudiants</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/scanner-qr')} 
            size="lg" 
            className="w-full bg-gradient-to-r from-primary to-primary-glow"
          >
            <QrCode className="mr-2 h-5 w-5" />
            Ouvrir le scanner
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Scans aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% vs hier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tickets Ndekki</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">28</div>
            <p className="text-xs text-muted-foreground">validés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tickets Repas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">19</div>
            <p className="text-xs text-muted-foreground">validés</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const GerantDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recette du jour</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">125,000F</div>
            <p className="text-xs text-muted-foreground">+8% vs hier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets vendus</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,125</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Étudiants actifs</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">487</div>
            <p className="text-xs text-muted-foreground">cette semaine</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">4.2/5</div>
            <p className="text-xs text-muted-foreground">moyenne</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actions de gestion</CardTitle>
          <CardDescription>Accédez aux outils de gestion et statistiques</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <Button 
            onClick={() => navigate('/statistiques')} 
            className="justify-start bg-gradient-to-r from-primary to-primary-glow"
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Voir les statistiques détaillées
          </Button>
          <Button 
            onClick={() => navigate('/gestion-utilisateurs')} 
            variant="outline" 
            className="justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            Gérer les utilisateurs
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const RestaurateurDashboard = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Menus créés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">12</div>
            <p className="text-xs text-muted-foreground">ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Propositions reçues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">8</div>
            <p className="text-xs text-muted-foreground">à examiner</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Plats populaires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Thiéboudienne</div>
            <p className="text-xs text-muted-foreground">156 commandes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des menus</CardTitle>
          <CardDescription>Créez et modifiez les menus quotidiens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => navigate('/gerer-menus')} 
            className="w-full justify-start bg-gradient-to-r from-primary to-primary-glow"
          >
            <ChefHat className="mr-2 h-4 w-4" />
            Gérer les menus du jour
          </Button>
          <Button 
            onClick={() => navigate('/propositions-menus')} 
            variant="outline" 
            className="w-full justify-start"
          >
            <Users className="mr-2 h-4 w-4" />
            Voir les propositions des étudiants
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu d'aujourd'hui</CardTitle>
          <CardDescription>Aperçu du menu en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Badge variant="outline" className="text-primary border-primary/50">Ndekki</Badge>
              <p className="text-sm mt-1">Attaya + Pain, Café + Beignet</p>
            </div>
            <div>
              <Badge variant="outline" className="text-accent border-accent/50">Repas</Badge>
              <p className="text-sm mt-1">Thiéboudienne, Yassa Poulet, Mafé Bœuf</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    switch (user?.role) {
      case 'etudiant':
        return <EtudiantDashboard />;
      case 'agent':
        return <AgentDashboard />;
      case 'gerant':
        return <GerantDashboard />;
      case 'restaurateur':
        return <RestaurateurDashboard />;
      default:
        return <div>Rôle non reconnu</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground">
          Bienvenue sur ESP'eat, {user?.prenom} !
        </p>
      </div>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
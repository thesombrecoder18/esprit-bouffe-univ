import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, DollarSign, Users, UtensilsCrossed, Calendar, Download } from 'lucide-react';

const Statistiques = () => {
  const { user } = useAuth();
  const [periodSelection, setPeriodSelection] = useState('mensuel');

  // Données simulées
  const statistiques = {
    recettes: {
      journaliere: 45000,
      mensuelle: 1200000,
      annuelle: 14400000
    },
    tickets: {
      vendus: {
        ndekki: 1200,
        repas: 800,
        total: 2000
      },
      utilises: {
        ndekki: 1150,
        repas: 750,
        total: 1900
      }
    },
    plats: {
      servis: {
        ndekki: 1150,
        repas: 750,
        total: 1900
      }
    },
    croissance: {
      recettes: 12.5,
      tickets: 8.3,
      utilisateurs: 15.2
    }
  };

  const ventesParMois = [
    { mois: 'Jan', ndekki: 920, repas: 680, recette: 102000 },
    { mois: 'Fév', ndekki: 1050, repas: 720, recette: 124500 },
    { mois: 'Mar', ndekki: 1200, repas: 800, recette: 140000 },
    { mois: 'Avr', ndekki: 1100, repas: 750, recette: 130000 },
    { mois: 'Mai', ndekki: 1300, repas: 850, recette: 150000 },
    { mois: 'Jun', ndekki: 1200, repas: 800, recette: 140000 }
  ];

  const topPlats = [
    { nom: 'Thieboudienne rouge', commandes: 245, type: 'repas' },
    { nom: 'Ndekki au poisson', commandes: 189, type: 'ndekki' },
    { nom: 'Riz sauté aux légumes', commandes: 156, type: 'repas' },
    { nom: 'Ndekki au poulet', commandes: 134, type: 'ndekki' },
    { nom: 'Mafé de bœuf', commandes: 123, type: 'repas' }
  ];

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  const exporterDonnees = () => {
    // Simulation de l'export
    const donnees = {
      period: periodSelection,
      date: new Date().toISOString(),
      statistiques,
      ventesParMois,
      topPlats
    };
    
    const dataStr = JSON.stringify(donnees, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `statistiques-${periodSelection}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (user?.role !== 'gerant') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Statistiques</h1>
            <p className="text-muted-foreground">
              Tableau de bord des performances
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={periodSelection} onValueChange={setPeriodSelection}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="journalier">Journalier</SelectItem>
              <SelectItem value="mensuel">Mensuel</SelectItem>
              <SelectItem value="annuel">Annuel</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exporterDonnees} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recette {periodSelection}</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodSelection === 'journalier' && formatMontant(statistiques.recettes.journaliere)}
              {periodSelection === 'mensuel' && formatMontant(statistiques.recettes.mensuelle)}
              {periodSelection === 'annuel' && formatMontant(statistiques.recettes.annuelle)}
            </div>
            <div className="flex items-center text-xs text-success">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{statistiques.croissance.recettes}% vs période précédente
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets vendus</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.tickets.vendus.total}</div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="secondary">{statistiques.tickets.vendus.ndekki} Ndekki</Badge>
              <Badge variant="outline">{statistiques.tickets.vendus.repas} Repas</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plats servis</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistiques.plats.servis.total}</div>
            <div className="text-xs text-muted-foreground">
              Taux d'utilisation: {Math.round((statistiques.tickets.utilises.total / statistiques.tickets.vendus.total) * 100)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Croissance</CardTitle>
            <TrendingUp className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+{statistiques.croissance.tickets}%</div>
            <div className="text-xs text-muted-foreground">
              Ventes de tickets ce mois
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Evolution mensuelle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Évolution mensuelle
            </CardTitle>
            <CardDescription>
              Ventes et recettes par mois
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ventesParMois.map((mois, index) => (
                <div key={mois.mois} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-center">
                      <p className="font-medium">{mois.mois}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {mois.ndekki}N
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {mois.repas}R
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatMontant(mois.recette)}</p>
                    <p className="text-xs text-muted-foreground">
                      {mois.ndekki + mois.repas} tickets
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top plats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" />
              Plats les plus populaires
            </CardTitle>
            <CardDescription>
              Classement par nombre de commandes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPlats.map((plat, index) => (
                <div key={plat.nom} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{plat.nom}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={plat.type === 'ndekki' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {plat.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{plat.commandes}</p>
                    <p className="text-xs text-muted-foreground">commandes</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analyse détaillée */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">📊 Analyse de performance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2">Points forts</h4>
            <ul className="space-y-1 text-sm">
              <li>• Croissance des ventes de +{statistiques.croissance.tickets}%</li>
              <li>• Taux d'utilisation des tickets élevé (95%)</li>
              <li>• Thieboudienne rouge très populaire</li>
              <li>• Équilibre ndekki/repas maintenu</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Axes d'amélioration</h4>
            <ul className="space-y-1 text-sm">
              <li>• Diversifier l'offre de plats ndekki</li>
              <li>• Optimiser les créneaux de service</li>
              <li>• Développer les menus saisonniers</li>
              <li>• Améliorer la satisfaction client</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistiques;
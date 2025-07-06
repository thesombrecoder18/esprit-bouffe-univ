import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Users, MessageSquare, ThumbsUp, ThumbsDown, Eye, Calendar, Clock, User } from 'lucide-react';

const PropositionsMenus = () => {
  const { user } = useAuth();
  const [filtreStatut, setFiltreStatut] = useState('toutes');
  const [propositionSelectionnee, setPropositionSelectionnee] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reponse, setReponse] = useState('');

  const [propositions, setPropositions] = useState([
    {
      id: '1',
      etudiantId: 'user_1',
      etudiantNom: 'Aminata Diop',
      etudiantNumero: 'ESP2023001',
      proposition: 'Thieboudienne rouge avec légumes frais de saison : carottes, aubergines, choux, poivrons. Accompagné de poisson fumé et de riz parfumé. Ajout de sauce tomate maison et pain frais.',
      typeMenu: 'repas',
      date: '2024-01-15',
      dateProposition: '2024-01-10',
      statut: 'en_attente',
      commentaire: 'Ce serait génial d\'avoir plus de légumes frais dans nos repas !',
      restaurantId: '1'
    },
    {
      id: '2',
      etudiantId: 'user_2',
      etudiantNom: 'Moussa Ndiaye',
      etudiantNumero: 'ESP2023045',
      proposition: 'Ndekki au poulet mariné avec des épices locales, riz complet et sauce oignons. Accompagné de salade de concombre et tomates fraîches.',
      typeMenu: 'ndekki',
      date: '2024-01-16',
      dateProposition: '2024-01-11',
      statut: 'accepte',
      commentaire: 'Le poulet mariné donnerait plus de goût au ndekki classique',
      restaurantId: '1',
      reponseRestaurateur: 'Excellente idée ! Nous allons l\'intégrer au menu de demain.'
    },
    {
      id: '3',
      etudiantId: 'user_3',
      etudiantNom: 'Fatou Sall',
      etudiantNumero: 'ESP2023078',
      proposition: 'Mafé végétarien avec des légumineuses (haricots, lentilles) et légumes de saison. Riz blanc et pain traditionnel.',
      typeMenu: 'repas',
      date: '2024-01-17',
      dateProposition: '2024-01-12',
      statut: 'refuse',
      commentaire: 'Pour les étudiants végétariens, ce serait une excellente alternative !',
      restaurantId: '1',
      reponseRestaurateur: 'Nous apprécions la suggestion mais nous nous concentrons sur les plats traditionnels avec viande pour le moment.'
    },
    {
      id: '4',
      etudiantId: 'user_4',
      etudiantNom: 'Cheikh Ba',
      etudiantNumero: 'ESP2023089',
      proposition: 'Riz sauté aux fruits de mer (crevettes, poisson) avec légumes variés et sauce épicée. Salade fraîche et pain grillé.',
      typeMenu: 'repas',
      date: '2024-01-18',
      dateProposition: '2024-01-13',
      statut: 'en_attente',
      commentaire: 'Les fruits de mer changeraient de nos plats habituels !',
      restaurantId: '1'
    }
  ]);

  const propositionsFiltrees = propositions.filter(p => {
    if (filtreStatut === 'toutes') return true;
    return p.statut === filtreStatut;
  });

  const statistiques = {
    total: propositions.length,
    en_attente: propositions.filter(p => p.statut === 'en_attente').length,
    accepte: propositions.filter(p => p.statut === 'accepte').length,
    refuse: propositions.filter(p => p.statut === 'refuse').length
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

  const handleRepondreProposition = (proposition: any) => {
    setPropositionSelectionnee(proposition);
    setReponse(proposition.reponseRestaurateur || '');
    setIsDialogOpen(true);
  };

  const handleAccepterProposition = (propositionId: string) => {
    setPropositions(prev => prev.map(p => 
      p.id === propositionId 
        ? { ...p, statut: 'accepte', reponseRestaurateur: reponse || 'Proposition acceptée !' }
        : p
    ));
    
    toast({
      title: "Proposition acceptée",
      description: "La proposition a été acceptée avec succès.",
    });
    
    setIsDialogOpen(false);
    setReponse('');
  };

  const handleRefuserProposition = (propositionId: string) => {
    setPropositions(prev => prev.map(p => 
      p.id === propositionId 
        ? { ...p, statut: 'refuse', reponseRestaurateur: reponse || 'Proposition refusée.' }
        : p
    ));
    
    toast({
      title: "Proposition refusée",
      description: "La proposition a été refusée avec votre commentaire.",
    });
    
    setIsDialogOpen(false);
    setReponse('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (user?.role !== 'restaurateur') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux restaurateurs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Propositions des étudiants</h1>
            <p className="text-muted-foreground">
              Consultez et répondez aux suggestions de menus
            </p>
          </div>
        </div>
        
        <Select value={filtreStatut} onValueChange={setFiltreStatut}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les propositions</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="accepte">Acceptées</SelectItem>
            <SelectItem value="refuse">Refusées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.total}</div>
            <p className="text-xs text-muted-foreground">Total propositions</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-warning">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.en_attente}</div>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.accepte}</div>
            <p className="text-xs text-muted-foreground">Acceptées</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{statistiques.refuse}</div>
            <p className="text-xs text-muted-foreground">Refusées</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des propositions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Propositions ({propositionsFiltrees.length})
          </CardTitle>
          <CardDescription>
            Gérez les suggestions de menus des étudiants
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {propositionsFiltrees.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucune proposition trouvée avec ce filtre
                </p>
              </div>
            ) : (
              propositionsFiltrees
                .sort((a, b) => new Date(b.dateProposition).getTime() - new Date(a.dateProposition).getTime())
                .map((proposition) => (
                  <Card key={proposition.id} className={`
                    border-l-4 transition-all
                    ${proposition.statut === 'en_attente' 
                      ? 'border-l-warning bg-warning/5' 
                      : proposition.statut === 'accepte'
                        ? 'border-l-success'
                        : 'border-l-destructive'
                    }
                  `}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                            {proposition.etudiantNom.split(' ').map(n => n.charAt(0)).join('')}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{proposition.etudiantNom}</h3>
                              <Badge variant="outline" className="text-xs">
                                {proposition.etudiantNumero}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>Proposé le {formatDate(proposition.dateProposition)}</span>
                              <span>•</span>
                              <span>Pour le {formatDate(proposition.date)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatutBadge(proposition.statut)}
                          {getTypeBadge(proposition.typeMenu)}
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Proposition de menu :</h4>
                          <p className="text-sm leading-relaxed">
                            {proposition.proposition}
                          </p>
                        </div>
                        
                        {proposition.commentaire && (
                          <div className="bg-accent/10 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-accent">Commentaire de l'étudiant :</h4>
                            <p className="text-sm leading-relaxed">
                              {proposition.commentaire}
                            </p>
                          </div>
                        )}
                        
                        {proposition.reponseRestaurateur && (
                          <div className="bg-primary/10 p-4 rounded-lg">
                            <h4 className="font-medium mb-2 text-primary">Votre réponse :</h4>
                            <p className="text-sm leading-relaxed">
                              {proposition.reponseRestaurateur}
                            </p>
                          </div>
                        )}
                        
                        {proposition.statut === 'en_attente' && (
                          <div className="flex items-center gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleRepondreProposition(proposition)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Répondre
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog de réponse */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Répondre à la proposition</DialogTitle>
            <DialogDescription>
              Acceptez ou refusez cette proposition avec un commentaire optionnel.
            </DialogDescription>
          </DialogHeader>
          
          {propositionSelectionnee && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{propositionSelectionnee.etudiantNom}</span>
                  {getTypeBadge(propositionSelectionnee.typeMenu)}
                </div>
                <p className="text-sm">{propositionSelectionnee.proposition}</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reponse">Votre réponse (optionnel)</Label>
                <Textarea
                  id="reponse"
                  value={reponse}
                  onChange={(e) => setReponse(e.target.value)}
                  placeholder="Ajoutez un commentaire pour expliquer votre décision..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => handleRefuserProposition(propositionSelectionnee?.id)}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              Refuser
            </Button>
            <Button 
              onClick={() => handleAccepterProposition(propositionSelectionnee?.id)}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Accepter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Conseils */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils pour gérer les propositions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Répondez rapidement :</strong> Les étudiants apprécieront vos retours même négatifs</p>
          <p>• <strong>Soyez constructif :</strong> Expliquez pourquoi vous acceptez ou refusez</p>
          <p>• <strong>Gardez l'esprit ouvert :</strong> Certaines idées peuvent vous surprendre positivement</p>
          <p>• <strong>Communiquez les contraintes :</strong> Budget, disponibilité des ingrédients, etc.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropositionsMenus;
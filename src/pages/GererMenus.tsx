import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { ChefHat, Plus, Edit, Trash2, Calendar, Clock } from 'lucide-react';

const GererMenus = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [menuSelectionne, setMenuSelectionne] = useState<any>(null);
  const [formData, setFormData] = useState({
    date: '',
    ndekki: '',
    repas: '',
    description: ''
  });

  const [menus, setMenus] = useState([
    {
      id: '1',
      date: '2024-01-15',
      plats: {
        ndekki: 'Ndekki au poisson avec riz blanc, sauce tomate et légumes',
        repas: 'Thieboudienne rouge avec légumes variés, poisson et pain'
      },
      description: 'Menu spécial de la semaine',
      restaurantId: '1'
    },
    {
      id: '2',
      date: '2024-01-16',
      plats: {
        ndekki: 'Ndekki au poulet, riz parfumé et sauce oignons',
        repas: 'Mafé de bœuf avec riz blanc et légumes de saison'
      },
      description: 'Menu traditionnel sénégalais',
      restaurantId: '1'
    },
    {
      id: '3',
      date: '2024-01-17',
      plats: {
        ndekki: 'Ndekki aux légumes, riz complet et sauce arachide',
        repas: 'Riz sauté aux crevettes avec salade fraîche'
      },
      description: 'Menu équilibré et nutritif',
      restaurantId: '1'
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSauvegarderMenu = () => {
    if (!formData.date || !formData.ndekki || !formData.repas) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    if (menuSelectionne) {
      // Modification
      setMenus(prev => prev.map(menu => 
        menu.id === menuSelectionne.id 
          ? {
              ...menu,
              date: formData.date,
              plats: {
                ndekki: formData.ndekki,
                repas: formData.repas
              },
              description: formData.description
            }
          : menu
      ));
      
      toast({
        title: "Menu modifié",
        description: "Le menu a été mis à jour avec succès.",
      });
    } else {
      // Création
      const nouveauMenu = {
        id: Date.now().toString(),
        date: formData.date,
        plats: {
          ndekki: formData.ndekki,
          repas: formData.repas
        },
        description: formData.description,
        restaurantId: '1'
      };
      
      setMenus(prev => [nouveauMenu, ...prev]);
      
      toast({
        title: "Menu créé",
        description: "Le nouveau menu a été ajouté avec succès.",
      });
    }

    // Reset form
    setFormData({
      date: '',
      ndekki: '',
      repas: '',
      description: ''
    });
    setMenuSelectionne(null);
    setIsDialogOpen(false);
  };

  const handleModifierMenu = (menu: any) => {
    setMenuSelectionne(menu);
    setFormData({
      date: menu.date,
      ndekki: menu.plats.ndekki,
      repas: menu.plats.repas,
      description: menu.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleSupprimerMenu = (menuId: string) => {
    setMenus(prev => prev.filter(menu => menu.id !== menuId));
    toast({
      title: "Menu supprimé",
      description: "Le menu a été supprimé avec succès.",
    });
  };

  const handleNouveauMenu = () => {
    setMenuSelectionne(null);
    setFormData({
      date: '',
      ndekki: '',
      repas: '',
      description: ''
    });
    setIsDialogOpen(true);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDatePassee = (dateStr: string) => {
    return new Date(dateStr) < new Date(new Date().toDateString());
  };

  if (user?.role !== 'restaurateur') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
          <ChefHat className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gérer les menus</h1>
            <p className="text-muted-foreground">
              Créez et modifiez les menus quotidiens
            </p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNouveauMenu}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau menu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {menuSelectionne ? 'Modifier le menu' : 'Créer un nouveau menu'}
              </DialogTitle>
              <DialogDescription>
                {menuSelectionne 
                  ? 'Modifiez les informations du menu existant.'
                  : 'Ajoutez un nouveau menu pour une date spécifique.'
                }
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date du menu *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ndekki">Menu Ndekki (50F CFA) *</Label>
                <Textarea
                  id="ndekki"
                  name="ndekki"
                  value={formData.ndekki}
                  onChange={handleInputChange}
                  placeholder="Ex: Ndekki au poulet avec riz blanc, sauce tomate et légumes variés"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repas">Menu Repas (100F CFA) *</Label>
                <Textarea
                  id="repas"
                  name="repas"
                  value={formData.repas}
                  onChange={handleInputChange}
                  placeholder="Ex: Thieboudienne rouge avec poisson, légumes et pain"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnel)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ajoutez une description ou des informations spéciales..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSauvegarderMenu}>
                {menuSelectionne ? 'Modifier' : 'Créer'} le menu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{menus.length}</div>
            <p className="text-xs text-muted-foreground">Menus créés</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {menus.filter(m => !isDatePassee(m.date)).length}
            </div>
            <p className="text-xs text-muted-foreground">Menus à venir</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">
              {menus.filter(m => m.date === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">Menu d'aujourd'hui</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des menus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mes menus
          </CardTitle>
          <CardDescription>
            Gérez tous vos menus créés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menus.length === 0 ? (
              <div className="text-center py-8">
                <ChefHat className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Aucun menu créé pour le moment
                </p>
                <Button onClick={handleNouveauMenu}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer votre premier menu
                </Button>
              </div>
            ) : (
              menus
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((menu) => (
                  <Card key={menu.id} className={`
                    border-l-4 transition-all
                    ${menu.date === new Date().toISOString().split('T')[0] 
                      ? 'border-l-primary bg-primary/5' 
                      : isDatePassee(menu.date)
                        ? 'border-l-muted-foreground/30 opacity-60'
                        : 'border-l-accent'
                    }
                  `}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">
                              {formatDate(menu.date)}
                            </h3>
                            {menu.date === new Date().toISOString().split('T')[0] && (
                              <Badge variant="default">Aujourd'hui</Badge>
                            )}
                            {isDatePassee(menu.date) && (
                              <Badge variant="secondary">Passé</Badge>
                            )}
                          </div>
                          {menu.description && (
                            <p className="text-sm text-muted-foreground">
                              {menu.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleModifierMenu(menu)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleSupprimerMenu(menu.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Ndekki - 50F CFA</Badge>
                          </div>
                          <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
                            {menu.plats.ndekki}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Repas - 100F CFA</Badge>
                          </div>
                          <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-lg">
                            {menu.plats.repas}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Conseils */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">💡 Conseils pour vos menus</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• <strong>Planifiez à l'avance :</strong> Créez vos menus plusieurs jours à l'avance</p>
          <p>• <strong>Variez les plats :</strong> Proposez différents types de cuisine sénégalaise</p>
          <p>• <strong>Pensez équilibré :</strong> Incluez légumes, protéines et féculents</p>
          <p>• <strong>Soyez précis :</strong> Décrivez clairement les plats et accompagnements</p>
          <p>• <strong>Considérez les allergies :</strong> Mentionnez les ingrédients sensibles</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GererMenus;
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { mockTicketShares } from '@/data/mockData';
import { UtensilsCrossed, Share2, CreditCard, History, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MesTickets = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const totalTickets = (user?.tickets?.ndekki || 0) + (user?.tickets?.repas || 0);
  const valeurTotale = (user?.tickets?.ndekki || 0) * 50 + (user?.tickets?.repas || 0) * 100;

  // Générer un QR code simple pour la démonstration
  const generateQRCode = () => {
    return `ESP-${user?.id}-${Date.now()}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mes tickets
        </h1>
        <p className="text-muted-foreground">
          Consultez et gérez vos tickets ESP'eat
        </p>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Ndekki</CardTitle>
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{user?.tickets?.ndekki || 0}</div>
            <p className="text-xs text-muted-foreground">50F CFA chacun</p>
            <Progress 
              value={((user?.tickets?.ndekki || 0) / Math.max(1, totalTickets)) * 100} 
              className="mt-2 h-1"
            />
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
            <Progress 
              value={((user?.tickets?.repas || 0) / Math.max(1, totalTickets)) * 100} 
              className="mt-2 h-1"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Badge variant="secondary">{totalTickets}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTickets}</div>
            <p className="text-xs text-muted-foreground">tickets disponibles</p>
          </CardContent>
        </Card>
        
        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-transparent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            <CreditCard className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{valeurTotale.toLocaleString()}F</div>
            <p className="text-xs text-muted-foreground">CFA</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Gérez vos tickets facilement</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <Button 
            onClick={() => navigate('/acheter-tickets')}
            className="bg-gradient-to-r from-primary to-primary-glow"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Acheter des tickets
          </Button>
          <Button 
            onClick={() => navigate('/partager-tickets')}
            variant="outline"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager des tickets
          </Button>
          <Button variant="outline">
            <History className="mr-2 h-4 w-4" />
            Historique
          </Button>
        </CardContent>
      </Card>

      {/* QR Code pour validation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Code QR de validation
          </CardTitle>
          <CardDescription>
            Présentez ce code à l'agent pour utiliser vos tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-48 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
              <div className="text-center">
                <QrCode className="h-16 w-16 text-primary mx-auto mb-2" />
                <p className="text-sm font-mono text-muted-foreground">{generateQRCode()}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-primary border-primary/50">
              Code valide • {user?.prenom} {user?.nom}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Historique des partages */}
      {mockTicketShares.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tickets partagés récemment</CardTitle>
            <CardDescription>
              Vos derniers partages de tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTicketShares.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Share2 className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">{share.destinataire}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(share.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conseils d'utilisation */}
      <Card className="border-muted/50">
        <CardHeader>
          <CardTitle className="text-base">💡 Conseils d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Présentez votre QR code à l'agent pour valider vos tickets</p>
          <p>• Les tickets Ndekki sont valables pour le petit-déjeuner (06h-10h)</p>
          <p>• Les tickets Repas sont valables pour le déjeuner (12h-14h) et le dîner (19h-21h)</p>
          <p>• Vous pouvez partager vos tickets avec d'autres étudiants</p>
          <p>• Rechargez régulièrement votre compte pour éviter les ruptures</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MesTickets;
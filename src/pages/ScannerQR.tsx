import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { QrCode, User, UtensilsCrossed, CheckCircle, XCircle, History, Camera } from 'lucide-react';

const ScannerQR = () => {
  const { user } = useAuth();
  const [isScanning, setIsScanning] = useState(false);
  const [numeroEtudiant, setNumeroEtudiant] = useState('');
  const [scanHistory, setScanHistory] = useState([
    {
      id: '1',
      etudiantNom: 'Aminata Diop',
      numeroEtudiant: 'ESP2023001',
      typeTicket: 'ndekki' as const,
      nombre: 1,
      dateHeure: '2025-01-15 12:30',
      statut: 'valide'
    },
    {
      id: '2',
      etudiantNom: 'Moussa Ndiaye',
      numeroEtudiant: 'ESP2023045',
      typeTicket: 'repas' as const,
      nombre: 1,
      dateHeure: '2025-01-15 12:25',
      statut: 'valide'
    },
    {
      id: '3',
      etudiantNom: 'Fatou Sall',
      numeroEtudiant: 'ESP2023078',
      typeTicket: 'ndekki' as const,
      nombre: 2,
      dateHeure: '2025-01-15 12:20',
      statut: 'invalide'
    }
  ]);

  // Simulation du scan
  const simulateQRScan = (numeroManuel?: string) => {
    const mockScans = [
      {
        etudiantNom: 'Cheikh Ba',
        numeroEtudiant: numeroManuel || 'ESP2023089',
        typeTicket: 'repas' as const,
        nombre: 1,
        statut: 'valide'
      },
      {
        etudiantNom: 'Aida Faye',
        numeroEtudiant: numeroManuel || 'ESP2023012',
        typeTicket: 'ndekki' as const,
        nombre: 2,
        statut: 'valide'
      },
      {
        etudiantNom: 'Oumar Diallo',
        numeroEtudiant: numeroManuel || 'ESP2023156',
        typeTicket: 'repas' as const,
        nombre: 1,
        statut: 'invalide'
      }
    ];

    const randomScan = numeroManuel 
      ? { ...mockScans[0], numeroEtudiant: numeroManuel }
      : mockScans[Math.floor(Math.random() * mockScans.length)];
    
    const nouveauScan = {
      id: Date.now().toString(),
      ...randomScan,
      dateHeure: new Date().toLocaleString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    setScanHistory(prev => [nouveauScan, ...prev]);

    if (nouveauScan.statut === 'valide') {
      toast({
        title: "✅ Scan validé",
        description: `${nouveauScan.etudiantNom} - ${nouveauScan.nombre} ticket(s) ${nouveauScan.typeTicket}`,
      });
    } else {
      toast({
        title: "❌ Scan invalide",
        description: `${nouveauScan.etudiantNom} - Tickets insuffisants`,
        variant: "destructive",
      });
    }
  };

  const handleStartScan = () => {
    setIsScanning(true);
    
    // Simulation d'un délai de scan
    setTimeout(() => {
      simulateQRScan();
      setIsScanning(false);
    }, 2000);
  };

  const handleManualScan = () => {
    if (!numeroEtudiant.trim()) return;
    
    setIsScanning(true);
    
    // Simulation d'une vérification manuelle
    setTimeout(() => {
      simulateQRScan(numeroEtudiant.trim());
      setNumeroEtudiant('');
      setIsScanning(false);
    }, 1000);
  };

  const getTicketBadge = (type: string) => {
    return type === 'ndekki' 
      ? <Badge variant="secondary">Ndekki</Badge>
      : <Badge variant="outline">Repas</Badge>;
  };

  const getStatutIcon = (statut: string) => {
    return statut === 'valide' 
      ? <CheckCircle className="h-4 w-4 text-success" />
      : <XCircle className="h-4 w-4 text-destructive" />;
  };

  if (user?.role !== 'agent') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card>
          <CardContent className="pt-6">
            <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground">
              Cette page est réservée aux agents.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
      <div className="flex items-center gap-3">
        <QrCode className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scanner QR Code</h1>
          <p className="text-muted-foreground">
            Validez les tickets des étudiants
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Scanner */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Scanner
            </CardTitle>
            <CardDescription>
              Scannez le QR code de l'étudiant pour valider ses tickets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Zone de scan simulée */}
            <div className={`
              relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
              ${isScanning ? 'border-primary bg-primary/5 animate-pulse' : 'border-muted-foreground/30'}
            `}>
              {isScanning ? (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <QrCode className="h-8 w-8 text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="font-medium">Scan en cours...</p>
                    <p className="text-sm text-muted-foreground">
                      Veuillez patienter
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                    <QrCode className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Prêt à scanner</p>
                    <p className="text-sm text-muted-foreground">
                      Placez le QR code de l'étudiant devant la caméra
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={handleStartScan} 
              disabled={isScanning}
              className="w-full"
              size="lg"
            >
              {isScanning ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scan en cours...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Scanner QR Code
                </>
              )}
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="text-sm text-muted-foreground">OU</span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="numeroEtudiant">Saisir le numéro de carte étudiant</Label>
              <div className="flex gap-2">
                <Input
                  id="numeroEtudiant"
                  placeholder="Ex: ESP2023001"
                  value={numeroEtudiant}
                  onChange={(e) => setNumeroEtudiant(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleManualScan}
                  disabled={!numeroEtudiant.trim() || isScanning}
                  variant="outline"
                >
                  Valider
                </Button>
              </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {scanHistory.filter(s => s.statut === 'valide').length}
                </p>
                <p className="text-sm text-muted-foreground">Scans valides</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {scanHistory.filter(s => s.statut === 'invalide').length}
                </p>
                <p className="text-sm text-muted-foreground">Scans invalides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Historique */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Historique des scans
            </CardTitle>
            <CardDescription>
              Dernières validations effectuées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
            {scanHistory.length === 0 ? (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucun scan effectué aujourd'hui
                </p>
              </div>
            ) : (
              scanHistory.map((scan) => (
                <Card key={scan.id} className={`
                  border-l-4 transition-colors
                  ${scan.statut === 'valide' ? 'border-l-success' : 'border-l-destructive'}
                `}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{scan.etudiantNom}</p>
                          <p className="text-sm text-muted-foreground">
                            {scan.numeroEtudiant}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatutIcon(scan.statut)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="h-4 w-4" />
                        <span className="text-sm">
                          {scan.nombre} × 
                        </span>
                        {getTicketBadge(scan.typeTicket)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {scan.dateHeure}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg">📋 Instructions d'utilisation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>1. <strong>Demandez à l'étudiant</strong> d'ouvrir son QR code dans l'application ESP'eat</p>
          <p>2. <strong>Cliquez sur "Démarrer le scan"</strong> et placez le QR code devant la caméra</p>
          <p>3. <strong>Vérifiez le résultat :</strong> ✅ valide = tickets débités, ❌ invalide = tickets insuffisants</p>
          <p>4. <strong>En cas de problème,</strong> vérifiez que l'étudiant a suffisamment de tickets du bon type</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScannerQR;
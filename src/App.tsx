import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AcheterTickets from "@/pages/AcheterTickets";
import MesTickets from "@/pages/MesTickets";
import PartagerTickets from "@/pages/PartagerTickets";
import Restaurants from "@/pages/Restaurants";
import Profil from "@/pages/Profil";
import ProposerMenu from "@/pages/ProposerMenu";
import ScannerQR from "@/pages/ScannerQR";
import Statistiques from "@/pages/Statistiques";
import GestionUtilisateurs from "@/pages/GestionUtilisateurs";
import GererMenus from "@/pages/GererMenus";
import PropositionsMenus from "@/pages/PropositionsMenus";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="acheter-tickets" element={<AcheterTickets />} />
              <Route path="mes-tickets" element={<MesTickets />} />
              <Route path="partager-tickets" element={<PartagerTickets />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="profil" element={<Profil />} />
              <Route path="proposer-menu" element={<ProposerMenu />} />
              <Route path="scanner-qr" element={<ScannerQR />} />
              <Route path="statistiques" element={<Statistiques />} />
              <Route path="gestion-utilisateurs" element={<GestionUtilisateurs />} />
              <Route path="gerer-menus" element={<GererMenus />} />
              <Route path="propositions-menus" element={<PropositionsMenus />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

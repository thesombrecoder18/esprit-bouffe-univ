import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  CreditCard, 
  Share2, 
  MapPin, 
  ChefHat, 
  BarChart3, 
  QrCode, 
  User,
  Users,
  UtensilsCrossed
} from 'lucide-react';

export function AppSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();
  const isCollapsed = state === 'collapsed';

  const getMenuItems = () => {
    switch (user?.role) {
      case 'etudiant':
        return [
          { title: 'Tableau de bord', url: '/dashboard', icon: Home },
          { title: 'Acheter des tickets', url: '/acheter-tickets', icon: CreditCard },
          { title: 'Mes tickets', url: '/mes-tickets', icon: UtensilsCrossed },
          { title: 'Partager des tickets', url: '/partager-tickets', icon: Share2 },
          { title: 'Restaurants', url: '/restaurants', icon: MapPin },
          { title: 'Proposer un menu', url: '/proposer-menu', icon: ChefHat },
          { title: 'Mon profil', url: '/profil', icon: User },
        ];
      case 'agent':
        return [
          { title: 'Tableau de bord', url: '/dashboard', icon: Home },
          { title: 'Scanner QR Code', url: '/scanner-qr', icon: QrCode },
          { title: 'Mon profil', url: '/profil', icon: User },
        ];
      case 'gerant':
        return [
          { title: 'Tableau de bord', url: '/dashboard', icon: Home },
          { title: 'Statistiques', url: '/statistiques', icon: BarChart3 },
          { title: 'Gestion utilisateurs', url: '/gestion-utilisateurs', icon: Users },
          { title: 'Mon profil', url: '/profil', icon: User },
        ];
      case 'restaurateur':
        return [
          { title: 'Tableau de bord', url: '/dashboard', icon: Home },
          { title: 'Gérer les menus', url: '/gerer-menus', icon: ChefHat },
          { title: 'Propositions étudiants', url: '/propositions-menus', icon: Users },
          { title: 'Mon profil', url: '/profil', icon: User },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="h-4 w-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ESP'eat
              </h2>
              <p className="text-xs text-muted-foreground capitalize">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive 
                            ? 'bg-primary/10 text-primary font-medium border border-primary/20' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { ChartLine, Weight, ArrowUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  
  const menuItems = [
    { title: 'Dashboard', icon: ChartLine, url: '/' },
    { title: 'Log Weight', icon: Weight, url: '/log' },
    { title: 'Progress', icon: ArrowUp, url: '/progress' }
  ];

  if (!user) return null;

  return (
    <Sidebar>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Weight className="h-6 w-6 text-theme-purple" />
          <h1 className="text-xl font-bold">WeightTrack</h1>
        </div>
        <SidebarTrigger />
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className={pathname === item.url ? "bg-accent" : ""}>
                    <Link to={item.url} className="flex items-center gap-2 w-full">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-2 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <div>Weight Tracker v1.0</div>
          <div>2025</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import {
  Home,
  Bot,
  Settings,
  User as UserIcon,
  CreditCard,
  LifeBuoy,
  LogOut,
  Gem,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const mainNav = (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard" isActive={pathname === '/dashboard'} asChild>
          <Link href="/dashboard"><Home /><span>Dashboard</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/ai-models" isActive={pathname.startsWith('/ai-models')} asChild>
          <Link href="#"><Bot /><span>AI models</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/preferences" isActive={pathname.startsWith('/preferences')} asChild>
          <Link href="#"><Settings /><span>Preferences</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  );

  const accountNav = (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenuItem>
        <SidebarMenuButton href="/account" isActive={pathname.startsWith('/account')} asChild>
          <Link href="#"><UserIcon /><span>My account</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/subscription" isActive={pathname.startsWith('/subscription')} asChild>
          <Link href="#"><Gem /><span>Update subscription</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/billing" isActive={pathname.startsWith('/billing')} asChild>
          <Link href="#"><CreditCard /><span>Manage billing</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  );
  
  const helpNav = (
     <SidebarGroup>
      <SidebarGroupLabel>Help</SidebarGroupLabel>
      <SidebarMenuItem>
        <SidebarMenuButton href="/support" isActive={pathname.startsWith('/support')} asChild>
          <Link href="#"><LifeBuoy /><span>Support / feedback</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  )

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNav}
          {accountNav}
          {helpNav}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
          <SidebarTrigger className="md:hidden">
            <PanelLeft />
            <span className="sr-only">Toggle Menu</span>
          </SidebarTrigger>
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage
                    src={user.photoURL || undefined}
                    alt={user.email || 'User Avatar'}
                  />
                  <AvatarFallback>
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="#">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="#">Support</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

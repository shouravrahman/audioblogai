'use client';

import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';


function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

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
        <SidebarMenuButton href="/dashboard/ai-models" isActive={pathname.startsWith('/dashboard/ai-models')} asChild>
          <Link href="/dashboard/ai-models"><Bot /><span>AI models</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard/preferences" isActive={pathname.startsWith('/dashboard/preferences')} asChild>
          <Link href="/dashboard/preferences"><Settings /><span>Preferences</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  );

  const accountNav = (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard/account" isActive={pathname.startsWith('/dashboard/account')} asChild>
          <Link href="/dashboard/account"><UserIcon /><span>My account</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard/subscription" isActive={pathname.startsWith('/dashboard/subscription')} asChild>
          <Link href="/dashboard/subscription"><Gem /><span>Update subscription</span></Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarGroup>
  );
  
  const helpNav = (
     <SidebarGroup>
      <SidebarGroupLabel>Help</SidebarGroupLabel>
      <SidebarMenuItem>
        <SidebarMenuButton href="/dashboard/support" isActive={pathname.startsWith('/dashboard/support')} asChild>
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
  const pathname = usePathname();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    // Redirect from root of (app) group to dashboard
    if (pathname === '/') {
        router.replace('/dashboard');
    }
  }, [pathname, router]);

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
    <div className="min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
             <div className="flex items-center gap-2 sm:hidden">
                <SidebarTrigger>
                    <PanelLeft />
                    <span className="sr-only">Toggle Menu</span>
                </SidebarTrigger>
             </div>
             <div className="flex flex-1 justify-center sm:hidden">
                <Logo />
             </div>
            
            <div className='flex items-center gap-4'>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/new-article">Create New Article</Link>
                </Button>
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
                      <Link href="/dashboard/preferences">Settings</Link>
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
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

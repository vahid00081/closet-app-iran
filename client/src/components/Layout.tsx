import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Shirt, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/closet', icon: Shirt, label: 'Closet' },
    { href: '/upload', icon: PlusCircle, label: 'Add' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden border-x border-border">
      <main className="flex-1 overflow-y-auto p-6 pb-24 scrollbar-hide">
        {children}
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 max-w-md mx-auto">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 cursor-pointer",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}>
                  <item.icon className={cn("h-6 w-6", isActive && "fill-current")} />
                  <span className="text-[10px] font-medium mt-1">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, History, BarChart3, Plus, Wallet, Repeat, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/contas', label: 'Nova Conta', icon: Plus },
    { path: '/contas-fixas', label: 'Contas Fixas', icon: Repeat },
    { path: '/historico', label: 'Histórico', icon: History },
    { path: '/graficos', label: 'Gráficos', icon: BarChart3 },
  ];

  const NavLinks = () => (
    <>
      {navItems.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          onClick={() => setIsMobileMenuOpen(false)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            location.pathname === path
              ? 'bg-primary text-primary-foreground shadow-glow'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          )}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </>
  );

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e Título */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Controle Financeiro
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-card border-l border-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="bg-gradient-primary p-2 rounded-lg">
                      <Wallet className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">Menu</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex flex-col space-y-2">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
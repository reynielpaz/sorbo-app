import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, UtensilsCrossed, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ROUTES } from '@/utils/constants';

interface NavItem {
  label: string;
  icon: React.ElementType;
  route: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', icon: Home, route: ROUTES.HOME },
  { label: 'Menú', icon: UtensilsCrossed, route: ROUTES.MENU },
  { label: 'Carrito', icon: ShoppingBag, route: ROUTES.CART },
  { label: 'Perfil', icon: User, route: ROUTES.PROFILE },
];

interface BottomNavProps {
  cartCount?: number;
}

export function BottomNav({ cartCount = 0 }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-30',
        'bg-sorbo-dark/95 backdrop-blur-lg',
        'border-t border-sorbo-gold/10',
        'h-16 pb-[env(safe-area-inset-bottom)]'
      )}
    >
      <div className="flex items-center justify-around h-full px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.route;
          const Icon = item.icon;
          const isCart = item.route === ROUTES.CART;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full cursor-pointer"
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={cn(
                    'transition-colors duration-200',
                    isActive ? 'text-sorbo-gold' : 'text-sorbo-cream/40'
                  )}
                />
                {/* Badge del carrito */}
                {isCart && cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'absolute -top-1 -right-1',
                      'min-w-5 h-5 px-1',
                      'bg-sorbo-amber text-sorbo-black text-xs font-bold',
                      'rounded-full flex items-center justify-center'
                    )}
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </motion.span>
                )}
              </div>
              <span
                className={cn(
                  'text-[10px] transition-colors duration-200',
                  isActive ? 'text-sorbo-gold font-medium' : 'text-sorbo-cream/40'
                )}
              >
                {item.label}
              </span>
              {/* Dot indicator del tab activo */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-1 w-1 h-1 bg-sorbo-gold rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

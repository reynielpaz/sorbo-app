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
        'fixed left-[14px] right-[14px] z-30',
        'bottom-[calc(env(safe-area-inset-bottom)+14px)] h-[65px]',
        'rounded-[22px] border border-white/[0.06] bg-[rgba(10,10,10,0.75)] backdrop-blur-[20px]',
        'shadow-[0_-2px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]'
      )}
    >
      <div className="flex h-full items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.route;
          const Icon = item.icon;
          const isCart = item.route === ROUTES.CART;

          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              className="flex h-full flex-1 cursor-pointer flex-col items-center justify-center"
            >
              {isActive ? (
                <motion.div
                  layoutId="nav-indicator"
                  transition={{ duration: 0.2 }}
                  className="relative flex h-[42px] w-[42px] items-center justify-center rounded-[14px] bg-gradient-to-br from-[#D4A853] to-[#B8923A] shadow-[0_4px_16px_rgba(212,168,83,0.35)]"
                >
                  <Icon size={20} className="text-[#0B0F1A]" />
                  {isCart && cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sorbo-amber px-1 text-[9px] font-bold text-sorbo-black"
                    >
                      {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                  )}
                </motion.div>
              ) : (
                <>
                  <div className="relative">
                    <Icon size={20} className="text-white/35 transition-colors duration-200" />
                    {isCart && cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-2 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sorbo-amber px-1 text-[9px] font-bold text-sorbo-black"
                      >
                        {cartCount > 99 ? '99+' : cartCount}
                      </motion.span>
                    )}
                  </div>
                  <span className="mt-1 text-[9px] font-medium text-white/40">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

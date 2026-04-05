import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Home, User, UtensilsCrossed } from 'lucide-react';
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
  { label: 'Reservas', icon: CalendarDays, route: ROUTES.RESERVATIONS },
  { label: 'Perfil', icon: User, route: ROUTES.PROFILE },
];

export function BottomNav() {
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
                </motion.div>
              ) : (
                <>
                  <div className="relative">
                    <Icon size={20} className="text-white/35 transition-colors duration-200" />
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

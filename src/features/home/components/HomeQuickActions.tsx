import { useNavigate } from 'react-router-dom';
import { ROUTES, getCategoryIcon } from '@/utils/constants';

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'menu-completo',
    title: 'Menú completo',
    subtitle: 'Todo Sorbo en un vistazo',
    icon: '🍽️',
    href: ROUTES.MENU,
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    subtitle: 'Frías, clásicas y de autor',
    icon: getCategoryIcon('bebidas'),
    href: `${ROUTES.MENU}?category=bebidas`,
  },
  {
    id: 'postres',
    title: 'Postres',
    subtitle: 'El cierre dulce del antojo',
    icon: getCategoryIcon('postres'),
    href: `${ROUTES.MENU}?category=postres`,
  },
  {
    id: 'hamburguesas',
    title: 'Hamburguesas',
    subtitle: 'Las favoritas de la casa',
    icon: getCategoryIcon('hamburguesas'),
    href: `${ROUTES.MENU}?category=hamburguesas`,
  },
];

export function HomeQuickActions() {
  const navigate = useNavigate();

  return (
    <section className="mt-7 px-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4A853]/75">Accesos rápidos</p>
          <h2 className="mt-2 font-playfair text-[20px] font-semibold text-white/92">Muévete por Sorbo</h2>
        </div>
        <p className="max-w-[10rem] text-right text-[11px] leading-5 text-white/45">Atajos pensados para pedir más rápido.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => navigate(action.href)}
            className="group min-h-[138px] rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] px-4 py-4 text-left shadow-[0_18px_40px_rgba(0,0,0,0.24)] transition-[transform,border-color,background,box-shadow] duration-200 hover:-translate-y-[1px] hover:border-[rgba(212,168,83,0.24)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_100%)]"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-[rgba(12,12,14,0.78)] text-[20px] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                {action.icon}
              </span>
              <span className="text-[12px] text-[#D4A853] transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </div>

            <div className="mt-5">
              <h3 className="font-playfair text-[18px] font-semibold text-white/92">{action.title}</h3>
              <p className="mt-1.5 text-[12px] leading-5 text-white/55">{action.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

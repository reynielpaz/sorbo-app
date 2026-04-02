import { Link } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';

interface CollectionItem {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  imagePosition?: string;
  overlayClassName?: string;
}

const COLLECTIONS: CollectionItem[] = [
  {
    id: 'bebidas-autor',
    eyebrow: 'Selección 01',
    title: 'El café se sirve mejor aquí',
    description: 'Sabores intensos, cremosos y elegantes para cualquier momento del día.',
    href: `${ROUTES.MENU}?category=bebidas`,
    imageUrl: '/images/hero/hero-coffee-splash.png',
    imagePosition: 'center 58%',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(28,17,7,0.24)_34%,rgba(0,0,0,0.82)_100%)]',
  },
  {
    id: 'antojos-casa',
    eyebrow: 'Selección 02',
    title: 'Antojos de la casa',
    description: 'Hamburguesas, postres y favoritos que siempre provocan.',
    href: ROUTES.MENU,
    imageUrl: '/images/hero/hero-burger-splash.png',
    imagePosition: 'center',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.82)_100%)]',
  },
];

export function HomeCollections() {
  return (
    <section className="mt-7 px-5">
      <div className="mb-5">
        <p className="text-[11px] uppercase tracking-[0.24em] text-[#D4A853]/75">COLECCIONES SORBO</p>
        <h2 className="mt-2 font-playfair text-[24px] font-semibold text-white/92">Elige tu próximo favorito</h2>
        <p className="mt-2 max-w-[32ch] text-[13px] leading-6 text-white/56">
          Descubre lo mejor de Sorbo en cada antojo.
        </p>
      </div>

      <div className="grid gap-4">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.id}
            to={collection.href}
            className="group relative flex min-h-[220px] overflow-hidden rounded-[30px] border border-white/10 shadow-[0_24px_50px_rgba(0,0,0,0.28)]"
          >
            <img
              src={collection.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ objectPosition: collection.imagePosition ?? 'center' }}
            />
            <div
              className={`absolute inset-0 ${
                collection.overlayClassName ??
                'bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.82)_100%)]'
              }`}
            />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(232,214,173,0.42),transparent)]" />

            <div className="relative mt-auto w-full px-5 pb-5 pt-12">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#E8D6AD]/80">
                  <span className="h-px w-6 bg-[#D4A853]/70" />
                  {collection.eyebrow}
                </span>
                <span className="text-[13px] text-[#D4A853] transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <h3 className="max-w-[14ch] font-playfair text-[28px] font-semibold leading-[1.02] text-white/95">
                {collection.title}
              </h3>
              <p className="mt-2 max-w-[28ch] text-[13px] leading-6 text-white/72">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

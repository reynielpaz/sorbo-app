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
    description: 'Café y bebidas para una pausa con intención.',
    href: `${ROUTES.MENU}?category=bebidas`,
    imageUrl: '/images/hero/hero-coffee-splash.png',
    imagePosition: 'center 58%',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(5,7,11,0.28)_38%,rgba(0,0,0,0.78)_100%)]',
  },
  {
    id: 'antojos-casa',
    eyebrow: 'Selección 02',
    title: 'Antojos de la casa',
    description: 'Favoritos para resolver el antojo.',
    href: ROUTES.MENU,
    imageUrl: '/images/hero/hero-burger-splash.png',
    imagePosition: 'center',
    overlayClassName:
      'bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.34)_36%,rgba(0,0,0,0.82)_100%)]',
  },
];

export function HomeCollections() {
  return (
    <section className="mt-5 px-5">
      <div className="mb-3">
        <h2 className="font-playfair text-[20px] font-semibold text-white/92">Colecciones Sorbo</h2>
        <p className="mt-1 max-w-[28ch] text-[12px] leading-5 text-white/42">
          Favoritos para elegir rápido.
        </p>
      </div>

      <div className="grid gap-3">
        {COLLECTIONS.map((collection) => (
          <Link
            key={collection.id}
            to={collection.href}
            className="group relative flex min-h-[160px] overflow-hidden rounded-[22px] border border-white/[0.05] shadow-[0_14px_28px_rgba(0,0,0,0.2)]"
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
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]" />

            <div className="relative mt-auto w-full px-4 pb-4 pt-10">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-[#D4A853]/74">
                  <span className="h-px w-5 bg-[#D4A853]/56" />
                  {collection.eyebrow}
                </span>
                <span className="text-[12px] text-[#D4A853] transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </div>

              <h3 className="max-w-[14ch] font-playfair text-[22px] font-semibold leading-[1.05] text-white/95">
                {collection.title}
              </h3>
              <p className="mt-1.5 max-w-[28ch] text-[12px] leading-5 text-white/62">{collection.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

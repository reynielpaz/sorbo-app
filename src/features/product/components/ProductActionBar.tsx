import { ArrowUpRight, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';
import { WHATSAPP_NUMBER } from '@/utils/constants';
import { formatPrice } from '@/utils/formatPrice';

interface ProductActionBarProps {
  product: Product;
}

function buildWhatsAppHref(product: Product) {
  const message = `Hola, quiero pedir ${product.name}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function ProductActionBar({ product }: ProductActionBarProps) {
  const whatsappHref = buildWhatsAppHref(product);

  return (
    <section className="overflow-hidden rounded-[30px] border border-white/[0.07] bg-[linear-gradient(180deg,rgba(15,18,25,0.98)_0%,rgba(9,12,18,0.98)_100%)] p-4 shadow-[0_24px_48px_rgba(0,0,0,0.24)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.26em] text-white/42">
            Pedido directo
          </p>
          <p className="mt-2 truncate text-[16px] font-medium text-white/88">
            {product.name}
          </p>
          <p className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[#F3D7A0]">
            {formatPrice(product.price)}
          </p>
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#E8D6AD_0%,#D4A853_50%,#B8923A_100%)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#140F08] shadow-[0_16px_28px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
        >
          <MessageCircle size={16} strokeWidth={2.2} />
          Pedir por WhatsApp
          <ArrowUpRight size={14} strokeWidth={2.2} />
        </a>
      </div>
    </section>
  );
}

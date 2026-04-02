import type { ReactNode } from 'react';

interface SocialLinkItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="currentColor">
      <path d="M14.1 3.5c.46 2.06 1.62 3.6 3.6 4.32v2.7a7.24 7.24 0 0 1-3.32-1.08v5.48a5.33 5.33 0 1 1-5.33-5.33c.28 0 .56.02.84.07v2.78a2.8 2.8 0 0 0-.84-.12 2.59 2.59 0 1 0 2.59 2.6V3.5h2.46Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11.7a8 8 0 1 1-14.2-4.95A8 8 0 0 1 20 11.7Z" />
      <path d="m7.4 19.1-2.1 1 .83-2.28" />
      <path d="M15.7 13.9c-.24.67-1.18 1.1-1.63 1.13-.42.02-.95.03-2.92-.86-2.38-1.06-3.9-3.62-4.02-3.79-.11-.17-.96-1.28-.96-2.44 0-1.15.61-1.72.82-1.96.2-.24.45-.3.6-.3h.43c.14 0 .34-.05.53.4.2.48.66 1.65.72 1.77.06.12.1.26.02.42-.08.17-.12.27-.25.41-.12.14-.26.31-.37.42-.12.12-.24.25-.1.5.14.24.62 1.03 1.34 1.68.92.81 1.7 1.07 1.94 1.2.24.12.38.1.52-.07.14-.17.58-.67.74-.9.16-.24.32-.2.54-.12.23.07 1.42.67 1.66.79.24.12.4.18.45.28.05.1.05.59-.2 1.26Z" />
    </svg>
  );
}

const SOCIAL_LINKS: SocialLinkItem[] = [
  {
    id: 'instagram',
    label: 'Instagram',
    href: 'https://www.instagram.com/sorbo.ve',
    icon: <InstagramIcon />,
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    href: 'https://www.tiktok.com/@sorbo.ve',
    icon: <TikTokIcon />,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    href: 'https://wa.me/584221000292',
    icon: <WhatsAppIcon />,
  },
];

export function HomeSocialLinks() {
  return (
    <section className="mt-8 px-5">
      <div className="flex items-center justify-center gap-3">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(16,16,18,0.94)_100%)] text-white/78 shadow-[0_14px_24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.04)] transition-[transform,border-color,color,background] duration-200 hover:-translate-y-[1px] hover:border-[rgba(212,168,83,0.18)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(18,18,20,0.96)_100%)] hover:text-[#E8D6AD]"
          >
            {link.icon}
          </a>
        ))}
      </div>
    </section>
  );
}

export function HomeCredits() {
  return (
    <section className="mt-6 px-5">
      <div className="mx-auto max-w-sm border-t border-white/8 pt-4 text-center text-[11px] text-white/46">
        <span>Desarrollado con </span>
        <span aria-hidden="true" className="text-[#D4A853]/76">
          ♥
        </span>
        <span> por </span>
        <a
          href="https://www.opensyntheai.com"
          target="_blank"
          rel="noreferrer"
          className="text-white/68 transition-colors duration-200 hover:text-[#E8D6AD]"
        >
          OpenSyntheAI
        </a>
      </div>
    </section>
  );
}

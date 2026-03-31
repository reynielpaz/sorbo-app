import { Providers } from './Providers';
import { Router } from './Router';

export function App() {
  return (
    <Providers>
      {/* ===== FONDO DARK LUXURY GLOBAL ===== */}
      <div className="fixed inset-0 z-0 bg-[#0B0F1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_92%_90%_at_50%_48%,#000000_0%,rgba(0,0,0,0.65)_42%,rgba(0,0,0,0.25)_72%,transparent_92%)]" />
      </div>

      {/* ===== CONTENIDO DE LA APP ===== */}
      <div className="relative z-[1]">
        <Router />
      </div>
    </Providers>
  );
}
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * ErrorBoundary global de la app.
 *
 * Captura excepciones de renderizado en cualquier punto del árbol y muestra
 * un fallback Dark Luxury en lugar de dejar la pantalla en blanco. Es un
 * componente de clase porque React solo soporta error boundaries vía
 * `getDerivedStateFromError` / `componentDidCatch`.
 *
 * El fallback es deliberadamente autónomo (sin framer-motion, router ni
 * iconos externos) para que no pueda fallar a su vez si el error provino de
 * alguna de esas dependencias.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[Sorbo] ErrorBoundary capturó un error de renderizado:', error, errorInfo);
    }
  }

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        role="alert"
        className="fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-[#03060A] px-6 text-center"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_82%_60%_at_50%_38%,rgba(0,0,0,0.45),transparent_72%)]" />
          <div className="absolute left-1/2 top-[34%] h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.1)_0%,rgba(212,168,83,0)_70%)] blur-2xl" />
        </div>

        <div className="relative z-[1] flex w-full max-w-[360px] flex-col items-center">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] border border-[rgba(212,168,83,0.18)] bg-black/[0.32] text-[#D4A853]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h1 className="font-playfair text-[30px] font-semibold leading-tight text-sorbo-cream">
            Algo se interrumpió
          </h1>
          <p className="mt-3 text-[14px] leading-6 text-white/55">
            Tuvimos un inconveniente inesperado al mostrar esta sección. Recarga la app para
            volver a tu experiencia Sorbo.
          </p>

          <button
            type="button"
            onClick={this.handleReload}
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[linear-gradient(135deg,#E8C068_0%,#D4A853_48%,#B8923A_100%)] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#120E09] transition-transform duration-200 hover:-translate-y-0.5"
          >
            Recargar la app
          </button>
        </div>
      </div>
    );
  }
}

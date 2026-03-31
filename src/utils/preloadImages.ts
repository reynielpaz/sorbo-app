/**
 * Precarga una lista de URLs de imagen en el browser cache.
 * No bloquea — todas las imágenes se cargan en paralelo.
 */
export function preloadImages(urls: string[]): void {
  urls.forEach((url) => {
    if (!url) return;
    const img = new Image();
    img.src = url;
  });
}

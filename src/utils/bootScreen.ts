const BOOT_SCREEN_ID = 'app-boot-screen';

export function hideBootScreen() {
  if (typeof document === 'undefined') return;
  document.getElementById(BOOT_SCREEN_ID)?.remove();
}

export function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!menuToggle || !mobileNav) return;

  const setMenuState = (isOpen) => {
    menuToggle.classList.toggle('menu-open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
  };

  const closeMenu = () => {
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    setMenuState(false);
  };

  const openMenu = () => {
    mobileNav.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    setMenuState(true);
  };

  menuToggle.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) closeMenu();
    else openMenu();
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMenu();
  });
}

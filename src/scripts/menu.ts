document.querySelector('.hamburger')?.addEventListener('click', () => {
  document
    .querySelector('.mobile-nav .nav-links')
    ?.classList.toggle('expanded');
});

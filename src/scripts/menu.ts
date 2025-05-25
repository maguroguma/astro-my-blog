document.querySelector('.hamburger')?.addEventListener('click', () => {
  const navLinks = document.querySelector('.mobile-nav .nav-links');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  if (!navLinks || !hamburgerIcon) {
    return;
  }

  // メニューの展開状態を切り替え
  navLinks.classList.toggle('expanded');

  // アイコンの切り替え
  if (hamburgerIcon.classList.contains('fa-bars')) {
    hamburgerIcon.classList.replace('fa-bars', 'fa-times'); // バッテンアイコン
  } else {
    hamburgerIcon.classList.replace('fa-times', 'fa-bars'); // ハンバーガーアイコン
  }
});

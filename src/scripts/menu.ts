document.querySelector('.hamburger')?.addEventListener('click', () => {
  const navLinks = document.querySelector('.mobile-nav .nav-links');
  const hamburgerIcon = document.getElementById('hamburgerIcon');

  // メニューの展開状態を切り替え
  navLinks?.classList.toggle('expanded');

  // アイコンの切り替え
  if (hamburgerIcon?.classList.contains('fa-bars')) {
    hamburgerIcon.classList.remove('fa-bars');
    hamburgerIcon.classList.add('fa-times'); // バッテンアイコン
  } else {
    hamburgerIcon?.classList.remove('fa-times');
    hamburgerIcon?.classList.add('fa-bars'); // ハンバーガーアイコン
  }
});

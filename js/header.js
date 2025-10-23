let lastScrollY = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (!header) return;
  if (currentScrollY > lastScrollY) {
    header.style.top = '124px';
  } else {
    header.style.top = '0';
  }
  lastScrollY = currentScrollY;
});

const hammenuBtn = document.querySelector('.ham_menu'); // 존재하면 아래에서 사용
// nav hover
const mainMenus = document.querySelectorAll('nav ul.gnb > li > a');
const bottomNav = document.querySelector('.ham_bottom');
const nav = document.querySelector('nav');

function handleNavEvent(e) {
  if (e.type === 'mouseenter') nav.classList.add('on');
  if (e.type === 'mouseleave') nav.classList.remove('on');
}

if (bottomNav) {
  ['mouseenter', 'mouseleave'].forEach(event =>
    bottomNav.addEventListener(event, handleNavEvent)
  );
}

const lilis = document.querySelectorAll('header nav ul.gnb > li');
function handleResize() {
  if (window.innerWidth <= 768) {
    mainMenus.forEach(menu => menu.removeAttribute('href'));
    ['mouseenter', 'mouseleave'].forEach(event =>
      bottomNav?.removeEventListener(event, handleNavEvent)
    );
    lilis.forEach(lili => {
      // 모바일에서 서브메뉴 토글 (중복 바인딩 방지)
      if (!lili.__hasMobileClick) {
        lili.addEventListener('click', (e) => {
          e.preventDefault();
          lili.classList.toggle('on');
        });
        lili.__hasMobileClick = true;
      }
    });

  } else if (window.innerWidth <= 1280) {
    mainMenus.forEach(menu => menu.removeAttribute('href'));
  } else {
    ['mouseenter', 'mouseleave'].forEach(event =>
      bottomNav?.addEventListener(event, handleNavEvent)
    );
  }
}

handleResize();
window.addEventListener('resize', handleResize);

const searchBtn = document.querySelector('.nav_right .search');
const searchTab = document.querySelector('.search_tab');
const searchCloseBtn = document.querySelector('.search_tab .close');


searchBtn.addEventListener('click', () => {
    searchTab.classList.add('open');
    searchCloseBtn.classList.add('close');
})

const footerBtn = document.querySelector('.f_nav button');
const footerMenu = document.querySelector('.f_nav ul');

footerBtn?.addEventListener('click', function () {
  footerMenu.classList.toggle('down');
  footerBtn.style.transform = footerMenu.classList.contains('down')
    ? 'rotate(180deg)'
    : 'rotate(0deg)';
  footerBtn.style.transition = 'transform 0.3s ease';
});


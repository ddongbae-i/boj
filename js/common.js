//header
let lastScrollY = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
        header.style.top = '124px';
    } else {
        header.style.top = '0';
    }
    lastScrollY = currentScrollY;
});

// 햄버거 메뉴
const hammenuBtn = document.querySelector('.ham_menu');
hammenuBtn.addEventListener('click', () => {
    header.classList.toggle('on');
});

// nav hover
const mainMenus = document.querySelectorAll('nav ul.gnb > li > a');
const bottomNav = document.querySelector('.ham_bottom');
const nav = document.querySelector('nav');

// ✅ 한 번에 관리되는 이벤트 함수
function handleNavEvent(e) {
    if (e.type === 'mouseenter') nav.classList.add('on');
    if (e.type === 'mouseleave') nav.classList.remove('on');
}

// ✅ 이벤트 등록
['mouseenter', 'mouseleave'].forEach(event =>
    bottomNav.addEventListener(event, handleNavEvent)
);
const lilis = document.querySelectorAll('header nav ul.gnb > li');
function handleResize() {
    if (window.innerWidth <= 768) {
        console.log('resize 768');
        mainMenus.forEach(menu => menu.removeAttribute('href'));
        // ✅ 모바일에서는 이벤트 제거
        ['mouseenter', 'mouseleave'].forEach(event =>
            bottomNav.removeEventListener(event, handleNavEvent)
        );
        lilis.forEach(lili => {
            // 모바일에서 서브메뉴 토글
            lili.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('click');
                lili.classList.toggle('on');
            });
        })

    } else if (window.innerWidth <= 1280) {
        console.log('resize 1280');
        mainMenus.forEach(menu => menu.removeAttribute('href'));
    } else {
        console.log('resize desktop');

        // ✅ 데스크탑에서는 다시 이벤트 복원
        ['mouseenter', 'mouseleave'].forEach(event =>
            bottomNav.addEventListener(event, handleNavEvent)
        );
    }
}

handleResize();
window.addEventListener('resize', handleResize);

// search
const searchBtn = document.querySelector('.nav_right .search');
const searchTab = document.querySelector('.search_tab');
const closeBtn = document.querySelector('.search_tab .close');

searchBtn.addEventListener('click', () => {
    searchTab.classList.add('open');
});

closeBtn.addEventListener('click', () => {
    searchTab.classList.remove('open');
});

// footer menu btn
const footerBtn = document.querySelector('.f_nav button');
const footerMenu = document.querySelector('.f_nav ul');

footerBtn.addEventListener('click', function () {
    footerMenu.classList.toggle('down');
    footerBtn.style.transform = footerMenu.classList.contains('down')
        ? 'rotate(180deg)'
        : 'rotate(0deg)';
    footerBtn.style.transition = 'transform 0.3s ease';
});

//header
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
        header.style.top = '124px';
    } else {
        header.style.top = '0';
    }

    lastScrollY = currentScrollY
})

//header

const hammenuBtn = document.querySelector('.ham_menu');
const header = document.querySelector('header')
hammenuBtn.addEventListener('click', () => {
    header.classList.toggle('on');
})


const mainMenus = document.querySelectorAll('nav ul.gnb>li>a');
function handleResize() {
    if (window.innerWidth <= 1280) {
        // 링크 비활성화
        mainMenus.forEach((menu) => {
            menu.removeAttribute("href");
        });
        // 1024 이하일 때 동작
    } else {

        // 1024 초과일 때 동작
    }
}
window.addEventListener("DOMContentLoaded", handleResize);
window.addEventListener("resize", handleResize);


//search
const searchBtn = document.querySelector('.nav_right .search');
const searchTab = document.querySelector('.search_tab');
const closeBtn = document.querySelector('.search_tab .close');

searchBtn.addEventListener('click', () => {
    searchTab.classList.add('open');
})

closeBtn.addEventListener('click', () => {
    searchTab.classList.remove('open');
})

const bottomNav = document.querySelector('.ham_bottom');
const nav = document.querySelector('nav');
bottomNav.addEventListener('mouseenter', () => {
    nav.classList.add('on');
});
bottomNav.addEventListener('mouseleave', () => {
    nav.classList.remove('on');
});




//footer menu btn

const footerBtn = document.querySelector('.f_nav button');
const footerMenu = document.querySelector('.f_nav ul');

footerBtn.addEventListener('click', function () {
    footerMenu.classList.toggle('down');
    if (footerMenu.classList.contains('down')) {
        footerBtn.style.transform = 'rotate(180deg)';
    } else {
        footerBtn.style.transform = 'rotate(0deg)';
    }

    footerBtn.style.transition = 'transform 0.3s ease';
})



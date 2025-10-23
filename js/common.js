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

//footer menu btn

const footerBtn = document.querySelector('.f_nav button')
const footerMenu = document.querySelector('.f_nav ul')

footerBtn.addEventListener('click', function () {
    footerMenu.classList.toggle('down')
    if (footerMenu.classList.contains('down')) {
        footerBtn.style.transform = 'rotate(180deg)';
    } else {
        footerBtn.style.transform = 'rotate(0deg)';
    }

    footerBtn.style.transition = 'transform 0.3s ease';
})

const bottomnav = document.querySelector('.ham_bottom');
const nav = document.querySelector('nav');
bottomnav.addEventListener('mouseenter', () => {
    nav.classList.add('on');
});
bottomnav.addEventListener('mouseleave', () => {
    nav.classList.remove('on');
});


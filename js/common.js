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
})


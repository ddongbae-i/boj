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
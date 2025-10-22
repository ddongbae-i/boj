document.addEventListener('DOMContentLoaded', () => {
    let articleCard = new Swiper(".section_3 .slide", {
        effect: "cards",
        grabCursor: true,
        direction: "vertical",
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
    });
})
/* const cards = document.querySelectorAll('.card');
let current = 0;


function updateCards() {
    cards.forEach((card) => card.classList.remove('prev', 'active', 'next'));
    const prev = (current - 1 + cards.length) % cards.length;
    const next = (current + 1) % cards.length;
    cards[current].classList.add('active');
    cards[prev].classList.add('prev');
    cards[next].classList.add('next');
}


function nextCard() {
    current = (current + 1) % cards.length;
    updateCards();
}


let autoSlide = setInterval(nextCard, 3000);


let startX = 0;
const stack = document.querySelector('.card-stack');
stack.addEventListener('mousedown', (e) => (startX = e.clientX));
stack.addEventListener('mouseup', (e) => {
    const diff = e.clientX - startX;
    if (diff < -50) nextCard();
    if (diff > 50) {
        current = (current - 1 + cards.length) % cards.length;
        updateCards();
    }
});


updateCards(); */
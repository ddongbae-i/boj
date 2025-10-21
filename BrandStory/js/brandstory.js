const cards = document.querySelectorAll('.ingredient-card');
let current = 0;

function updateCards() {
    cards.forEach(c => c.classList.remove('prev', 'active', 'next'));
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

setInterval(nextCard, 3000);
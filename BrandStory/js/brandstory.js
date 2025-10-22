// Inline JavaScript for immediate functionality

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Ingredient Carousel Data
const ingredientData = [
    {
        name: 'Ginseng', korean: '인삼', latin: 'Panax ginseng',
        description: 'Revered for centuries as the king of herbs, Korean ginseng delivers powerful antioxidants and essential nutrients to revitalize and strengthen skin\'s natural barrier.',
        benefits: ['Skin revitalization', 'Antioxidant protection', 'Improved elasticity'],
        quote: 'Used in royal courts as the ultimate anti-aging remedy',
        color: '#c1843a'
    },
    {
        name: 'Red Bean', korean: '팥', latin: 'Vigna angularis',
        description: 'Rich in saponins and natural enzymes, red bean gently exfoliates while nourishing skin, revealing a clearer, more radiant complexion.',
        benefits: ['Gentle exfoliation', 'Pore refinement', 'Brightening effect'],
        quote: 'Traditional cleansing ritual of Korean noblewomen',
        color: '#b91c1c'
    },
    {
        name: 'Rice', korean: '쌀', latin: 'Oryza sativa',
        description: 'Fermented rice water, a beauty secret of the Joseon Dynasty, deeply moisturizes and brightens skin while improving overall texture and tone.',
        benefits: ['Deep hydration', 'Skin brightening', 'Texture improvement'],
        quote: 'The secret to porcelain skin in ancient Korea',
        color: '#beaf9a'
    },
    {
        name: 'Green Plum', korean: '청매실', latin: 'Prunus mume',
        description: 'Packed with organic acids and vitamins, green plum extract provides gentle exfoliation and helps maintain skin\'s optimal pH balance.',
        benefits: ['pH balancing', 'Natural AHA source', 'Skin renewal'],
        quote: 'Beloved for its rejuvenating properties in Korean medicine',
        color: '#74822b'
    },
    {
        name: 'Propolis', korean: '프로폴리스', latin: 'Propolis extract',
        description: 'Nature\'s protective resin, propolis offers powerful antibacterial and healing properties while soothing and strengthening sensitive skin.',
        benefits: ['Antibacterial action', 'Skin barrier repair', 'Soothing effect'],
        quote: 'Precious healing elixir from nature',
        color: '#e6a11c'
    },
    {
        name: 'Mugwort', korean: '쑥', latin: 'Artemisia princeps',
        description: 'Sacred herb in Korean culture, mugwort calms inflammation, reduces redness, and provides powerful antioxidant protection for troubled skin.',
        benefits: ['Anti-inflammatory', 'Calming effect', 'Antioxidant rich'],
        quote: 'Traditional remedy for skin purification',
        color: '#1b4805'
    },
    {
        name: 'Green Tea', korean: '녹차', latin: 'Camellia sinensis',
        description: 'Rich in catechins and polyphenols, green tea protects against environmental damage while controlling sebum and refining skin texture.',
        benefits: ['Sebum control', 'UV protection', 'Pore minimizing'],
        quote: 'Essence of longevity in Korean wellness',
        color: '#4b6d2f'
    },
    {
        name: 'Centella Asiatica', korean: '병풀', latin: 'Centella asiatica',
        description: 'Known as "tiger grass" for its legendary healing powers, centella accelerates skin repair, strengthens barriers, and provides deep calming benefits.',
        benefits: ['Wound healing', 'Barrier strengthening', 'Redness reduction'],
        quote: 'The miracle herb of Asian skincare',
        color: '#5f6b3d'
    }
];

let currentIngredient = 0;

const updateIngredient = (index) => {
    const ingredient = ingredientData[index];
    const card = document.querySelector('.ingredient-card');
    if (!card) return;

    const tagLine = card.querySelector('.tag-line');
    const tagSpan = card.querySelector('.tag span');
    const h3 = card.querySelector('.ingredient-text h3');
    const latin = card.querySelector('.latin');
    const description = card.querySelector('.description');
    const benefitsList = card.querySelector('.benefits ul');
    const quote = card.querySelector('.quote');
    const dots = card.querySelectorAll('.carousel-controls .dots .dot');

    if (tagLine) tagLine.style.background = `linear-gradient(90deg, ${ingredient.color}, transparent)`;
    if (tagSpan) tagSpan.style.color = ingredient.color;
    if (h3) h3.textContent = ingredient.name;
    if (latin) latin.textContent = `${ingredient.korean} · ${ingredient.latin}`;
    if (description) description.textContent = ingredient.description;

    if (benefitsList) {
        benefitsList.innerHTML = ingredient.benefits
            .map(benefit => `<li><span class="dot" style="background: ${ingredient.color}"></span>${benefit}</li>`)
            .join('');
    }

    if (quote) quote.textContent = `"${ingredient.quote}"`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        if (i === index) dot.style.background = ingredient.color;
    });
};

// Carousel controls
const prevBtn = document.querySelector('.carousel-controls button:first-child');
const nextBtn = document.querySelector('.carousel-controls button:last-child');

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        currentIngredient = (currentIngredient - 1 + ingredientData.length) % ingredientData.length;
        updateIngredient(currentIngredient);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentIngredient = (currentIngredient + 1) % ingredientData.length;
        updateIngredient(currentIngredient);
    });
}

// Header scroll effect
const header = document.querySelector('.gnb');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        header.style.background = 'rgba(251, 248, 242, 0.95)';
    } else {
        header.style.boxShadow = 'none';
        header.style.background = 'var(--bg-cream)';
    }

    if (currentScroll > lastScroll && currentScroll > 200) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-center a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent-gold)';
        }
    });
});

// Scroll animations
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.story-card, .ingredient-card, .philosophy-card, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Form handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            form.reset();
        }
    });
});

// Page load animation
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 100);
});

// Initialize
updateIngredient(0);

// Auto-play carousel
setInterval(() => {
    currentIngredient = (currentIngredient + 1) % ingredientData.length;
    updateIngredient(currentIngredient);
}, 5000);
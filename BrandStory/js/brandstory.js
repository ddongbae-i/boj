// GSAP 확장 버전: 배경 변경 제거, 인터랙션 강화 전용

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', function () {
    console.log('🎯 Interaction-only GSAP Active!');

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length === 0) return;

    timelineItems.forEach((item) => {
        const textBox = item.querySelector('.timeline-text');
        const icon = item.querySelector('.timeline-icon');

        if (textBox) {
            gsap.set(textBox, {
                opacity: 0,
                y: 60,
                x: item.classList.contains('reverse') ? 40 : -40,
            });

            gsap.to(textBox, {
                opacity: 1,
                y: 0,
                x: 0,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });

            const inner = textBox.querySelectorAll('time, h4, p');
            gsap.set(inner, { opacity: 0, y: 15 });
            gsap.to(inner, {
                opacity: 1,
                y: 0,
                stagger: 0.12,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: textBox,
                    start: 'top 75%',
                },
            });
        }

        if (icon) {
            item.addEventListener('mouseenter', () => {
                gsap.to(icon, {
                    scale: 1.15,
                    rotate: 5,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                    duration: 0.3,
                    ease: 'back.out(1.7)',
                });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(icon, {
                    scale: 1,
                    rotate: 0,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    duration: 0.3,
                    ease: 'power2.out',
                });
            });
        }
    });

    ScrollTrigger.refresh();
    console.log('✅ Interaction-only timeline complete!');
});

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('.gallery-row');
    rows.forEach((row, i) => {
        const originalItems = row.innerHTML;
        row.innerHTML = originalItems + originalItems + originalItems;

        gsap.to(row, {
            xPercent: -33,
            duration: 20 + i * 5,
            repeat: -1,
            ease: 'none',
        });

        gsap.from(row, {
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: row,
                start: 'top 85%',
            },
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const legacySection = document.querySelector('.legacy-section');
    const legacyHeader = document.querySelector('.legacy-header');

    if (legacySection && legacyHeader) {
        legacyHeader.addEventListener('click', function (e) {
            if (window.innerWidth <= 1024) {
                e.stopPropagation();
                const active = legacySection.classList.toggle('active');

                if (active) {
                    gsap.fromTo(
                        legacySection,
                        { height: 0, opacity: 0 },
                        { height: 'auto', opacity: 1, duration: 0.6, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(legacySection, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.inOut',
                    });
                }
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 1024) {
                legacySection.classList.remove('active');
                gsap.set(legacySection, { height: 'auto', opacity: 1 });
            }
        });

        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 1024 && !e.target.closest('.legacy-section')) {
                legacySection.classList.remove('active');
                gsap.to(legacySection, { height: 0, opacity: 0, duration: 0.4 });
            }
        });
    }
});

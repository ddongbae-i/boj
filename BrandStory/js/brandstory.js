
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', function () {
    console.log('🎯 Fixed Timeline with Scrolling Text!');

    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timelineItems.length === 0) {
        console.error('Timeline elements not found!');
        return;
    }


    timelineItems.forEach((item, index) => {
        const textBox = item.querySelector('.timeline-text');

        if (!textBox) return;


        gsap.set(textBox, {
            opacity: 0,
            x: item.classList.contains('reverse') ? 50 : -50
        });


        gsap.to(textBox, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: item,
                start: 'top 60%',
                end: 'top 40%',
                scrub: 1,
                markers: false
            }
        });

        const time = textBox.querySelector('time');
        const heading = textBox.querySelector('h4');
        const paragraph = textBox.querySelector('p');

        if (time && heading && paragraph) {
            gsap.set([time, heading, paragraph], { opacity: 0, y: 10 });

            gsap.to([time, heading, paragraph], {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 60%',
                    end: 'top 30%',
                    scrub: 1
                }
            });
        }
    });


    timelineItems.forEach((item) => {
        const icon = item.querySelector('.timeline-icon');

        if (!icon) return;

        item.addEventListener('mouseenter', () => {
            gsap.to(icon, {
                scale: 1.15,
                boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                duration: 0.3
            });
        });

        item.addEventListener('mouseleave', () => {
            gsap.to(icon, {
                scale: 1,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                duration: 0.3
            });
        });
    });

    ScrollTrigger.refresh();
    console.log('✅ Timeline animation complete!');
});

window.addEventListener('resize', () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.refresh());
});




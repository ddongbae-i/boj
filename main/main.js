document.addEventListener('DOMContentLoaded', () => {
  const bestTop = new Swiper(".bestSeller .product .slide_wrap1", {
    loop: true,
    slidesPerView: "auto",
    freeMode: true,
    allowTouchMove: false,
    speed: 0,
  });

  const bestBottom = new Swiper(".bestSeller .product .slide_wrap2", {
    loop: true,
    slidesPerView: 'auto',
    freeMode: true,
    allowTouchMove: false,
    speed: 0,
  });

  /* -------------------------------
      ✅ GSAP 무한 흐름
  ------------------------------- */
  const scrollSpeed = 40;
  let tlTop = gsap.timeline({ repeat: -1 });
  let tlBottom = gsap.timeline({ repeat: -1 });

  function animateSwiper(swiper, timeline, direction = "left") {
    const wrapper = swiper.wrapperEl;
    const distance = wrapper.scrollWidth; // ✅ 복제 포함 전체 길이 기준

    gsap.set(wrapper, { x: 0 });

    timeline.to(wrapper, {
      x: direction === "left" ? -distance / 2 : distance / 2,
      duration: scrollSpeed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          const num = parseFloat(x);
          if (direction === "left") return num <= -distance / 2 ? 0 : num;
          else return num >= distance / 2 ? 0 : num;
        }),
      },
    });
  }

  animateSwiper(bestTop, tlTop, "left");
  animateSwiper(bestBottom, tlBottom, "right");


  /* -------------------------------
       🟣 hover 시 흐름 멈춤 / 재개
   ------------------------------- */
  const productEl = document.querySelector(".bestSeller .product");

  productEl.addEventListener("mouseenter", () => {
    gsap.to([tlTop, tlBottom], {
      timeScale: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  });

  productEl.addEventListener("mouseleave", () => {
    gsap.to([tlTop, tlBottom], {
      timeScale: 1,
      duration: 0.4,
      ease: "power2.in",
    });
  });

  /* -------------------------------
      🟣 2. 인플루언서 카드 순차 회전
  ------------------------------- */
  const cards = Array.from(document.querySelectorAll('.influencer .card'));
  if (cards.length) {
    const config = {
      flipMs: 800,
      stayMs: 500,
      gapMs: 120,
      resetDelay: 1000,
    };

    let loopRunning = false;
    let stopLoop = false;
    let isHovered = false;

    const influencerEl = document.querySelector('.influencer');
    if (influencerEl) {
      influencerEl.addEventListener('pointerenter', () => (isHovered = true));
      influencerEl.addEventListener('pointerleave', () => (isHovered = false));
    }

    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

    async function sequentialFlipLoop() {
      if (loopRunning) return;
      loopRunning = true;

      while (!stopLoop) {
        for (const card of cards) {
          if (stopLoop) break;
          while (isHovered && !stopLoop) await sleep(150);
          if (stopLoop) break;

          card.classList.add('flipped');
          await sleep(config.flipMs + config.stayMs + config.gapMs);
        }
        if (stopLoop) break;

        await sleep(config.resetDelay);
        cards.forEach((c) => c.classList.remove('flipped'));
        await sleep(config.flipMs + 300);
      }

      loopRunning = false;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop = true;
      else if (stopLoop) {
        stopLoop = false;
        sequentialFlipLoop();
      }
    });

    sequentialFlipLoop();
  }

  /* -------------------------------
      🟣 3. 인플루언서 찜(하트) 기능
  ------------------------------- */
  const KEY = 'wish:list';
  const store = JSON.parse(localStorage.getItem(KEY) || '{}');

  const getId = (btn) => {
    if (btn.dataset.id) return btn.dataset.id;
    const card = btn.closest('.card');
    if (!card) return null;
    const idClass = [...card.classList].find((c) => /^card_\d+$/.test(c));
    return idClass || null;
  };

//             const flipOnce = (el) => {
//                 el.classList.remove('do-flip');
//                 void el.offsetWidth; // 강제 리플로우
//                 el.classList.add('do-flip');
//                 setTimeout(() => el.classList.remove('do-flip'), DURATION);
//             };

  document.querySelectorAll('.influencer .wish').forEach((btn) => {
    const id = getId(btn);
    const on = id ? store[id] === true : false;
    applyState(btn, on);

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const nowOn = !btn.classList.contains('active');
      applyState(btn, nowOn);
      const key = getId(btn);
      if (key) {
        store[key] = nowOn;
        localStorage.setItem(KEY, JSON.stringify(store));
      }
    });
  });
});

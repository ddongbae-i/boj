document.addEventListener('DOMContentLoaded', () => {
<<<<<<< HEAD
    const KEY = 'wish:list';
    const store = JSON.parse(localStorage.getItem(KEY) || '{}');

    const getId = (btn) => {
        if (btn.dataset.id) return btn.dataset.id;
        const card = btn.closest('.card');
        if (!card) return null;
        // .card card_7 처럼 붙어있는 클래스에서 card_숫자 찾기
        const idClass = [...card.classList].find(c => /^card_\d+$/.test(c));
        return idClass || null;
    };

    const applyState = (btn, on) => {
        btn.classList.toggle('active', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    };

    document.querySelectorAll('.influencer .wish').forEach(btn => {
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


// 카드 360도 회전
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // .influencer 섹션의 모든 카드 대상 (DOM 순서대로)
  const cards = Array.from(document.querySelectorAll('.influencer .card'));
  if (!cards.length) return;

  const DURATION = 800; // CSS 애니메이션 시간과 동일(ms)
  const GAP = 400;      // 다음 카드로 넘어가기 전 텀(ms)
  const STEP = DURATION + GAP;

  let i = 0;

  const spinOnce = (el) => {
    // 재트리거: 제거 -> 강제리플로우 -> 추가
    el.classList.remove('do-spin');
    void el.offsetWidth; // 강제 리플로우
    el.classList.add('do-spin');

    // 끝나면 클래스 제거(다음에 또 돌릴 수 있게)
    setTimeout(() => el.classList.remove('do-spin'), DURATION);
  };

  // 뷰포트 안에 있을 때만 돌리기(선택)
  let running = true;
  const root = document.querySelector('.influencer');
  if (root && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      running = entries.some(e => e.isIntersecting);
    }, { threshold: 0.1 });
    io.observe(root);
  }

  // 첫 시작
  spinOnce(cards[i]);

  // 순차 루프
  setInterval(() => {
    if (!running) return;
    i = (i + 1) % cards.length;
    spinOnce(cards[i]);
  }, STEP);
});


// 카드 순차 플립 루프
// document.addEventListener('DOMContentLoaded', () => {
//     const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//     if (!reduce) {
//         let cards = Array.from(document.querySelectorAll('.influencer .card[data-aos="flip-left"]'));
//         if (!cards.length) cards = Array.from(document.querySelectorAll('.influencer .card'));
//         if (cards.length) {
//             const DURATION = 600; // CSS와 동일
//             const GAP = 400;
//             const STEP = DURATION + GAP;
//             let i = 0;
=======
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
>>>>>>> 0ae06dc4369854816759b954fff464470db4e128

//             const flipOnce = (el) => {
//                 el.classList.remove('do-flip');
//                 void el.offsetWidth; // 강제 리플로우
//                 el.classList.add('do-flip');
//                 setTimeout(() => el.classList.remove('do-flip'), DURATION);
//             };

<<<<<<< HEAD
//             // (옵션) 화면 안에 있을 때만
//             let running = true;
//             const influencer = document.querySelector('.influencer');
//             if (influencer && 'IntersectionObserver' in window) {
//                 const io = new IntersectionObserver((entries) => {
//                     running = entries.some(e => e.isIntersecting);
//                 }, { threshold: 0.1 });
//                 io.observe(influencer);
//             }

//             // 첫 장 시작
//             setTimeout(() => flipOnce(cards[i]), 0);

//             // 순차 루프
//             setInterval(() => {
//                 if (!running) return;
//                 i = (i + 1) % cards.length;
//                 flipOnce(cards[i]);
//             }, STEP);
//         }
//     }
// });
=======
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
>>>>>>> 0ae06dc4369854816759b954fff464470db4e128

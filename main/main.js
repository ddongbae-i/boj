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

  const applyState = (btn, on) => {
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  };

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


 /* -------------------------------
      한방 ON 상황
  ------------------------------- */


// document.addEventListener("DOMContentLoaded", function () {
//   const buttons = document.querySelectorAll(".txt_left ul button, .txt_right ul button");
//   const txtBoxes = document.querySelectorAll(".txt_left ul, .txt_right ul");
//   const imgBoxes = document.querySelectorAll(".img_box > div");

//   buttons.forEach((button, index) => {
//     button.addEventListener("click", function () {
//       // 모든 텍스트 영역에서 .on 제거
//       txtBoxes.forEach(box => box.classList.remove("on"));

//       // 클릭한 텍스트 박스에 .on 추가
//       txtBoxes[index].classList.add("on");

//       // 모든 이미지 숨기기
//       imgBoxes.forEach(img => img.style.display = "none");

//       // 해당 이미지 보이기
//       imgBoxes[index].style.display = "block";
//     });
//   });
// });


 /* -------------------------------
      한방 이미지 ON 상황
------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const txtBoxes = document.querySelectorAll(".hanbang .txt_left ul, .hanbang .txt_right ul");
  const imgBoxes = document.querySelectorAll(".hanbang .inner .img_box img, .hanbang .inner .img_box>div .imgTxt li");
  let currentIndex = 0;
  const total = txtBoxes.length;

  function updateState(index) {
    // 모든 txt 요소에서 .on 제거
    txtBoxes.forEach(txt => txt.classList.remove("on"));
    // 현재 txt에 .on 추가
    txtBoxes[index].classList.add("on");

    // 모든 이미지 숨김
    imgBoxes.forEach(img => img.style.display = "none");
    // 현재 이미지 보이기
    if (imgBoxes[index]) {
      imgBoxes[index].style.display = "block";
    }
  }

  // 최초 1회 실행
  updateState(currentIndex);

  // 자동 순환
  setInterval(() => {
    currentIndex = (currentIndex + 1) % total;
    updateState(currentIndex);
  }, 4000); // 4초마다 전환
});


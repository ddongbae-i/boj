// 베스트셀러 스와이프 (top / bottom 각각 초기화)
const bestTop = new Swiper('.bestSeller .product .slide_wrap:nth-of-type(1)', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,
  speed: 9000,
  freeMode: { enabled: true, momentum: false },
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true, // 변경: 마우스 호버시 자동 일시정지
    reverseDirection: false
  },
  loopAdditionalSlides: 5,
  allowTouchMove: false
});

const bestBottom = new Swiper('.bestSeller .product .slide_wrap:nth-of-type(2)', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,
  speed: 9000,
  freeMode: { enabled: true, momentum: false },
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    pauseOnMouseEnter: true, // 변경: 마우스 호버시 자동 일시정지
    reverseDirection: true
  },
  loopAdditionalSlides: 5,
  allowTouchMove: false
});

// DOM 준비 후 autoplay 시작 (확실히 실행시키기 위해)
document.addEventListener('DOMContentLoaded', () => {
  // autoplay 확실히 시작
  if (bestTop && bestTop.autoplay) bestTop.autoplay.start();
  if (bestBottom && bestBottom.autoplay) bestBottom.autoplay.start();

  // 각 swiper 엘리먼트에 pointer 이벤트 바인딩
  const bindHover = (swiper) => {
    if (!swiper || !swiper.el || !swiper.autoplay) return;
    const el = swiper.el;
    // 디버깅: console.log로 이벤트 감지 확인 가능
    el.addEventListener('pointerenter', () => {
      // console.log('hover enter', el);
      swiper.autoplay.stop();
    });
    el.addEventListener('pointerleave', () => {
      // console.log('hover leave', el);
      swiper.autoplay.start();
    });
  };

  bindHover(bestTop);
  bindHover(bestBottom);
});

// 카드 회전 
// --- Replace all existing influencer "sequential flip" blocks with the single block below ---
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.influencer .card'));
  if (!cards.length) return;

  const config = {
    flipMs: 800,    // CSS transition 시간(ms)과 정확히 일치시킬 것
    stayMs: 500,    // 각 카드가 뒤(Back) 상태로 머무르는 시간
    gapMs: 120,     // 카드 간 간격(다음 카드가 시작되기 전)
    resetDelay: 1000 // 모든 카드가 뒤집힌 후 한꺼번에 되돌리기 전 대기
  };

  let loopRunning = false;
  let stopLoop = false;
  let isHovered = false;

  const influencerEl = document.querySelector('.influencer');
  if (influencerEl) {
    influencerEl.addEventListener('pointerenter', () => { isHovered = true; });
    influencerEl.addEventListener('pointerleave', () => { isHovered = false; });
  }

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  async function sequentialFlipLoop() {
    if (loopRunning) return;
    loopRunning = true;

    while (!stopLoop) {
      // 1) 순차적으로 각 카드를 한 번만 뒤집음 (flipped 추가)
      for (const card of cards) {
        if (stopLoop) break;
        while (isHovered && !stopLoop) await sleep(150); // 호버 시 일시정지
        if (stopLoop) break;

        card.classList.add('flipped');
        // 앞->뒤 애니메이션 종료 + 체류시간 + 카드 간 간격 대기
        await sleep(config.flipMs + config.stayMs + config.gapMs);
      }
      if (stopLoop) break;

      // 2) 모든 카드가 뒤집힌 상태를 잠시 유지
      await sleep(config.resetDelay);

      // 3) 모든 카드를 한꺼번에 원위치(뒤->앞)로 되돌림 (flipped 제거)
      cards.forEach(c => c.classList.remove('flipped'));
      // 뒤->앞 애니메이션 완료 대기
      await sleep(config.flipMs);

      // 루프 사이 짧은 대기
      await sleep(300);
    }

    loopRunning = false;
  }

  // visibility 제어 (백그라운드에서 멈춤)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop = true;
    } else {
      if (stopLoop) {
        stopLoop = false;
        sequentialFlipLoop();
      }
    }
  });

  sequentialFlipLoop();
});

// 인플루언서 호버+하트
document.addEventListener('DOMContentLoaded', () => {
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

// 카드 회전 (각 카드는 한 번만 앞→뒤로 뒤집히고, 모든 카드가 뒤집힌 뒤 한꺼번에 원위치)
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.influencer .card'));
  if (!cards.length) return;

  const config = {
    flipMs: 3000,   // CSS transition 시간(ms)과 동일하게 맞출 것
    stayMs: 400,    // 뒤(Back) 화면을 보여주는 시간(ms) — 각 카드가 뒤로 완전히 회전한 후 추가로 보여줄 시간
    gapMs: 100,     // 카드 간 딜레이(ms)
    resetDelay: 800 // 모든 카드가 뒤집힌 후 한꺼번에 되돌리기 전 대기(ms)
  };

  let loopRunning = false;
  let stopLoop = false;
  let isHovered = false;

  const influencerEl = document.querySelector('.influencer');
  if (influencerEl) {
    influencerEl.addEventListener('pointerenter', () => { isHovered = true; });
    influencerEl.addEventListener('pointerleave', () => { isHovered = false; });
  }

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  async function sequentialFlipLoop() {
    if (loopRunning) return;
    loopRunning = true;

    while (!stopLoop) {
      // 1) 순차적으로 각 카드를 한 번만 뒤집음 (flipped 추가, 바로 되돌리지 않음)
      for (const card of cards) {
        if (stopLoop) break;
        while (isHovered && !stopLoop) await sleep(150); // 호버 시 일시정지
        if (stopLoop) break;

        card.classList.add('flipped');
        // 앞->뒤 애니메이션(=flipMs) 끝나고 약간의 체류 시간 및 카드 간 간격 대기
        await sleep(config.flipMs + config.stayMs + config.gapMs);
      }
      if (stopLoop) break;

      // 2) 모든 카드가 뒤집힌 상태를 잠시 유지
      await sleep(config.resetDelay);

      // 3) 모든 카드를 한꺼번에 원위치(뒤->앞)로 되돌림 (flipped 제거)
      cards.forEach(c => c.classList.remove('flipped'));
      // 뒤->앞 애니메이션 완료 대기
      await sleep(config.flipMs);

      // 루프 사이 짧은 대기
      await sleep(300);
    }

    loopRunning = false;
  }

  // visibility 제어 (백그라운드에서 멈춤)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop = true;
    } else {
      if (stopLoop) {
        stopLoop = false;
        sequentialFlipLoop();
      }
    }
  });

  sequentialFlipLoop();
});
// 카드 회전 (각 카드는 한 번만 앞→뒤로 뒤집히고, 모든 카드가 뒤집힌 뒤 한꺼번에 원위치)
document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.influencer .card'));
  if (!cards.length) return;

  const config = {
    flipMs: 3000,   // CSS transition과 일치시킬 것 (main.css의 transition 시간)
    stayMs: 400,  // 뒤(Back) 보여주는 시간
    gapMs: 100     // 카드 간 짧은 간격
  };

  let loopRunning = false;
  let stopLoop = false;
  let isHovered = false;

  const influencerEl = document.querySelector('.influencer');
  if (influencerEl) {
    influencerEl.addEventListener('pointerenter', () => { isHovered = true; });
    influencerEl.addEventListener('pointerleave', () => { isHovered = false; });
  }

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

  async function sequentialFlipLoop() {
    if (loopRunning) return;
    loopRunning = true;
    while (!stopLoop) {
      for (const card of cards) {
        if (stopLoop) break;
        // 사용자가 인플루언서 영역에 마우스 올려두면 루프 일시정지
        while (isHovered && !stopLoop) await sleep(150);
        if (stopLoop) break;

        // 앞->뒤 회전
        card.classList.add('flipped');
        await sleep(config.flipMs + config.stayMs);

        // 뒤->앞 회전(완료)
        card.classList.remove('flipped');
        await sleep(config.flipMs + config.gapMs);
      }
    }
    loopRunning = false;
  }

  // 페이지 숨김/표시 시 루프 제어 (백그라운드에서 리소스 절약)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop = true;
    } else {
      if (stopLoop) {
        stopLoop = false;
        sequentialFlipLoop();
      }
    }
  });

  // 시작
  sequentialFlipLoop();
});

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


// 카드 회전

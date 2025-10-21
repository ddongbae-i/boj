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

//             const flipOnce = (el) => {
//                 el.classList.remove('do-flip');
//                 void el.offsetWidth; // 강제 리플로우
//                 el.classList.add('do-flip');
//                 setTimeout(() => el.classList.remove('do-flip'), DURATION);
//             };

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
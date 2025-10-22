// ===== 유틸 =====
const $ = (sel, root = document) => root.querySelector(sel);
const on = (el, type, handler, opts) => { if (el) el.addEventListener(type, handler, opts); };

const els = {
  home:null, quiz:null, result:null,
  startBtn:null, homeBtn:null, resetBtn:null,
  progress:null, question:null, options:null,
  prevBtn:null, nextBtn:null,
  radar:null, radarTags:null, productGrid:null,
};

document.addEventListener('DOMContentLoaded', () => {
  // 요소 바인딩
  els.home       = $('#home');
  els.quiz       = $('#quiz');
  els.result     = $('#result');
  els.startBtn   = $('#startBtn');
  els.homeBtn    = $('#homeBtn');
  els.resetBtn   = $('#resetBtn');
  els.progress   = $('#progress');
  els.question   = $('#question');
  els.options    = $('#options');
  els.prevBtn    = $('#prevBtn');
  els.nextBtn    = $('#nextBtn');
  els.radar      = $('#radar5');
  els.radarTags  = $('#radarTags');
  els.productGrid= $('#productGrid');

  // 이벤트
  on(els.startBtn, 'click', () => { resetState(); show('quiz'); renderQuestion(); });
  on(els.homeBtn,  'click', () => show('home'));
  on(els.resetBtn, 'click', () => { resetState(); show('quiz'); renderQuestion(); window.scrollTo({top:0,behavior:'smooth'}); });

  on(els.prevBtn, 'click', onPrev);
  on(els.nextBtn, 'click', onNext);

  // 초기 홈 화면
  show('home');

  // 레이더 기본 그리드 1회 생성
  drawRadarBase();

  // 리사이즈: rAF 디바운스
  let rAF = 0;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      drawRadarData(); // 뷰박스 기반이라 영향 적지만 안전 차원
      placeRadarTags();
    });
  });
});

// ===== 데이터(5축/10문항) =====
const AXES = ['Hydration','Sebum','Sensitivity','Elasticity','Tone']; // 5축
const POP_AVG = [60, 55, 50, 58, 57]; // 인구 평균(예시)

const QUESTIONS = [
  { q:'Q1. How does your skin feel after cleansing?',
    opts: ['A. Feels tight and dry',        // -> Dry,
          'B. Comfortable/normal',
          'C. Slightly oily',
          'D. Very oily/shiny',            // -> Oily
    ],
    axis: 0, // O vs D 
    weights: [100, 70, 40, 20]
  },
  { q:'Q2. How easily does your skin get irritated (redness, stinging)?',
    opts: ['A. Very easily and often',      // Sensitive,
           'B. Sometimes',
           'C. Rarely',
           'D. Almost never',               // Resistant
    ],
    axis: 1, // R vs S
    weights: [100, 70, 30, 10]
  },
  { q:'알레르기/자극 반응이 자주 있나요?', opts:['자주 있음','가끔','드묾','없음'], axis:2, weights:[100,70,40,10] },
  { q:'탄력 저하(늘어짐)를 느끼나요?', opts:['매우','보통','약간','없음'], axis:3, weights:[100,70,40,10], invert:true },
  { q:'피부 톤이 고르지 않나요?', opts:['매우 불균일','약간','거의 균일','매우 균일'], axis:4, weights:[100,70,40,10], invert:true },
  { q:'보습제를 바르면 금방 건조해지나요?', opts:['네','가끔','잘 모름','아니요'], axis:0, weights:[100,70,40,10] },
  { q:'피부가 오후에 유분이 증가하나요?', opts:['많이','조금','거의 없음','없음'], axis:1, weights:[100,65,35,10] },
  { q:'신제품 사용 시 따가움이 있나요?', opts:['자주','가끔','드묾','없음'], axis:2, weights:[100,70,40,10] },
  { q:'볼/턱 라인의 탄력이 어떤가요?', opts:['약함','보통','좋음','매우 좋음'], axis:3, weights:[90,65,40,15], invert:true },
  { q:'톤 보정(붉음/칙칙함) 필요성을 느끼나요?', opts:['항상','종종','가끔','거의 없음'], axis:4, weights:[100,75,45,15] },
];
const NQ = QUESTIONS.length;

const state = {
  idx: 0,
  answers: Array(NQ).fill(null),     // 0~3
  axisValues: Array(AXES.length).fill(50), // 초기값
};

// ===== 네비게이션 =====
function show(which){
  if (!els.home || !els.quiz || !els.result) return;
  els.home.hidden   = which !== 'home';
  els.quiz.hidden   = which !== 'quiz';
  els.result.hidden = which !== 'result';
  if (which === 'quiz') els.question?.focus?.();
}

// ===== 퀴즈 로직 =====
function resetState(){
  state.idx = 0;
  state.answers.fill(null);
  state.axisValues = Array(AXES.length).fill(50);
  if (els.nextBtn) els.nextBtn.disabled = true;
  if (els.prevBtn) els.prevBtn.disabled = true;
  updateProgress();
}

function updateProgress(){
  if (els.progress) els.progress.textContent = `${state.idx+1} of ${NQ}`;
}

function renderQuestion(){
  const item = QUESTIONS[state.idx];
  if (!els.question || !els.options) return;

  els.question.textContent = item.q;
  els.options.innerHTML = '';

  item.opts.forEach((txt, i) => {
    const li = document.createElement('li'); li.className = 'option-item';
    const id = `q${state.idx}-opt${i}`;
    const input = document.createElement('input');
    input.type = 'radio'; input.id = id; input.name = 'answer'; input.value = String(i);
    if (state.answers[state.idx] === i) input.checked = true;

    const label = document.createElement('label');
    label.className = 'option';
    label.setAttribute('for', id);
    label.innerHTML = `<span class="bullet" aria-hidden="true"></span><span class="txt">${escapeHtml(txt)}</span>`;

    li.appendChild(input); li.appendChild(label);
    els.options.appendChild(li);

    on(input, 'change', () => {
      state.answers[state.idx] = i;
      if (els.nextBtn) els.nextBtn.disabled = false;
    });
  });

  if (els.prevBtn) els.prevBtn.disabled = state.idx === 0;
  if (els.nextBtn){
    els.nextBtn.textContent = (state.idx === NQ-1) ? 'See Result' : 'Next';
    els.nextBtn.disabled = (state.answers[state.idx] == null);
  }
  updateProgress();
}

function onPrev(){
  if (state.idx === 0) return;
  state.idx--;
  renderQuestion();
  els.question?.focus?.();
}

function onNext(){
  if (state.answers[state.idx] == null) return;
  if (state.idx < NQ - 1){
    state.idx++;
    renderQuestion();
    els.question?.focus?.();
    return;
  }
  // 결과 계산/표시
  computeAxisValues();
  renderResult();
  show('result');
}

// 답안을 5축 점수로 변환
function computeAxisValues(){
  const vals = Array(AXES.length).fill(50);
  const counts = Array(AXES.length).fill(0);

  state.answers.forEach((ans, i) => {
    if (ans == null) return;
    const { axis, weights, invert } = QUESTIONS[i];
    let v = weights[ans];
    if (invert) v = 100 - v; // 긍정형 문항 뒤집기
    vals[axis] += v;
    counts[axis] += 1;
  });

  for (let k=0;k<AXES.length;k++){
    if (counts[k] > 0) vals[k] = Math.round(vals[k] / (counts[k] + 1)); // 초기값 포함 평균
    vals[k] = Math.max(5, Math.min(95, vals[k]));
  }
  state.axisValues = vals;
}

// ===== 결과 렌더링 =====
function renderResult(){
  drawRadarBase();
  drawRadarData();
  placeRadarTags();

  const mbtiEl = $('#mbti'); const sumEl = $('#summary');
  if (mbtiEl) mbtiEl.textContent = skinCode(state.axisValues);
  if (sumEl)  sumEl.textContent  = skinSummary(state.axisValues);

  renderProducts(RECOMMENDED_PRODUCTS(state.axisValues));
}

// ===== 레이더 차트 =====
function drawRadarBase(){
  if (!els.radar) return;
  const svg = els.radar;
  svg.innerHTML = '';
  const gGrid = svgEl('g', { id:'grid' });
  svg.appendChild(gGrid);

  const R = 100, N = AXES.length, step = (Math.PI*2)/N, cx=0, cy=0;

  // 동심 다각형(격자)
  for (let r=20; r<=R; r+=20){
    const pts = [];
    for (let k=0;k<N;k++){
      const a = -Math.PI/2 + step*k;
      pts.push(`${cx + Math.cos(a)*r},${cy + Math.sin(a)*r}`);
    }
    gGrid.appendChild(svgEl('polygon', {
      points: pts.join(' '), fill:'none', stroke:'#243447', 'stroke-opacity':'0.8'
    }));
  }

  // 축
  for (let k=0;k<N;k++){
    const a = -Math.PI/2 + step*k;
    const x = cx + Math.cos(a)*R, y = cy + Math.sin(a)*R;
    gGrid.appendChild(svgEl('line', { x1:cx, y1:cy, x2:x, y2:y, stroke:'#243447' }));
  }
}

function drawRadarData(){
  if (!els.radar) return;
  const svg = els.radar;
  const old = svg.querySelector('#data'); if (old) old.remove();

  const R = 100, N = AXES.length, step = (Math.PI*2)/N, cx=0, cy=0;
  const g = svgEl('g', { id:'data' });
  svg.appendChild(g);

  // Population
  const ptsPop = [];
  for (let k=0;k<N;k++){
    const a = -Math.PI/2 + step*k;
    const r = R * (POP_AVG[k]/100);
    ptsPop.push(`${cx + Math.cos(a)*r},${cy + Math.sin(a)*r}`);
  }
  g.appendChild(svgEl('polygon', {
    points: ptsPop.join(' '), fill:'rgba(159,176,195,0.25)', stroke:'var(--pop)'
  }));

  // Me
  const ptsMe = [];
  for (let k=0;k<N;k++){
    const a = -Math.PI/2 + step*k;
    const r = R * (state.axisValues[k]/100);
    ptsMe.push(`${cx + Math.cos(a)*r},${cy + Math.sin(a)*r}`);
  }
  g.appendChild(svgEl('polygon', {
    points: ptsMe.join(' '), fill:'rgba(91,210,255,0.22)', stroke:'var(--me)', 'stroke-width':'2'
  }));
}

function placeRadarTags(){
  const svg = els.radar, list = els.radarTags;
  if (!svg || !list) return;
  list.innerHTML = '';

  // 컨테이너 기준 좌표
  const wrap = svg.closest('.radar-box') || svg.parentElement;
  const crect = wrap.getBoundingClientRect();
  const srect = svg.getBoundingClientRect();

  const svgLeft = srect.left - crect.left;
  const svgTop  = srect.top  - crect.top;

  const cx = svgLeft + srect.width / 2;
  const cy = svgTop  + srect.height / 2;

  const N = AXES.length, step = (Math.PI*2)/N, R = Math.min(srect.width, srect.height)/2 - 8;
  AXES.forEach((lab, k) => {
    const a = -Math.PI/2 + step*k;
    const dx = Math.cos(a)*(R + 14);
    const dy = Math.sin(a)*(R + 14);
    const li = document.createElement('li');
    li.textContent = lab;
    li.style.left = `${cx + dx}px`;
    li.style.top  = `${cy + dy}px`;
    list.appendChild(li);
  });
}

function svgEl(tag, attrs){
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs || {}).forEach(([k,v]) => el.setAttribute(k, v));
  return el;
}

// ===== 결과 요약/코드 =====
function skinCode(vals){
  // 간단 규칙: Hydration 저→D(dry)/고→M(moist), Sebum 저→N/고→O,
  // Sensitivity 저→R/고→S, Tone 저→C/고→U
  const H = vals[0] < 50 ? 'D' : 'M';
  const O = vals[1] < 55 ? 'N' : 'O';
  const Si= vals[2] < 50 ? 'R' : 'S';
  const T = vals[4] < 50 ? 'C' : 'U';
  return `${H}${O}${Si}${T}`;
}
function skinSummary(vals){
  const tips = [];
  if (vals[0] >= 60) tips.push('라이트 수분 라인');
  else tips.push('리치 보습 · 장벽 강화');

  if (vals[1] >= 60) tips.push('유분 컨트롤/논코메도제닉');
  else tips.push('유수분 밸런스 개선');

  if (vals[2] >= 60) tips.push('저자극/무향 위주');
  if (vals[3] <= 40) tips.push('탄력 케어(펩타이드/레티날)');
  if (vals[4] >= 60) tips.push('톤 보정/항산화');

  return tips.join(' · ');
}

// ===== 추천 상품/렌더 =====
const PRODUCTS = [
  { id:1, name:'Calm Barrier Cream', brand:'DermaX', img:'https://picsum.photos/seed/cream/640/400', tags:['barrier','ceramide'] },
  { id:2, name:'Light Hydra Gel', brand:'AquaLab', img:'https://picsum.photos/seed/gel/640/400', tags:['hydration','HA'] },
  { id:3, name:'Sebum Control Toner', brand:'ClearUp', img:'https://picsum.photos/seed/toner/640/400', tags:['BHA','pore'] },
  { id:4, name:'Peptide Firming Serum', brand:'Lift+', img:'https://picsum.photos/seed/serum/640/400', tags:['peptide','firming'] },
  { id:5, name:'Tone Bright Essence', brand:'Lumina', img:'https://picsum.photos/seed/bright/640/400', tags:['vitC','bright'] },
  { id:6, name:'Soothing Ampoule', brand:'CalmMe', img:'https://picsum.photos/seed/soothe/640/400', tags:['cica','soothing'] },
];

function RECOMMENDED_PRODUCTS(vals){
  // 간단 규칙 기반 추천
  const picks = [];
  if (vals[2] >= 60) picks.push(1,6); // 민감↑
  if (vals[1] >= 60) picks.push(3);   // 지성↑
  if (vals[3] <= 40) picks.push(4);   // 탄력↓
  if (vals[4] >= 60) picks.push(5);   // 톤↑
  if (picks.length < 4) picks.push(2); // 보충
  const ids = Array.from(new Set(picks)).slice(0,4);
  return PRODUCTS.filter(p => ids.includes(p.id));
}

function renderProducts(list){
  if (!els.productGrid) return;
  els.productGrid.innerHTML = '';
  const frag = document.createDocumentFragment();

  list.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card-p';
    card.innerHTML = `
      <div class="p-img"><img alt="${escapeHtml(item.name)}" src="${escapeAttr(item.img)}" loading="lazy"></div>
      <div class="p-meta">
        <h4 class="p-name">${escapeHtml(item.name)}</h4>
        <p class="p-brand">${escapeHtml(item.brand)}</p>
      </div>
      <div class="tags">${(item.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="p-cta"><button type="button" class="wish" aria-pressed="false">♡ ADD TO WISHLIST</button></div>
    `;
    const btn = card.querySelector('.wish');
    on(btn, 'click', () => {
      btn.classList.toggle('liked');
      const liked = btn.classList.contains('liked');
      btn.textContent = liked ? '❤ ADDED TO WISHLIST' : '♡ ADD TO WISHLIST';
      btn.setAttribute('aria-pressed', liked ? 'true':'false');
    });
    frag.appendChild(card);
  });

  els.productGrid.appendChild(frag);
}

// ===== 헬퍼 =====
function escapeHtml(str){ return String(str).replace(/[&<>"']/g, s=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;' }[s])); }
function escapeAttr(str){ return escapeHtml(str); }

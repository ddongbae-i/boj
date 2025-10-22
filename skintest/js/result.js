// Baumann-type quiz (D/O, S/R, P/N, W/T) with 10 Qs -> DRNT-style code.
// Assumes your HTML skeleton from the prompt is present in the page.

(() => {
  // Elements
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const el = {
    pages: {
      home: $('#home'),
      quiz: $('#quiz'),
      result: $('#result'),
    },
    start: $('#test-start-btn'),
    progress: $('#progress'),
    question: $('#question'),
    options: $('#options'),
    prev: $('#prevBtn'),
    next: $('#nextBtn'),
    // Result
    radarSvg: $('#radarSvg'),
    mbtiCode: $('#mbtiCode'),
    baseType: $('#baseType'),
    baseDesc: $('#baseDesc'),
    mbtiDesc: $('#mbtiDesc'),
    goodTags: $('#goodTags'),
    badTags: $('#badTags'),
    wishlistBtn: $('#wishlistBtn'),
    homeBtn: $('#homeBtn'),
    retryBtn: $('#retryBtn'),
  };

  // Quiz data: each option maps to one of four indices [D/O, S/R, P/N, W/T]
  // For each question, answers contribute 0..3 toward the "right-side" of each axis:
  // Axes order: [Oily (vs Dry), Resistant (vs Sensitive), Pigmented (vs Non-Pigmented), Wrinkle-prone (vs Tight)]
  // Higher score pushes to O, R, P, W. Lower pushes to D, S, N, T.
  const QUESTIONS = [
    {
      axis: 0, // O vs D
      text: 'Q1. How does your skin feel after cleansing?',
      opts: [
        'Feels tight and dry',        // -> Dry
        'Comfortable/normal',
        'Slightly oily',
        'Very oily/shiny',            // -> Oily
      ],
    },
    {
      axis: 1, // R vs S
      text: 'Q2. How easily does your skin get irritated (redness, stinging)?',
      opts: [
        'Very easily and often',      // Sensitive
        'Sometimes',
        'Rarely',
        'Almost never',               // Resistant
      ],
    },
    {
      axis: 0,
      text: 'Q3. By midday your T-zone looks…',
      opts: [
        'Matte or flaky',             // Dry
        'Mostly matte',
        'A bit shiny',
        'Very shiny',                 // Oily
      ],
    },
    {
      axis: 2, // P vs N
      text: 'Q4. Do you develop dark spots or tan quickly?',
      opts: [
        'Hardly ever',                // Non-Pigmented
        'A little',
        'Often',
        'Very easily / frequently',   // Pigmented
      ],
    },
    {
      axis: 3, // W vs T
      text: 'Q5. Fine lines/wrinkles concern you…',
      opts: [
        'Not really',                 // Tight
        'A little',
        'Somewhat',
        'A lot',                      // Wrinkle-prone
      ],
    },
    {
      axis: 1,
      text: 'Q6. New products cause burning/itching…',
      opts: [
        'Often',                      // Sensitive
        'Sometimes',
        'Rarely',
        'Never',                      // Resistant
      ],
    },
    {
      axis: 2,
      text: 'Q7. Post-acne marks or sun spots linger…',
      opts: [
        'Almost never',               // Non-Pigmented
        'Occasionally',
        'Often',
        'Very often',                 // Pigmented
      ],
    },
    {
      axis: 3,
      text: 'Q8. Under-eye or forehead lines appear…',
      opts: [
        'Barely visible',             // Tight
        'Slightly visible',
        'Noticeable',
        'Pronounced',                 // Wrinkle-prone
      ],
    },
    {
      axis: 0,
      text: 'Q9. After moisturizer, your skin feels…',
      opts: [
        'Still tight',                // Dry
        'Comfortable',
        'A bit greasy',
        'Greasy quickly',             // Oily
      ],
    },
    {
      axis: 1,
      text: 'Q10. Fragrance/actives (AHA/BHA/retinol) cause issues…',
      opts: [
        'Frequently',                 // Sensitive
        'Sometimes',
        'Rarely',
        'Never',                      // Resistant
      ],
    },
  ];

  // Scoring accumulators per axis
  const scores = [0,0,0,0];  // sums of 0..3
  const counts = [0,0,0,0];  // how many questions contributed to each axis
  const answers = Array(QUESTIONS.length).fill(null); // selected option index 0..3

  // Content dictionaries
  const AXES = [
    {neg:'D', pos:'O', labelNeg:'Dry', labelPos:'Oily'},
    {neg:'S', pos:'R', labelNeg:'Sensitive', labelPos:'Resistant'},
    {neg:'N', pos:'P', labelNeg:'Non‑Pigmented', labelPos:'Pigmented'},
    {neg:'T', pos:'W', labelNeg:'Tight', labelPos:'Wrinkle‑prone'},
  ];

  const BASE_DESC = {
    D: 'Skin often feels tight after cleansing; benefits from richer moisturizers and barrier‑supporting ingredients.',
    O: 'Skin produces more sebum; prefers light layers, oil‑balancing formulas, and non‑comedogenic textures.',
  };

  // Ingredient recommendations assembled based on type letters
  const GOOD = {
    D: ['Hyaluronic Acid','Glycerin','Ceramides','Squalane','Panthenol','Beta‑glucan'],
    O: ['Niacinamide','Green Tea','Zinc PCA','LHA (Capryloyl Salicylic Acid)','Lightweight Humectants'],
    S: ['Centella (Cica)','Panthenol','Madecassoside','Allantoin','Bisabolol','Colloidal Oat'],
    R: ['Vitamin C (AA/Derivatives)','Retinal/Retinol (gradual)','Azelaic Acid','Exfoliating Acids (low %)'],
    N: ['Vitamin C','Niacinamide','Sunscreen','Arbutin (targeted use)','Ferulic Acid'],
    P: ['Niacinamide','Arbutin','Tranexamic Acid','Kojic Derivative','Licorice (Glabridin)','Sunscreen SPF 50+'],
    T: ['Peptides','Antioxidants','Sunscreen','Humectants'],
    W: ['Retinoids','Peptides','Sunscreen SPF 50+','Bakuchiol','CoQ10'],
  };
  const BAD = {
    D: ['High Alcohol Denat.','Strong Clays Daily','Harsh Sulfates (SLS)'],
    O: ['Heavy Mineral Oils','Occlusive Balms (daytime)','Comedogenic Butters'],
    S: ['Fragrance/Perfume','Essential Oils (citrus/menthol)','High % AHAs/BHAs initially'],
    R: ['—'], // generally tolerant
    N: ['—'],
    P: ['Skipping Sunscreen','Unprotected Tanning'],
    T: ['—'],
    W: ['Excessive Tanning/UV','Smoking'],
  };

  // State
  let idx = 0;

  // Init
  function init() {
    el.start.addEventListener('click', startQuiz);
    el.prev.addEventListener('click', onPrev);
    el.next.addEventListener('click', onNext);
    el.options.addEventListener('change', () => el.next.disabled = false);
    el.retryBtn.addEventListener('click', resetAll);
    el.homeBtn.addEventListener('click', () => showPage('home'));
    el.wishlistBtn.addEventListener('click', () => {
      el.wishlistBtn.textContent = 'Added ✔';
      el.wishlistBtn.disabled = true;
    });
    renderQuestion();
    el.next.disabled = true;
  }

  function showPage(which){
    Object.values(el.pages).forEach(p => p.hidden = true);
    el.pages[which].hidden = false;
  }

  function startQuiz(){
    showPage('quiz');
    focusQuestion();
  }

  function renderQuestion(){
    const q = QUESTIONS[idx];
    el.progress.textContent = `${idx+1} of ${QUESTIONS.length}`;
    el.question.textContent = q.text;

    // Build options
    el.options.innerHTML = '';
    q.opts.forEach((txt, i) => {
      const li = document.createElement('li'); li.className = 'option-item';
      const id = `opt${i}`;
      const input = document.createElement('input');
      input.type = 'radio'; input.id = id; input.name = 'answer'; input.value = String(i);
      const label = document.createElement('label'); label.className = 'option'; label.setAttribute('for', id);
      label.innerHTML = `<span class="bullet" aria-hidden="true"></span><span class="txt" data-optindex="${i}">${txt}</span>`;
      if (answers[idx] === i) input.checked = true;
      li.appendChild(input); li.appendChild(label); el.options.appendChild(li);
    });

    // Buttons
    el.prev.disabled = idx === 0;
    el.next.textContent = idx === QUESTIONS.length - 1 ? 'See Result' : 'Next';
    el.next.disabled = answers[idx] == null;

    // Keyboard support: Enter -> Next
    el.options.onkeydown = (e) => {
      if (e.key === 'Enter' && !el.next.disabled) onNext();
    };
  }

  function onPrev(){
    if (idx === 0) return;
    idx--;
    renderQuestion();
    focusQuestion();
  }

  function onNext(){
    // Persist selection
    const selected = $('input[name="answer"]:checked', el.options);
    if (!selected) { el.next.disabled = true; return; }
    const selIdx = Number(selected.value);
    answers[idx] = selIdx;

    // Update axis score
    // Remove previous selection effect when changing selection
    // Recompute from scratch for simplicity
    scores.fill(0); counts.fill(0);
    answers.forEach((ans, qIndex) => {
      if (ans == null) return;
      const a = QUESTIONS[qIndex].axis;
      scores[a] += ans;    // ans is 0..3
      counts[a] += 1;
    });

    if (idx < QUESTIONS.length - 1){
      idx++;
      renderQuestion();
      focusQuestion();
    } else {
      computeAndShowResult();
    }
  }

  function focusQuestion(){
    // Move focus to heading for a11y
    el.question.focus({preventScroll:false});
  }

  function computeAndShowResult(){
    // Normalize each axis to 0..1 where 0 => negative letter, 1 => positive letter
    const norm = scores.map((sum, i) => {
      const max = counts[i] * 3 || 1;
      return max ? (sum / max) : 0.5;
    });

    // Build letter code
    const letters = norm.map((v, i) => v >= 0.5 ? AXES[i].pos : AXES[i].neg);
    const code = letters.join('');

    // Base type from first axis (D/O)
    const base = letters[0] === 'D' ? 'Dry Skin' : 'Oily Skin';

    // Descriptions
    const descItems = [
      axisLine(0, norm[0]),
      axisLine(1, norm[1]),
      axisLine(2, norm[2]),
      axisLine(3, norm[3]),
    ];

    // Ingredients
    const good = dedupe([
      ...GOOD[letters[0]], ...GOOD[letters[1]], ...GOOD[letters[2]], ...GOOD[letters[3]]
    ]);
    const bad = dedupe([
      ...BAD[letters[0]], ...BAD[letters[1]], ...BAD[letters[2]], ...BAD[letters[3]]
    ]).filter(x => x !== '—');

    // Render UI
    el.mbtiCode.textContent = code;
    el.baseType.textContent = base;
    el.baseDesc.textContent = BASE_DESC[letters[0]];
    el.mbtiDesc.innerHTML = descItems.map(li => `<li>${li}</li>`).join('');

    renderPills(el.goodTags, good);
    renderPills(el.badTags, bad, true);

    drawRadar(el.radarSvg, norm, [0.5,0.5,0.5,0.5]);

    showPage('result');
  }

  function axisLine(i, v){
    const neg = AXES[i].labelNeg, pos = AXES[i].labelPos;
    const pct = Math.round(v*100);
    return `${neg} ← ${pct}% → ${pos}`;
  }

  function renderPills(container, arr, isBad=false){
    container.innerHTML = '';
    if (!arr.length) {
      const span = document.createElement('span');
      span.className = 'pill';
      span.textContent = 'None';
      container.appendChild(span);
      return;
    }
    arr.forEach(t => {
      const s = document.createElement('span');
      s.className = 'pill';
      s.textContent = t;
      container.appendChild(s);
    });
  }

  function dedupe(arr){ return [...new Set(arr)]; }

  // Simple 4-axis radar (square rotated 45° with radial grid)
  function drawRadar(svg, myVals, popVals){
    // myVals/popVals: array of 4 numbers in [0,1]
    const axes = 4;
    const R = 48; // radius
    const angle = (k) => (-Math.PI/2) + (2*Math.PI*k/axes);

    const toXY = (val, k) => {
      const a = angle(k);
      return { x: Math.cos(a) * (val*R), y: Math.sin(a) * (val*R) };
    };

    // Clear
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Grid rings
    for (let r=0.25; r<=1.001; r+=0.25){
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx','0'); circle.setAttribute('cy','0');
      circle.setAttribute('r', String(R*r));
      circle.setAttribute('fill','none');
      circle.setAttribute('stroke','#2a2f44');
      circle.setAttribute('stroke-width','0.6');
      svg.appendChild(circle);
    }

    // Axes lines + labels
    AXES.forEach((ax, k) => {
      const a = angle(k);
      const x = Math.cos(a) * R, y = Math.sin(a) * R;
      const line = document.createElementNS('http://www.w3.org/2000/svg','line');
      line.setAttribute('x1','0'); line.setAttribute('y1','0');
      line.setAttribute('x2',String(x)); line.setAttribute('y2',String(y));
      line.setAttribute('stroke','#37405f'); line.setAttribute('stroke-width','0.8');
      svg.appendChild(line);

      const lbl = document.createElementNS('http://www.w3.org/2000/svg','text');
      lbl.setAttribute('x', String(x*1.15)); lbl.setAttribute('y', String(y*1.15));
      lbl.setAttribute('fill','#9fb0d9'); lbl.setAttribute('font-size','6.5'); lbl.setAttribute('text-anchor','middle');
      lbl.textContent = `${AXES[k].labelNeg}/${AXES[k].labelPos}`;
      svg.appendChild(lbl);
    });

    const poly = (vals, color, fillOpacity) => {
      const pts = vals.map((v,k) => {
        const {x,y} = toXY(v, k);
        return `${x},${y}`;
      }).join(' ');
      const p = document.createElementNS('http://www.w3.org/2000/svg','polygon');
      p.setAttribute('points', pts);
      p.setAttribute('fill', color);
      p.setAttribute('fill-opacity', fillOpacity);
      p.setAttribute('stroke', color);
      p.setAttribute('stroke-width', '1.2');
      return p;
    };

    svg.appendChild(poly(popVals, '#99a6c7', 0.12));
    svg.appendChild(poly(myVals, '#6aa6ff', 0.22));
  }

  function resetAll(){
    for (let i=0;i<answers.length;i++) answers[i] = null;
    scores.fill(0); counts.fill(0); idx = 0;
    renderQuestion();
    el.next.disabled = true;
    el.wishlistBtn.textContent = 'Add all to Wishlist';
    el.wishlistBtn.disabled = false;
    showPage('quiz');
    focusQuestion();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  // Mount
  document.addEventListener('DOMContentLoaded', init);
})();

// 도우미
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const on = (el, type, handler, opts) => { if (el) el.addEventListener(type, handler, opts); else console.warn(`[bind] ${type}: element missing`); };

// 전역 상태 예시
let idx = 0;
const answers = [];                 // QUESTIONS.length에 맞게 elsewhere에서 채워짐
const scores  = [0,0,0,0];
const counts  = [0,0,0,0];

// 요소 모음
const el = {
  start: null, prev: null, next: null,
  options: null, progress: null, question: null,
  retryBtn: null, homeBtn: null, wishlistBtn: null,
  pages: null
};

document.addEventListener('DOMContentLoaded', () => {
  // 요소 연결 (ID는 실제 HTML과 일치해야 합니다)
  el.start      = $('#startBtn');
  el.prev       = $('#prevBtn');
  el.next       = $('#nextBtn');
  el.options    = $('#options');
  el.progress   = $('#progress');
  el.question   = $('#question');
  el.retryBtn   = $('#retryBtn');
  el.homeBtn    = $('#homeBtn');
  el.wishlistBtn= $('#wishlistBtn');

  el.pages = {
    home:   $('#home'),
    quiz:   $('#quiz'),
    result: $('#result'),
  };

  // 필수 요소 빠진 경우 즉시 알림
  ['start','prev','next','options','progress','question','retryBtn','homeBtn','wishlistBtn'].forEach(k=>{
    if (!el[k]) console.warn(`[init] missing element: el.${k}`);
  });
  ['home','quiz','result'].forEach(p=>{
    if (!el.pages[p]) console.warn(`[init] missing page: pages.${p}`);
  });

  init(); // 안전 바인딩이므로 누락되어도 에러 없이 경고만 출력
});

// 기존 init 대체/보강
function init() {
  on(el.start, 'click', startQuiz);
  on(el.prev, 'click', onPrev);
  on(el.next, 'click', onNext);
  on(el.options, 'change', () => { if (el.next) el.next.disabled = false; });
  on(el.retryBtn, 'click', resetAll);
  on(el.homeBtn, 'click', () => showPage('home'));
  on(el.wishlistBtn, 'click', () => {
    el.wishlistBtn.textContent = 'Added ✔';
    el.wishlistBtn.disabled = true;
  });

  renderQuestion();
  if (el.next) el.next.disabled = true;
}

function showPage(which){
  if (!el.pages) return;
  Object.values(el.pages).forEach(p => p && (p.hidden = true));
  if (el.pages[which]) el.pages[which].hidden = false;
}
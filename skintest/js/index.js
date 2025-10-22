// app.js
// Simple router between #home, #quiz, #result with fixed header/footer.
// Quiz minimal logic + pentagon radar.

// Router
const pages = ['home','quiz','result'];
function show(id){
  pages.forEach(pid=>{
    const el = document.getElementById(pid);
    if (!el) return;
    const active = pid === id;
    el.toggleAttribute('hidden', !active);
    el.classList.toggle('is-active', active);
  });
  // focus management
  if (id === 'quiz') { var q=document.getElementById('question'); if(q) q.focus(); }
}
function go(id){
  location.hash = '#' + id;
  show(id);
}

// Header/Buttons
window.addEventListener('DOMContentLoaded', () => {
  (function(el){ if(el) el.addEventListener('click', function(){ go('quiz'); }); })(document.getElementById('startBtn'));
  (function(el){ if(el) el.addEventListener('click', function(){ go('home'); }); })(document.getElementById('homeBtn'));
  (function(el){ if(el) el.addEventListener('click', function(){ location.reload(); }); })(document.getElementById('resetBtn'));

  // Hash routing
  const target = (location.hash ? location.hash.replace('#','') : '') || 'home';
  show(pages.includes(target) ? target : 'home');

  initQuiz();
});

// Quiz: 10 questions (English)
const QUESTIONS = [
  { title:'Q1. How does your skin feel after cleansing?', choices:[
    {label:'A. Very tight/dry', value:'A'},
    {label:'B. Oily overall', value:'B'},
    {label:'C. Only T-zone oily', value:'C'},
    {label:'D. Stings/irritated', value:'D'}
  ]},
  { title:'Q2. Pores?', choices:[
    {label:'A. Barely visible', value:'A'},
    {label:'B. Large overall', value:'B'},
    {label:'C. Large on T-zone only', value:'C'},
    {label:'D. Flare with irritation', value:'D'}
  ]},
  { title:'Q3. Oil through the day?', choices:[
    {label:'A. Dry even in afternoon', value:'A'},
    {label:'B. Greasy all day', value:'B'},
    {label:'C. Only T-zone greasy', value:'C'},
    {label:'D. Highly reactive to env.', value:'D'}
  ]},
  { title:'Q4. Texture / flakes?', choices:[
    {label:'A. Frequent flaking', value:'A'},
    {label:'B. Hardly any flakes', value:'B'},
    {label:'C. Area-dependent', value:'C'},
    {label:'D. Breaks out with product swap', value:'D'}
  ]},
  { title:'Q5. Blemish tendency?', choices:[
    {label:'A. Dryness-related', value:'A'},
    {label:'B. Oil-related', value:'B'},
    {label:'C. Varies by area', value:'C'},
    {label:'D. Irritation-related', value:'D'}]
  },
  { title:'Q6. Serum/cream feel?', choices:[
    {label:'A. Absorbs fast, needs more', value:'A'},
    {label:'B. Sits heavy', value:'B'},
    {label:'C. Depends on area', value:'C'},
    {label:'D. Sometimes stings/burns', value:'D'}
  ]},
  { title:'Q7. Shine right after wash?', choices:[
    {label:'A. Almost none', value:'A'},
    {label:'B. Overall shine', value:'B'},
    {label:'C. Subtle on T-zone', value:'C'},
    {label:'D. Red/irritation glow', value:'D'}
  ]},
  { title:'Q8. Heat/humidity response?', choices:[
    {label:'A. Gets drier', value:'A'},
    {label:'B. More sebum', value:'B'},
    {label:'C. Varies by area', value:'C'},
    {label:'D. Overly sensitive', value:'D'}
  ]},
  { title:'Q9. After cleansing?', choices:[
    {label:'A. Very tight', value:'A'},
    {label:'B. Still oily', value:'B'},
    {label:'C. Cheeks tight, T‑zone ok', value:'C'},
    {label:'D. Irritation/redness', value:'D'}
  ]},
  { title:'Q10. AM cleansing style?', choices:[
    {label:'A. Water only yet tight', value:'A'},
    {label:'B. Cleanser is a must', value:'B'},
    {label:'C. Cleanser for T‑zone only', value:'C'},
    {label:'D. Hard to change cleanser', value:'D'}
  ]}
];

function initQuiz(){
  const section = document.getElementById('quiz');
  if (!section) return;
  const el = {
    progress:  document.getElementById('progress'),
    question:  document.getElementById('question'),
    options:   document.getElementById('options'),
    prevBtn:   document.getElementById('prevBtn'),
    nextBtn:   document.getElementById('nextBtn'),
  };
  const missing = Object.entries(el).filter(([_,v])=>!v).map(([k])=>k);
  if (missing.length){ console.error('Missing quiz elements:', missing); return; }

  const N = QUESTIONS.length;
  let i = 0;
  const selectedIdx = new Array(N).fill(null);

  function updateProgress(){ el.progress.textContent = `${i+1} of ${N}`; }
  function isAnswered(){ return selectedIdx[i] !== null; }
  function updateNext(){ el.nextBtn.disabled = !isAnswered(); }

  function renderOptions(){
    const choices = QUESTIONS[i].choices;
    el.options.innerHTML = '';
    el.options.setAttribute('role','radiogroup');
    el.options.setAttribute('aria-labelledby','question');
    const sel = selectedIdx[i];
    choices.forEach((opt, idx)=>{
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type='button';
      btn.className='option';
      btn.textContent = opt.label;
      btn.setAttribute('role','radio');
      const isSel = sel === idx;
      btn.setAttribute('aria-checked', isSel?'true':'false');
      btn.tabIndex = isSel?0:-1;
      btn.addEventListener('click', ()=>{
        selectedIdx[i]=idx; renderOptions(); updateNext(); el.nextBtn.focus();
      });
      btn.addEventListener('keydown', (e)=>{
        const k=e.key; const count=choices.length;
        let cur = ((selectedIdx[i]!==undefined && selectedIdx[i]!==null) ? selectedIdx[i] : 0);
        if (k==='ArrowLeft'||k==='ArrowUp'){
          e.preventDefault(); cur=(cur-1+count)%count; selectedIdx[i]=cur; renderOptions(); updateNext(); focusCurrent();
        }else if(k==='ArrowRight'||k==='ArrowDown'){
          e.preventDefault(); cur=(cur+1)%count; selectedIdx[i]=cur; renderOptions(); updateNext(); focusCurrent();
        }else if(k===' '||k==='Enter'){
          e.preventDefault(); el.nextBtn.focus();
        }
      });
      li.appendChild(btn);
      el.options.appendChild(li);
    });
  }
  function focusCurrent(){
    const idx = ((selectedIdx[i]!==undefined && selectedIdx[i]!==null) ? selectedIdx[i] : 0);
    const buttons = el.options.querySelectorAll('button[role="radio"]');
    if (buttons[idx]) buttons[idx].focus();
  }
  function render(){
    el.question.textContent = QUESTIONS[i].title;
    updateProgress();
    renderOptions();
    el.prevBtn.disabled = i===0;
    el.nextBtn.textContent = (i===N-1)?'Finish':'Next';
    updateNext();
    el.question.setAttribute('tabindex','-1');
  }
  function finish(){
    // Map to values A/B/C/D
    const values = selectedIdx.map((idx, qi)=>QUESTIONS[qi].choices[idx].value);
    // Dummy result numbers (0-100) derived from answers for demo
    const map={'A':30,'B':70,'C':50,'D':40};
    const dataValues=[
      map[values[0]], // Oil
      map[values[1]], // Water retention
      map[values[2]], // Sensitivity
      map[values[3]], // Moisturizing
      map[values[4]], // Elasticity
    ];
    localStorage.setItem('skin_quiz_final', JSON.stringify({ type:'', values:dataValues, avg:[50,55,50,60,52] }));
    go('result');
    renderResult();
  }

  el.nextBtn.addEventListener('click', ()=>{
    if (!isAnswered()) return;
    if (i<N-1){ i++; render(); } else { finish(); }
  });
  el.prevBtn.addEventListener('click', ()=>{ if (i>0){ i--; render(); focusCurrent(); } });
  render();
}

// Pentagon radar renderer
(function(){
  function clamp01(v){ return Math.max(0, Math.min(100, Number(v)||0)); }
  function fit5(arr, fill=50){
    const a = Array.isArray(arr) ? arr.slice(0,5) : [];
    while(a.length<5) a.push(fill);
    return a.map(clamp01);
  }
  function toXY(cx, cy, R, i, n, val){
    const angle = -Math.PI/2 + i*(2*Math.PI/n);
    const r = (clamp01(val)/100)*R;
    return [cx + r*Math.cos(angle), cy + r*Math.sin(angle)];
  }
  window.renderPentagon = function(svg, axes, avg, mine){
    if (!svg) return;
    const AX = Array.isArray(axes)&&axes.length===5 ? axes : ['Oil','Water retention','Sensitivity','Moisturizing','Elasticity'];
    const AVG = fit5(avg, 50);
    const MINE= fit5(mine, 50);
    const size=520, pad=36, cx=size/2, cy=size/2, R=size/2-pad;
    const ns='http://www.w3.org/2000/svg';
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    svg.setAttribute('viewBox',`0 0 ${size} ${size}`);

    // grid (pentagon rings at 20/40/60/80/100)
    [20,40,60,80,100].forEach(l=>{
      const pts = AX.map((_,i)=>toXY(cx,cy,R,i,AX.length,l)).map(p=>p.join(',')).join(' ');
      const poly=document.createElementNS(ns,'polygon');
      poly.setAttribute('points',pts);
      poly.setAttribute('fill','none');
      poly.setAttribute('stroke','#e5e7eb');
      poly.setAttribute('stroke-width','1');
      svg.appendChild(poly);
    });
    // axes
    AX.forEach((_,i)=>{
      const [x,y]=toXY(cx,cy,R,i,AX.length,100);
      const ln=document.createElementNS(ns,'line');
      ln.setAttribute('x1',cx);ln.setAttribute('y1',cy);
      ln.setAttribute('x2',x); ln.setAttribute('y2',y);
      ln.setAttribute('stroke','#e5e7eb'); ln.setAttribute('stroke-width','1');
      svg.appendChild(ln);
    });
    // draw polygon with markers
    function draw(vals, stroke, fill){
      const V = fit5(vals,50);
      const pts = AX.map((_,i)=>toXY(cx,cy,R,i,AX.length,V[i])).map(p=>p.join(',')).join(' ');
      const poly=document.createElementNS(ns,'polygon');
      poly.setAttribute('points',pts);
      poly.setAttribute('fill',fill);
      poly.setAttribute('stroke',stroke);
      poly.setAttribute('stroke-width','2.5');
      poly.setAttribute('stroke-linejoin','round');
      svg.appendChild(poly);
      AX.forEach((_,i)=>{
        const [mx,my]=toXY(cx,cy,R,i,AX.length,V[i]);
        const c=document.createElementNS(ns,'circle');
        c.setAttribute('cx',mx); c.setAttribute('cy',my); c.setAttribute('r','3.5'); c.setAttribute('fill',stroke);
        svg.appendChild(c);
      });
    }
    draw(AVG,'#18A999','rgba(24,169,153,0.16)');
    draw(MINE,'#FF6B6B','rgba(255,107,107,0.16)');

    // return anchor points for chips
    return AX.map((_,i)=>toXY(cx,cy,R*1.04,i,AX.length,100));
  };
})();

function renderResult(){
  // 1) 유도함수: 값 -> 타입 (예: DSPW, ORNT ...)
  function deriveType(vals){
    const [oil, water, sensitivity, moisturizing, elasticity] = vals;
    // 1글자: D/O (건성/지성) - oil 낮으면 D, 높으면 O
    const t1 = oil < 50 ? 'D' : 'O';
    // 2글자: S/R (민감/저자극) - sensitivity 높으면 S, 낮으면 R
    const t2 = sensitivity > 50 ? 'S' : 'R';
    // 3글자: P/N (색소침착 경향/비색소) - 보유 지표 부재 → 수분 보유 낮음 또는 보습 필요 높음이면 P로 간주
    const t3 = (water < 45 || moisturizing > 60) ? 'P' : 'N';
    // 4글자: W/T (주름 경향/탄력 좋음) - elasticity 낮으면 W, 높으면 T
    const t4 = elasticity < 50 ? 'W' : 'T';
    return t1 + t2 + t3 + t4;
  }

  // 2) 타입 요약 생성
  function getTypeSummary(type){
    const m = {
      D: 'Dry', O: 'Oily',
      S: 'Sensitive', R: 'Resistant',
      P: 'Pigmented-prone', N: 'Non‑pigmented',
      W: 'Wrinkle‑prone', T: 'Tight/firm'
    };
    const s0 = `${type}: ${m[type[0]]}, ${m[type[1]]}, ${m[type[2]]}, ${m[type[3]]}.`;

    // 간단 권장 포커스(옵션)
    const tips = [];
    if (type[0] === 'D') tips.push('focus on barrier repair and hydration');
    if (type[0] === 'O') tips.push('use lightweight, non‑comedogenic formulas');
    if (type[1] === 'S') tips.push('avoid fragrance and harsh actives');
    if (type[3] === 'W') tips.push('add daily SPF and firming care');

    return tips.length ? `${s0} Tips: ${tips.join('; ')}.` : s0;
  }

  // 기존 로딩 로직 유지
  const raw = localStorage.getItem('skin_quiz_final');
  const fallback = { values:[65,60,45,70,58], avg:[50,55,50,60,52] };
  const parsed = raw ? JSON.parse(raw) : {};
  const data = {
    // 기본값에 덮어쓰기
    type: parsed.type,               // 있으면 사용, 없으면 아래에서 산출
    values: parsed.values || fallback.values,
    avg: parsed.avg || fallback.avg
  };

  // 타입 자동 산출(테스트 응답 기반)
  data.type = data.type || deriveType(data.values);

  const AXES = ['Oil','Water retention','Sensitivity','Moisturizing','Elasticity'];
  const anchors = window.renderPentagon(document.getElementById('radar'), AXES, data.avg, data.values);

  // chips (기존 유지)
  const cls = v => v>=65?'good':(v<=35?'bad':'mid');
  anchors.forEach(([x,y],i)=>{
    const el = document.getElementById('chip'+i);
    if (!el) return;
    el.style.left = (x/520*100)+'%';
    el.style.top  = (y/520*100)+'%';
    el.className = 'axis-chip ' + cls(data.values[i]);
    el.textContent = `${AXES[i]} ${data.values[i]}`;
  });

  // mbti + summary (요청 반영)
  const mbti = document.getElementById('mbti');
  if (mbti) mbti.textContent = data.type;

  const summary = document.getElementById('summary');
  if (summary) summary.textContent = getTypeSummary(data.type);
}

// 해시 라우팅 부분은 그대로 사용
window.addEventListener('hashchange', ()=>{
  const target = (location.hash ? location.hash.replace('#','') : '') || 'home';
  show(pages.includes(target) ? target : 'home');
  if (target==='result') renderResult();
});

window.addEventListener('hashchange', ()=>{
  const target = (location.hash ? location.hash.replace('#','') : '') || 'home';
  show(pages.includes(target) ? target : 'home');
  if (target==='result') renderResult();
});

/* =====================[ BOJ Shopify match: MBTI → Good/Bad ingredients ]===================== */
/* Where added: appended at end of file; and one hashchange listener updated to call runBojMatching() */

const BOJ_COLLECTION_JSON = 'https://beautyofjoseon.com/collections/shop-all/products.json?limit=250';

/* 1) Recompute final result (values, avg, mbti) the same way as renderResult */
function boj_deriveType(vals){
  const [oil, water, sensitivity, moisturizing, elasticity] = vals;
  const t1 = oil < 50 ? 'D' : 'O';
  const t2 = sensitivity > 50 ? 'S' : 'R';
  const t3 = (water < 45 || moisturizing > 60) ? 'P' : 'N';
  const t4 = elasticity < 50 ? 'W' : 'T';
  return t1 + t2 + t3 + t4;
}
function boj_getOutcome(){
  const raw = localStorage.getItem('skin_quiz_final');
  const fallback = { values:[65,60,45,70,58], avg:[50,55,50,60,52] };
  const parsed = raw ? JSON.parse(raw) : {};
  const values = parsed.values || fallback.values;
  const type = (parsed.type && typeof parsed.type==='string') ? parsed.type : boj_deriveType(values);
  return { mbti: type, values };
}

/* 2) Ingredient lexicon (keywords to detect in tags/body_html) */
const BOJ_ING_LEXICON = {
  rice: ['rice','oryza','oryzanol','gamma oryzanol'],
  ginseng: ['ginseng','panax'],
  green_tea: ['green tea','camellia sinensis'],
  mugwort: ['mugwort','artemisia'],
  centella: ['centella','asiatica','madecassoside','asiaticoside','madecassic acid','asiatic acid'],
  propolis: ['propolis','honey','bee'],
  niacinamide: ['niacinamide','vitamin b3'],
  retinal: ['retinal','retinoid','vitamin a'],
  aha: ['aha','glycolic','lactic','mandelic'],
  bha: ['bha','salicylic'],
  pha: ['gluconolactone','lactobionic'],
  lha: ['capryloyl salicylic'],
  squalane: ['squalane','squalene'],
  hyaluron: ['hyaluronic','sodium hyaluronate'],
  fragrance: ['fragrance','parfum'],
  alcohol: ['alcohol denat','ethanol','sd alcohol'],
  essential_oil: ['lavender oil','citrus','bergamot','limonene','linalool','geraniol','citral']
};
const BOJ_LABELS = {
  rice:'Rice', ginseng:'Ginseng', green_tea:'Green Tea', mugwort:'Mugwort',
  centella:'Centella', propolis:'Propolis', niacinamide:'Niacinamide',
  retinal:'Retinal', aha:'AHA', bha:'BHA', pha:'PHA', lha:'LHA',
  squalane:'Squalane', hyaluron:'Hyaluronic', fragrance:'Fragrance',
  alcohol:'Alcohol', essential_oil:'Essential Oils'
};

/* 3) MBTI → preferred/avoid ingredient sets (basic demo rules, can customize) */
const BOJ_RULES = {
  'D*P*': { good:['squalane','hyaluron','rice','centella','niacinamide'], bad:['alcohol','fragrance','essential_oil','aha','bha','lha'] },
  'O*CW': { good:['bha','niacinamide','green_tea','mugwort','centella'], bad:['fragrance','essential_oil','squalane'] },
  '*S**': { good:['centella','green_tea','mugwort','hyaluron'], bad:['fragrance','alcohol','essential_oil','aha','bha','retinal'] },
  '*R*T': { good:['niacinamide','rice','retinal','aha','pha'], bad:['fragrance'] },
  'DEFAULT': { good:['niacinamide','rice','centella','green_tea'], bad:['fragrance','alcohol'] }
};
function boj_matchPattern(code, pattern){
  if (code.length!==4 || pattern.length!==4) return false;
  for (let i=0;i<4;i++){ if (pattern[i]!=='*' && pattern[i]!==code[i]) return false; }
  return true;
}
function boj_prefsFromMBTI(mbti){
  const good=new Set(), bad=new Set();
  Object.keys(BOJ_RULES).forEach(p=>{
    if (p==='DEFAULT') return;
    if (boj_matchPattern(mbti,p)){
      BOJ_RULES[p].good.forEach(g=>good.add(g));
      BOJ_RULES[p].bad.forEach(b=>bad.add(b));
    }
  });
  if (!good.size && !bad.size){
    BOJ_RULES.DEFAULT.good.forEach(g=>good.add(g));
    BOJ_RULES.DEFAULT.bad.forEach(b=>bad.add(b));
  }
  return { good:[...good], bad:[...bad] };
}

/* 4) Fetch products from Shopify public collection JSON */
async function boj_fetchProducts(){
  const res = await fetch(BOJ_COLLECTION_JSON, { mode:'cors' });
  if (!res.ok) throw new Error('Failed to fetch BOJ products');
  const data = await res.json();
  const products = Array.isArray(data) ? data : (data.products || []);
  return products;
}

/* 5) Extract ingredient keywords from product tags/body_html */
function boj_extractKeys(p){
  const acc = [];
  if (Array.isArray(p.tags)) acc.push(p.tags.join(' '));
  if (typeof p.body_html === 'string') acc.push(p.body_html.replace(/<[^>]+>/g,' '));
  const hay = acc.join(' ').toLowerCase();
  const found = new Set();
  for (const [k, terms] of Object.entries(BOJ_ING_LEXICON)){
    for (const t of terms){ if (hay.includes(t)){ found.add(k); break; } }
  }
  return [...found];
}

/* 6) Score product by prefs */
function boj_score(p, prefs){
  const keys = boj_extractKeys(p);
  let score = 0; const pos=[], neg=[];
  keys.forEach(k=>{
    if (prefs.good.includes(k)){ score+=2; pos.push(k); }
    if (prefs.bad.includes(k)){  score-=2; neg.push(k); }
  });
  return { score, pos:[...new Set(pos)], neg:[...new Set(neg)] };
}

/* 7) Render product cards into .product_grid */
function boj_renderProducts(products, prefs){
  const grid = document.querySelector('#result .product .product_grid');
  if (!grid) return;
  grid.innerHTML = '';
  const best = products.slice(0, 6);
  best.forEach(({ p, score, pos, neg })=>{
    const img = (p.images && p.images[0] && p.images[0].src) ? p.images[0].src : '';
    const title = p.title || 'Product';
    const url = `https://beautyofjoseon.com/products/${p.handle}`;
    const price = (p.variants && p.variants[0] && p.variants[0].price) ? `$${p.variants[0].price}` : '';
    const detail = (p.variants && p.variants[0] && p.variants[0].title && p.variants[0].title!=='Default Title') ? p.variants[0].title : '';

    const wrap = document.createElement('div');
    wrap.className = 'product_card';
    wrap.innerHTML = `
      <div class="heart">
        <img src="img/icon_heart_stroke.svg" alt="찜하기 아이콘">
      </div>
      <a href="${url}" target="_blank" rel="noopener">
        <img src="${img}" alt="${title}">
      </a>
      <button class="add_btn">ADD TO BAG</button>
      <div class="info">
        <h3>${title}</h3>
        <p>${p.product_type || p.vendor || ''}</p>
        <div class="tags"></div>
        <div class="bottom_txt">
          <div class="price">${price}</div>
          <div class="detail">${detail}</div>
        </div>
      </div>
    `;
    const tags = wrap.querySelector('.tags');
    // Good tags (max 3)
    pos.slice(0,3).forEach(k=>{
      const s=document.createElement('span'); s.textContent = `+ ${BOJ_LABELS[k]||k}`; tags.appendChild(s);
    });
    // Bad tags (max 2)
    neg.slice(0,2).forEach(k=>{
      const s=document.createElement('span'); s.textContent = `- ${BOJ_LABELS[k]||k}`; tags.appendChild(s);
    });
    grid.appendChild(wrap);
  });
}

/* 8) Controller: fetch, score, render (idempotent) */
let boj_lastRenderedMBTI = '';
async function runBojMatching(){
  try{
    const { mbti } = boj_getOutcome();
    if (mbti === boj_lastRenderedMBTI) return; // avoid duplicate render on double hashchange
    boj_lastRenderedMBTI = mbti;
    const prefs = boj_prefsFromMBTI(mbti);
    const products = await boj_fetchProducts();
    const scored = products.map(p=>{
      const s = boj_score(p, prefs);
      return { p, ...s };
    }).sort((a,b)=>b.score - a.score);
    boj_renderProducts(scored, prefs);
  }catch(err){
    console.error('[BOJ matching error]', err);
  }
}

/* 9) Hook: when entering #result, after renderResult() */
(function(){
  const origHandler = (e)=>{
    const target = (location.hash ? location.hash.replace('#','') : '') || 'home';
    if (target==='result') { try{ runBojMatching(); }catch(e){} }
  };
  // Attach one more listener; it's fine alongside existing ones.
  window.addEventListener('hashchange', origHandler);
  // If the page loads directly on #result, run once
  window.addEventListener('DOMContentLoaded', ()=>{
    const target = (location.hash ? location.hash.replace('#','') : '') || 'home';
    if (target==='result') { try{ runBojMatching(); }catch(e){} }
  });
})();
/* =====================[ /BOJ Shopify match ]===================== */


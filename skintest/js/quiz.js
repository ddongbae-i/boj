document.addEventListener('DOMContentLoaded', () => {
  // 섹션 참조
  const home = document.getElementById('home');
  const quiz = document.getElementById('quiz');
  const result = document.getElementById('result');

  // 컨트롤
  const startBtn = document.getElementById('test-start-btn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressEl = document.getElementById('progress');
  const barFill = document.getElementById('barFill');
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');

  // 결과 출력
  const resultType = document.getElementById('resultType');
  const resultDesc = document.getElementById('resultDesc');
  const retryBtn = document.getElementById('retryBtn');

  // 문항 데이터
  const questions = [
    {
      q: "Q1. How does your skin feel right after cleansing?",
      a: [
        { k: "A", t: "Tight or Dry" },
        { k: "B", t: "Comfortable" },
        { k: "C", t: "Shiny on T‑zone" },
        { k: "D", t: "Oily Overall" },
      ],
    },
    {
      q: "Q2. 하루가 지나면 피부는 어떤 느낌인가요?",
      a: [
        { k: "A", t: "화장이 들뜨고 건조함이 심해진다" },
        { k: "B", t: "부분적으로 유분과 건조가 동시에 나타난다" },
        { k: "C", t: "유분이 많아 번들거림으로 불편하다" },
        { k: "D", t: "예민해져 붉어짐·따가움이 생기거나 트러블이 올라온다" },
      ],
    },
    {
      q: "Q3. 외출할 때 피부 상태는 어떤가요?",
      a: [
        { k: "A", t: "햇빛만 쐬어도 쉽게 건조하고 붉어진다" },
        { k: "B", t: "땀과 피지가 동시에 올라와 관리가 어렵다" },
        { k: "C", t: "미세먼지나 더위에 쉽게 번들거린다" },
        { k: "D", t: "마스크·마찰에 약해 쉽게 붉어지고 트러블이 생긴다" },
      ],
    },
    {
      q: "Q4. 생활 습관 중 가장 해당되는 것은?",
      a: [
        { k: "A", t: "하루 대부분 실내 생활 (에어컨·난방 영향)" },
        { k: "B", t: "외부 활동이 잦아 자외선·먼지 노출 많음" },
        { k: "C", t: "불규칙한 수면, 스트레스가 잦음" },
        { k: "D", t: "카페인·음주 섭취가 잦아 피부 컨디션이 쉽게 흔들린다" },
      ],
    },
    {
      q: "Q5. 계절에 따라 피부가 어떻게 변하나요?",
      a: [
        { k: "A", t: "겨울에 특히 건조하고 트는 편" },
        { k: "B", t: "여름에만 유분이 많고 나머지는 건조" },
        { k: "C", t: "계절 상관없이 늘 번들거림이 심하다" },
        { k: "D", t: "환절기에 특히 예민해져 붉어짐과 트러블이 잦다" },
      ],
    },
    {
      q: "Q6. 현재 피부 고민 중 가장 큰 것은 무엇인가요?",
      a: [
        { k: "A", t: "피부가 늘 건조하고 각질이 잘 일어난다" },
        { k: "B", t: "모공이 넓어지고 번들거림이 신경 쓰인다" },
        { k: "C", t: "민감해서 쉽게 붉어지거나 트러블이 생긴다" },
        { k: "D", t: "피부가 칙칙하고 탄력이 부족하다" },
      ],
    },
    {
      q: "Q7. 화장 지속력은 어떤가요?",
      a: [
        { k: "A", t: "아침에 바른 화장이 오후에는 다 들뜬다" },
        { k: "B", t: "T존만 번들거려 화장이 무너진다" },
        { k: "C", t: "전체적으로 번들거려 금방 지워진다" },
        { k: "D", t: "시간이 지나며 다크닝이 심해 메이크업이 칙칙해 보인다" },
      ],
    },
    {
      q: "Q8. 평소 스킨케어 루틴은 어떤가요?",
      a: [
        { k: "A", t: "보습 위주 (크림, 에센스)" },
        { k: "B", t: "유분 조절 위주 (토너, 오일 컨트롤 제품)" },
        { k: "C", t: "진정·장벽 강화 위주 (시카, 쑥, 허브 성분)" },
        { k: "D", t: "특별히 꾸준히 하는 루틴은 없다" },
      ],
    },
    {
      q: "Q9. 수분 섭취와 식습관은 어떤 편인가요?",
      a: [
        { k: "A", t: "물을 잘 안 마셔서 피부가 쉽게 건조하다" },
        { k: "B", t: "기름진 음식이나 야식을 자주 먹는다" },
        { k: "C", t: "과일·채소 섭취가 많아 비교적 건강하다" },
        { k: "D", t: "카페인·알코올 섭취가 잦아 수분 손실이 쉽다" },
      ],
    },
    {
      q: "Q10. 원하는 피부 변화는 무엇인가요?",
      a: [
        { k: "A", t: "촉촉하고 매끈한 피부" },
        { k: "B", t: "유분은 줄이고 피부결은 산뜻하게" },
        { k: "C", t: "민감·붉은기를 줄이고 편안하게" },
        { k: "D", t: "칙칙함을 없애고 환하게" },
      ],
    },
  ];

  // 상태
  let idx = 0;
  const selections = Array(questions.length).fill(null); // "A"/"B"/"C"/"D"

  // 섹션 토글
  function show(section){
    home.hidden = section !== 'home';
    quiz.hidden = section !== 'quiz';
    result.hidden = section !== 'result';
    if(section === 'quiz'){ window.scrollTo({top:0, behavior:'smooth'}); }
    history.replaceState({page:section}, "", `#${section}`);
  }

  // 렌더링
  function render(){
    const total = questions.length;
    const current = idx + 1;
    const q = questions[idx];

    progressEl.textContent = `${current} / ${total}`;
    barFill.style.width = `${(current/total)*100}%`;
    questionEl.textContent = q.q;

    optionsEl.innerHTML = "";
    q.a.forEach(({k,t}) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', selections[idx] === k ? 'true' : 'false');
      btn.innerHTML = `<span class="k">${k}.</span><span class="t">${t}</span>`;
      if(selections[idx] === k) btn.classList.add('selected');

      btn.addEventListener('click', () => {
        selections[idx] = k;
        [...optionsEl.children].forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-checked','false'); });
        btn.classList.add('selected');
        btn.setAttribute('aria-checked','true');
        nextBtn.disabled = false;
      });

      optionsEl.appendChild(btn);
    });

    prevBtn.disabled = idx === 0;
    nextBtn.textContent = idx === total - 1 ? '결과 보기' : '다음';
    nextBtn.disabled = selections[idx] == null;
  }

  // 결과 계산: 최다 선택 키(A/B/C/D)
  function calculateResult(){
    const score = { A:0, B:0, C:0, D:0 };
    selections.forEach(k => { if(k) score[k]++; });
    const topKey = Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0];

    const map = {
      A: {
        title: "건성 경향 — 수분·보습 강화",
        desc: "세안 후 당김/각질, 메이크업 들뜸이 잦아요. 세라마이드/히알루론산/스qualane 등으로 보습 레이어링하고, 미지근한 물 세안과 순한 클렌저를 사용해 유수분 장벽을 보호하세요."
      },
      B: {
        title: "복합성 경향 — 밸런싱/모공 케어",
        desc: "T존 번들 + U존 건조가 교차합니다. 피지 컨트롤 토너(BHA 저자극), 가벼운 젤 크림, 주 1–2회 모공 케어를 병행하고 보습은 영역별로 차등 적용하세요."
      },
      C: {
        title: "지성 경향 — 유분/각질 컨트롤",
        desc: "전반적 번들거림과 메이크업 무너짐이 고민입니다. 과도한 탈지 대신 수분 공급, 논코메도 제형, 살리실산·녹차 등으로 유분을 정돈하세요."
      },
      D: {
        title: "민감/톤 개선 경향 — 진정·장벽",
        desc: "자극에 의한 붉어짐·칙칙함이 동반됩니다. 페이스 마찰 최소화, 향료/알코올 민감 시 회피, 판테놀/마데카소사이드/어성초 등 진정 성분 중심으로 루틴을 단순화하세요."
      }
    };

    return map[topKey];
  }

  // 이벤트
  startBtn.addEventListener('click', () => {
    idx = 0;
    selections.fill(null);
    show('quiz');
    render();
  });

  prevBtn.addEventListener('click', () => {
    if(idx > 0){ idx--; render(); }
  });

  nextBtn.addEventListener('click', () => {
    if(idx < questions.length - 1){
      idx++; render();
    } else {
      // 결과
      const r = calculateResult();
      resultType.textContent = r.title;
      resultDesc.textContent = r.desc;
      show('result');
    }
  });

  retryBtn.addEventListener('click', () => {
    idx = 0;
    selections.fill(null);
    show('home');
    window.scrollTo({top:0});
  });

  // 해시 진입 처리(#quiz/#result)
  const hash = location.hash.replace('#','');
  if(['quiz','result'].includes(hash)){
    if(hash === 'quiz'){ idx = 0; render(); }
    show(hash);
  } else {
    show('home');
  }

  // 키보드 접근성: 좌/우로 옵션 이동
  optionsEl.addEventListener('keydown', (e) => {
    const items = [...optionsEl.querySelectorAll('.option')];
    if(!items.length) return;
    const cur = items.findIndex(it => it.classList.contains('selected'));
    if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){
      const next = items[(Math.max(cur, -1)+1)%items.length];
      next.focus(); next.click();
      e.preventDefault();
    }
    if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
      const prev = items[(cur - 1 + items.length)%items.length];
      prev.focus(); prev.click();
      e.preventDefault();
    }
  });
});

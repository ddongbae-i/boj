gsap.registerPlugin(ScrollTrigger, Flip);

// 섞기/흩뿌리기
function shuffleChildren(container){
  const nodes = Array.from(container.children);
  for(let i=nodes.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [nodes[i],nodes[j]] = [nodes[j],nodes[i]];
  }
  nodes.forEach(n => container.appendChild(n));
}
function scatterTiles(tiles){
  tiles.forEach(t=>{
    gsap.set(t,{
      rotation: gsap.utils.random(-15,15),
      scale: gsap.utils.random(0.88,1.12),
      x: gsap.utils.random(-60,60),
      y: gsap.utils.random(-60,60),
      zIndex: Math.floor(gsap.utils.random(1,20)),
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    });
  });
}
// 스크롤 잠금(비디오 시작 직후 체감 1회 고정)
function lockScroll(ms=900){
  const html = document.documentElement, prev = html.style.overflow;
  const prevent = e => e.preventDefault();
  html.style.overflow = "hidden";
  window.addEventListener("wheel", prevent, {passive:false});
  window.addEventListener("touchmove", prevent, {passive:false});
  setTimeout(()=>{
    html.style.overflow = prev || "";
    window.removeEventListener("wheel", prevent, {passive:false});
    window.removeEventListener("touchmove", prevent, {passive:false});
  }, ms);
}

window.addEventListener("load", () => {
  const section = document.getElementById("puzzleSection");
  const grid    = document.getElementById("grid");
  const video   = document.getElementById("finalVideo");
  const hint    = document.getElementById("scrollHint");

  if(!section || !grid || !video){
    console.error("필수 요소를 찾지 못했어요. id 확인: #puzzleSection, #grid, #finalVideo");
    return;
  }

  // 0) 초기: 섞여서 시작
  shuffleChildren(grid);
  scatterTiles([...grid.children]);

  // 1개의 pin으로 3구간(+=300%)
const tl = gsap.timeline({
  defaults:{ ease:"none" },
  scrollTrigger:{
    trigger: section,
    start: "top top",
    end: "+=300%",
    pin: true,
    scrub: true,
    anticipatePin: 1,   // ← 덜컹 방지: 1~2 정도가 이상적
    // markers: true
  }
});
  tl.addLabel("assemble", 0);
  tl.addLabel("squash",   1); // 33% 지점
  tl.addLabel("video",    2); // 66% 지점

  // ─ ① 섞임 → 완성 (구간 0→1)
  tl.add(()=>{
    const state = Flip.getState(".tile");
    const sorted = [...grid.children].sort((a,b)=> (+a.dataset.key) - (+b.dataset.key));
    sorted.forEach(el=>grid.appendChild(el));
    gsap.set(".tile",{ rotation:0, x:0, y:0, scale:1, zIndex:1, boxShadow:"0 0 0 rgba(0,0,0,0)" });
    const flipTween = Flip.from(state,{ absolute:true, duration:1.0, ease:"power3.out", stagger:0.02 });
    tl.add(flipTween, "assemble");
  }, "assemble");
  tl.to({}, {duration:1}, "assemble");

  // ─ ② 붙이기 (구간 1→2) : grid와 video 패딩 동시에 0
  tl.add(()=>{
    grid.style.gap = "0px";
    grid.style.padding = "0px";
    document.querySelectorAll(".tile").forEach(el => el.style.borderRadius = "0px");
    gsap.set(video, { padding: 0 }); // ← 영상도 0으로 (크기 계속 동일)
  }, "squash+=0.02");
  tl.to({}, {duration:1}, "squash");

  // ─ ③ 비디오 재생 (구간 2→3) : 사진 숨기고, 고정 유지
  tl.add(()=>{
    grid.style.visibility = "hidden";

    const play = () => { video.currentTime = 0; video.play().catch(()=>{}); };
    (video.readyState >= 2) ? play() : video.addEventListener("canplay", play, {once:true});

    // 시작 직후 잠깐 스크롤 봉인(체감상 1번 고정)
    lockScroll(900);
  }, "video+=0.02");
  tl.to({}, {duration:1}, "video");

  // 인디케이터: 계속 떠 있고, 클릭 시 아래로 스크롤
  hint?.addEventListener("click", ()=>{
    window.scrollBy({ top: window.innerHeight*0.8, behavior:"smooth" });
  });

  // 되감기 안정화: 66% 이전으로 올라오면 grid 보이기 + 영상 패딩 복귀(6px)
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end:   "+=300%",
    onUpdate: (self)=>{
      if(self.progress < 0.66){
        grid.style.visibility = "visible";
        if(self.progress < 0.33) gsap.set(video, { padding: 6 });
      }
    }
  });

  // 레이아웃 계산 보정
  setTimeout(()=> ScrollTrigger.refresh(true), 300);
});

//option

const optionMenu = document.querySelectorAll('.option ul li');
const optionBtn = document.querySelectorAll('.p_right .option button');

optionBtn.forEach(function (btn, index) {
    btn.addEventListener('click', function () {
        const isActive = selectMenuAll[index].classList.contains('active');
        //contains - 클래스 리스트에 active가 포함되어 있는가
        console.log(isActive)
        //모두닫기
        optionMenu.forEach(function (p_right) {
            p_right.classList.remove('active');
        });
        //클릭한게 원래 열려있지 않았다면 다시 열기
        if (!isActive) {
            optionMenu[index].classList.add('active');
        }
    })
})


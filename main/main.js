
document.addEventListener('DOMContentLoaded', () => {
    // 0) GSAP 체크
    if (!window.gsap) {
        console.error('[bestSeller] GSAP가 로드되지 않았습니다.');
        return;
    }

    // 1) 요소 가져오기
    const track = document.querySelector('.bestSeller .top');
    if (!track) { console.error('[bestSeller] .bestSeller .top 을 찾을 수 없습니다.'); return; }

    const originalImgs = Array.from(track.querySelectorAll('img'));
    if (originalImgs.length === 0) { console.error('[bestSeller] .top 안에 <img>가 없습니다.'); return; }

    // 2) 보이는 수/복제 개수
    const VISIBLE = 4;
    const cloneCount = Math.min(VISIBLE, originalImgs.length);

    // 무한루프를 위해 앞에서 VISIBLE 개 이미지를 복제해서 뒤에 붙임
    for (let i = 0; i < cloneCount; i++) {
        track.appendChild(originalImgs[i].cloneNode(true));
    }

    // 3) 레이아웃 보정(고정폭 CSS 충돌 대비)
    //    (이미 CSS에 넣었어도 중복 무해)
    Object.assign(track.style, { display: 'flex', overflow: 'hidden' });
    track.querySelectorAll('img').forEach(el => {
        el.style.flex = '0 0 25%';
        el.style.maxWidth = '25%';
        el.style.height = 'auto';
        el.style.objectFit = 'contain';
        el.style.display = 'block';
    });

    // 4) 슬라이드 로직
    const TOTAL = originalImgs.length;        // 원본 개수 (예: 5)
    const STEP = 100 / VISIBLE;               // 한 칸 이동 퍼센트 (25%)
    let index = 0;

    // 자동 루프 타임라인(끊김 없이)
    const tl = gsap.timeline({ repeat: -1 });

    function addSlide(delay = 1.4, moveDur = 0.8) {
        tl.to(track, {
            xPercent: () => -(++index) * STEP,
            duration: moveDur,
            ease: 'power2.out',
            onComplete: () => {
                // 원본 끝(=복제 시작 지점)에 도달하면 순간 리셋
                if (index === TOTAL) {
                    gsap.set(track, { xPercent: 0 });
                    index = 0;
                }
            }
        }, `+=${delay}`);
    }

    // 부드러운 첫 루프를 위해 TOTAL 단계만큼 쌓아두기
    for (let i = 0; i < TOTAL; i++) addSlide();

    // 5) 호버 일시정지/재개 (선택)
    track.addEventListener('mouseenter', () => tl.pause());
    track.addEventListener('mouseleave', () => tl.resume());

    // 6) 리사이즈에도 안전(퍼센트 기반이라 기본적으로 문제 없지만, 강제 리셋 옵션)
    window.addEventListener('resize', () => {
        const wasPaused = tl.paused();
        tl.pause(0);
        gsap.set(track, { xPercent: 0 });
        index = 0;
        if (!wasPaused) tl.play(0);
    });
});

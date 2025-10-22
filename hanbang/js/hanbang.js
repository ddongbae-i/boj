AOS.init({
  duration: 1200, // 애니메이션 시간(ms)
  once: false, // 스크롤 시 한 번만 실행
});

document.addEventListener("DOMContentLoaded", () => {
  // 1. 하트 클릭 이벤트
  const hearts = document.querySelectorAll(".product_card .heart img");
  hearts.forEach((heart) => {
    heart.addEventListener("click", (e) => {
      e.stopPropagation(); // 카드 클릭 이벤트와 겹치지 않도록 방지
      heart.classList.toggle("liked"); // liked 클래스 토글

      if (heart.classList.contains("liked")) {
        heart.src = "./img/mini_icon_heart_hover.svg"; // 찜 완료 아이콘
      } else {
        heart.src = "./img/heart1.svg"; // 원래 아이콘
      }
    });
    
  });

  // 2. ADD TO BAG 클릭 이벤트
  const addBtns = document.querySelectorAll(".product_card .add_btn");
  addBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault(); // a 태그 기본 링크 막기
      const productName = btn.closest(".product_card").querySelector("h3").innerText;
      alert(`${productName}이(가) 장바구니에 추가되었습니다.`);
      // 실제 장바구니 로직 구현 시 여기에 코드를 추가
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
    const filterItems = document.querySelectorAll(".product_filter li");

    // 페이지 로드 시 Ginseng 활성화
    filterItems.forEach(item => {
        if(item.textContent.trim() === "Ginseng") {
            item.classList.add("active");
        }
    });

    // 클릭 이벤트
    filterItems.forEach(item => {
        item.addEventListener("click", () => {
            // 모든 탭 active 제거
            filterItems.forEach(i => i.classList.remove("active"));
            // 클릭한 탭 active 추가
            item.classList.add("active");

            // 선택된 탭 텍스트 확인 (필터용)
            const filterText = item.textContent.trim().toLowerCase();

            // 모든 제품 카드 선택
            const productCards = document.querySelectorAll(".product_card");

            // 필터 적용
            productCards.forEach(card => {
                // 예: 카드에 ginseng, rice 등 클래스가 있어야 함
                if(card.classList.contains(filterText)) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});
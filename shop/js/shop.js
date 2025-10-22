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
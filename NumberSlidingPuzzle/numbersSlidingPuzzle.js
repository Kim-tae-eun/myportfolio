let size = 5;
let timeId = null;
const NORTH = 1;
const EAST = 2;
const SOUTH = 3;
const WEST = 4;

//타일생성
function init() {
    let num = 1;
    let $middle = document.querySelector("#middle");
    let $table = document.createElement("table");
    $table.id = "table";

    let emptyY = 0;
    let emptyX = 0;
    
    let $tdList = [];

    for(let i = 0; i < size; i++){
        let tmp = [];

        for(let j = 0; j < size; j++){
            tmp.push(num);

            if(i == size - 1 && j == size - 1){
                emptyY = i;
                emptyX = j;
            }
            num++;
        }
        $tdList.push(tmp);
    }

    //셔플
    for(let i = 0; i < 500; i++){

        // 빈칸위치 찾기(마지막 번호)
        for(let j = 0; j < $tdList.length; j++){
            for(let k = 0; k < $tdList[j].length; k++){
                if($tdList[j][k] == size * size){
                    emptyY = j;
                    emptyX = k;
                }
            }
        }

        // 슬라이딩방식으로 섞기
        while(true){
            let r = Math.floor(Math.random() * 4) + 1;
        
            if(r == NORTH && 0 <= emptyY-1){
                $tdList[emptyY][emptyX] = $tdList[emptyY-1][emptyX];
                $tdList[emptyY-1][emptyX] = size * size;
                break;
            }else if(r == EAST && emptyX+1 < size){
                $tdList[emptyY][emptyX] = $tdList[emptyY][emptyX+1];
                $tdList[emptyY][emptyX+1] = size * size;
                break;
            }else if(r == SOUTH && emptyY+1 < size){
                $tdList[emptyY][emptyX] = $tdList[emptyY+1][emptyX];
                $tdList[emptyY+1][emptyX] = size * size;
                break;
            }else if(r == WEST && 0 <= emptyX-1){
                $tdList[emptyY][emptyX] = $tdList[emptyY][emptyX-1];
                $tdList[emptyY][emptyX-1] = size * size;
                break;
            }
        }
    }

    // 이벤트 추가
    for(let i = 0; i < size; i++){
        let $tr = document.createElement("tr");
        $tr.className = "trow";

        for(let j = 0; j < size; j++){
            let $td = document.createElement("td");
            $td.addEventListener("click", clickEvent);

            $td.innerText = $tdList[i][j];
            if($td.innerText == size * size){
                $td.innerText = "";
            }
            if($td.innerText == ""){
                $td.style.backgroundColor="white";
                $td.style.cursor="auto";
            }
            $tr.append($td); 
        }
        $table.append($tr);
    }
    $middle.append($table);
}

//타일이동
function clickEvent() {
    let x = 0;
    let y = 0;

    let switchingX = 0;
    let switchingY = 0;

    let $tr = document.querySelectorAll(".trow");
   
    let num = 1;
    let count = 0;

    for(let i = 0; i < $tr.length; i++){
        for(let j = 0; j < $tr[i].children.length; j++){
            if($tr[i].children[j].innerText == ""){
                y = i;
                x = j;
            }
        }
    }

    for(let i = 0; i < $tr.length; i++){
        // $table.children.length 는 안되나?
        // 장바구니 예제에서는 tbody때문에 children[0].children 라고 썼었는데
        // 슬라이드 예제는 콘솔창에 tbody가 없음. 차이는?
        // ==> js로 동적으로 그린건 그린 것만 나오고, html 문법으로 적은건 tbody 자동 생성
        for(let j = 0; j < $tr[i].children.length; j++){
            if($tr[i].children[j].innerText == this.innerText){
                switchingY = i;
                switchingX = j;
            }
        }
    }

    if(switchingX == x && switchingY == y + 1 || switchingX == x && switchingY == y - 1 ||
    switchingX == x + 1 && switchingY == y || switchingX == x - 1 && switchingY == y){
        let tmp = this.innerText;
        this.innerText = "";
        this.style.backgroundColor="white";
        this.style.cursor="auto";

        $tr[y].children[x].innerText = tmp;
        $tr[y].children[x].style.backgroundColor="rgb(111, 175, 218)";
        $tr[y].children[x].style.cursor="pointer";
        console.log("클릭한 타일 innerText = " + tmp + ", 교체 타일 innerText = " + this.innerText);
        
        if(document.querySelector("#timer").innerText == "0.00"){
            startClock();
        }
    }

    //게임종료
    for(let i = 0; i < $tr.length; i++){
        for(let j = 0; j < $tr[i].children.length; j++){
            if($tr[i].children[j].innerText == num){
               count++;
            }
            num++;
        }
        if(count == size * size - 1){
            stopClock();
            removeEvent();
        }
    }
}

//다시하기
function replay() {
    location.href="numbersSlidingPuzzle.html"
}

let second = 0;
let timer = 0;

//타이머
function startClock() {
    second += 0.01;
    document.querySelector("#timer").innerText = second.toFixed(2);
    // 1000 = 1초
    timeId = setTimeout(startClock, 10);
}

//타이머중단
function stopClock() {
    clearTimeout(timeId);
}

//게임종료시 타일이동삭제
function removeEvent() {
    let $tr = document.querySelectorAll(".trow");

    for(let i=0; i<size; i++) {
        for(let j=0; j<size; j++) {
            $tr[i].children[j].removeEventListener("click", clickEvent);
            $tr[i].children[j].style.cursor = "auto";
        }
    }
}
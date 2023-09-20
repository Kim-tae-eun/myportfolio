let size = 15;
let snakeSize = 4;

let snakeY = [0,0,0,0];
let snakeX = [0,1,2,3];
let data = [];

let item = size * size;
let itemCount = 0;

let dir = 1;
let gameOver = false;
let count = 3;

let myInterval = null;
let myTimeout = null;

let $center = document.querySelector("#center");
let $gameTable = document.querySelector("#gameTable");

function setTable() {
    //테이블 생성
    $gameTable = document.createElement("table");
    $gameTable.id = "gameTable";

    for(let i = 0; i < size; i++) {
        $tr = document.createElement("tr");
        
        for(let j = 0; j < size; j++) {
            $td = document.createElement("td");

            $tr.append($td);
        }
        $gameTable.append($tr);
    }
    $center.append($gameTable);
}

function setItem() {
    //아이템 생성
    while(true) {
        let y = Math.floor(Math.random() * size);
        let x = Math.floor(Math.random() * size);

        console.log("data = ");
        if(data[y][x] == "0") {
            
            for(let i = 0; i < data.length; i++){
                console.log(data[i]);
            }
            
            data[y][x] = item;
            $gameTable.children[y].children[x].setAttribute("class", "item");

            let $img = document.createElement('img');
            $img.id="img";
            $img.src="images/apple.png";
            $gameTable
            .children[y].children[x].append($img);
            break;
        }
    }
}

function init() {
    //데이터배열에 스네이크 넣기
    data = [];

    for(let i = 0; i < size; i++){
        let tmp = [];
        for(let j = 0; j < size; j++){
            tmp.push(0);
        }
        data.push(tmp);
    }
    
    for(let i = 0; i < snakeSize; i++){
        data[snakeY[i]][snakeX[i]] = i+1;
        $gameTable.children[snakeY[i]].children[snakeX[i]].setAttribute("class", "snakeBody");
    }
    $gameTable.children[snakeY[snakeSize - 1]].children[snakeX[snakeSize - 1]].setAttribute("class", "snakeHead");
    setItem();
}

function setCount() { 
    //게임 재시작 카운트
    if(count >= 0) {
        document.querySelector("#footer").innerHTML = "Game Over<br>" + count;
    } else {
        clearInterval(myTimeout);
        location.href = "snakeGame.html";
    }

    myTimeout = setTimeout(setCount, 1000);
    count--;
}


function moveSnake() {
    // 게임 종료
    if(gameOver) {
        setCount();
        clearInterval(myInterval);
    }

    // 임시변수에 이동할 머리 저장하기
    let tempY = snakeY[snakeSize - 1];
    let tempX = snakeX[snakeSize - 1];

    if(dir == 0) {
        tempY -= 1;
    } else if(dir == 1) {
        tempX += 1;
    } else if(dir == 2) {
        tempY += 1;
    } else if(dir == 3) {
        tempX -= 1;
    }
   
    // 상하 벽에 부딪히면,
    if(size <= tempY || tempY < 0) {
        gameOver = true;
        return;
    }
    // 좌우 벽에 부딪히면,
    if(size <= tempX || tempX < 0) {
        gameOver = true;
        return;
    }
    //  아이템이 아닌, 자신의 몸에 닿으면
    if(data[tempY][tempX] != 0 && data[tempY][tempX] != item) {
        gameOver = true;
        return;
    }

    // 기존 위치 초기화
    for(let i = 0; i < snakeSize; i++) {
        $gameTable.children[[snakeY[i]]].children[snakeX[i]].setAttribute("class", "");
        data[snakeY[i]][snakeX[i]] = 0;
    }

    // 아이템을 먹었다면 몸통 늘리기
    let itemCheck = false;
    if(data[tempY][tempX] == item) {
        itemCheck = true;
        // unshift : 배열의 맨 앞에 값을 추가하기
        snakeY.unshift(tempY);
        snakeX.unshift(tempX);
        
        snakeSize += 1;
        itemCount += 1;
        
        document.querySelector("#appleCount").innerText = itemCount;

        $gameTable.children[tempY].children[tempX].setAttribute("class", "");
        $gameTable.children[tempY].children[tempX].innerHTML="";
    }

    // 스네이크 이동
    // 몸통 값 수정
    for(let i = 1; i < snakeSize; i++) {
        snakeY[i - 1] = snakeY[i];
        snakeX[i - 1] = snakeX[i];
    }
    // 머리 값 수정
    snakeY[snakeSize - 1] = tempY;
    snakeX[snakeSize - 1] = tempX;
    
    // 스네이크 표시
    for(let i = 0; i < snakeSize; i++){
        data[snakeY[i]][snakeX[i]] = i+1;
        $gameTable.children[snakeY[i]].children[snakeX[i]].setAttribute("class", "snakeBody");
    }
    $gameTable.children[snakeY[snakeSize - 1]].children[snakeX[snakeSize - 1]].setAttribute("class", "snakeHead");
    
    if(itemCheck){
        setItem();
    }
}

function gameStart() {
    //키값(방향) 가져오기
    myInterval = setInterval(moveSnake, 100);   

    document.querySelector("#palyButton").setAttribute("disabled", true);
    document.querySelector("#palyButton").style.background = "lightgray";

    window.addEventListener("keydown", (e) => {
        let key = e.code;
        // 북(0) 동(1) 남(2) 서(3)
        if(dir != 1 && key == "ArrowLeft") {
            dir = 3;
        } else if(dir != 3 && key == "ArrowRight") {
            dir = 1;
        } else if(dir != 2 && key == "ArrowUp") {
            dir = 0;
        } else if(dir != 0 && key == "ArrowDown") {
            dir = 2;
        }
    });
}

function openPop() {
    document.querySelector("#popup_layer").style.display = "block";
}

function closePop() {
    document.querySelector("#popup_layer").style.display = "none";
}

setTable();
init();

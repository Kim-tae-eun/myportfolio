let row = 23;
let col = 12;
let dataList = [];
let preview = [];
let lineClearCount = 0;
let level = 1;
let colorList = ["black", "green", "red", "purple", "orange", "blue", "yellow", "skyblue", "gray"];
let curRandom = -1;
let nextRandom = 0;
let nextLength = 7;
let sec = 0;
let speed = 500;
let score = 0;
let downScore = 0;

const BLACK = 0;
const GRAY = 8;
const BLOCK = GRAY;
const STACK = 9;

let curY = 0;    // 처음 생성되는 블럭의 시작 y좌표
let curX = 0;    // 처음 생성되는 블럭의 시작 x좌표
let curBlock = null;    // 현재 블럭의 정보 저장(전역변수 설정)
let nextBlock = null;
let set = [false, false, false, false, false, false, false];

let gameOver = false; 
let myInterval = null;

let blockList = [
    {
        name: "s",
        color: 1,
        shape:
            [
                [0, 0, 0],
                [0, 1, 1],
                [1, 1, 0]
            ]
    },
    {
        name: "z",
        color: 2,
        shape:
            [
                [0, 0, 0],
                [1, 1, 0],
                [0, 1, 1]
            ]
    },
    {
        name: "t",
        color: 3,
        shape:
            [
                [0, 0, 0],
                [1, 1, 1],
                [0, 1, 0]
            ]
    },
    {
        name: "l",
        color: 4,
        shape:
            [
                [0, 1, 0],
                [0, 1, 0],
                [0, 1, 1]
            ]
    },
    {
        name: "j",
        color: 5,
        shape:
            [
                [0, 1, 0],
                [0, 1, 0],
                [1, 1, 0]
            ]
    },
    {
        name: "o",
        color: 6,
        shape:
            [
                [1, 1],
                [1, 1]
            ]
    },
    {
        name: "i",
        color: 7,
        shape:
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
            ]
    }
];

// 테트리스 생성 + 데이터 리스트 입력 + 초기화
function init() {
    console.log("init!!");
    // 초기화
    dataList = [];
    curY = 0;
    curX = 0;
    curRandom = -1;
    curBlock = null;
    gameOver = false;
    myInterval = null;
    lineClearCount = 0;
    level = 1;
    sec = 0;
    speed = 1000;
    // score = 0;
    // document.querySelector("#score").innerText = score;
    

    if(document.querySelector("#myTetris") != null) {
        document.querySelector("#myTetris").remove();
    }

    // 테트리스 생성 + 데이터 리스트 입력
    let $tetrisCenter = document.querySelector("#tetrisCenter");
    $tetrisCenter.id="tetrisCenter";
    let $myTetris = document.createElement("table");
    $myTetris.id="myTetris";

    for(let i = 0; i < row; i++){
        let $tetrisTr = document.createElement("tr");
        let tmp = [];

        for(let j = 0; j < col; j++){
            let $tetrisTd = document.createElement("td");
            $tetrisTr.append($tetrisTd);
            tmp.push(0);
        }
        $myTetris.append($tetrisTr);
        dataList.push(tmp);
    }
    $tetrisCenter.append($myTetris);

    // 벽 생성
    for(let i = 0; i < row; i++){
        for(let j = 0; j < col; j++){
            if(i == 0){
                dataList[i][j] = "00";
                $myTetris.children[i].children[j].className="white";
            }
            if(i == row - 1 || j == 0 || j == col - 1){
                dataList[i][j] = GRAY;
                $myTetris.children[i].children[j].className=colorList[GRAY];
            }
        }
    }

    nextInit();
    myInterval = setInterval(playGame, speed);
}

// 다음 블럭 테이블 생성
function nextInit(){
     if(document.querySelector("#nextTable") != null) {
        document.querySelector("#nextTable").remove();
        set = [false, false, false, false, false, false, false];
    }
    
    let $nextScreen = document.querySelector("#nextScreen");
    let $nextTable = document.createElement("table");
    $nextTable.id="nextTable";

    for(let i = 0; i < nextLength; i++){
        let $nextTr = document.createElement("tr");

        for(let j = 0; j < nextLength; j++){
            let $nextTd = document.createElement("td");
            $nextTr.append($nextTd);
        }
        $nextTable.append($nextTr);
    }
    $nextScreen.append($nextTable);

    nextBlock = blockList[nextRandom];
}

// 게임시작 (0.5초마다 계속 호출됨)
function playGame() {
    // 60초마다 난이도 상승
    sec += 1;
    if(sec == 60){
        let decrease = 150;
        if(3 < level){
            decrease = 50;
        }
        if(6 < level){
            decrease = 20;
        }
        if(9 < level){
            decrease = 0;
        }

        sec = 0;
        speed -= decrease;
        // console.log(level + "레벨 " + speed + "speed");
        clearInterval(myInterval);
        myInterval = setInterval(playGame, speed);
        level += 1;
        document.querySelector("#level").innerText = level;
    }

    // 게임종료시
    if(gameOver == true) {
        clearInterval(myInterval);
        alert("게임종료!");
        init();
        setNewBlock();
        draw();

        return;
    }

    // 더이상 못 내려갈때
    if(down() == false) {
        lineClear();
        setNewBlock();
    }
    draw();
}

// 랜덤으로 블럭 생성 + curBlock 초기화 + 게임종료 확인
function setNewBlock() {

    // 게임 처음엔 한세트 안에서 랜덤으로 블럭 선택
    if(curRandom == -1){
        curRandom = Math.floor(Math.random() * blockList.length);
        set[curRandom] = true;
        // console.log("curRandom = " + blockList[curRandom].color);
    }else{
        curRandom = nextRandom;
        set[curRandom] = true;
    }
    curBlock = blockList[curRandom];
    // console.log("set = " + set);

    let reset = 0;
    for(let i = 0; i < set.length; i++){
        if(set[i] == true){
            reset += 1;
        }
    }
    if(reset == 7){
        // console.log("set 초기화!");
        set = [false, false, false, false, false, false, false];
    }

    // 게임 도중엔 한 세트에서 중복없이 지정
    while(true){
        nextRandom = Math.floor(Math.random() * blockList.length);
        // console.log("nextRandom = " + blockList[nextRandom].color);

        if(set[nextRandom] == false){
            nextBlock = blockList[nextRandom];
            break;
        }
    }

    let shape = curBlock.shape;    
    // console.log(shape);

    // 블럭 생성 위치 설정
    let check = false;
    for(let x = 0; x < shape.length; x++){
        if(shape[0][x] == 1){
            check = true;
        }
    }
    if(check){
        curY = 1;
        curX = 4;
    }else{
        curY = 0;
        curX = 4;
    }

    // 게임 종료여부 확인
    isGameOver();
    
    for(let y = 0; y < shape.length; y++) {
        for(let x = 0; x < shape[y].length; x++) {
            if(shape[y][x] == 1) {
                dataList[curY + y][curX + x] = curBlock.color;
            }
        }
    }
    
    setPreview();
    drawNext();
}

// 변수명 작명
// set~ : 데이터 저장
// get~ : return 값 받는것.
// 여기 수정해야함 ㅠㅠ 바닥 프리뷰
function setPreview() {
    let preY = 0;
    let $myTetris = document.querySelector("#myTetris");

    curBlock = blockList[curRandom];
    let shape = curBlock.shape;
    let realBlock = [];


    // 실제 테이블 상 블럭 위치
    while(true){
        shape = curBlock.shape;
        realBlock = [];

        for(let y = 0; y < shape.length; y++) {
            for(let x = 0; x < shape[y].length; x++) {
                if(shape[y][x] == 1) {
                    realBlock.push([curY + y, curX + x]);
                }
            }
        }
        
        // console.log("리얼블럭 위치 = ")
        // for(let i =0 ; i < realBlock.length; i++){
        //     console.log(realBlock[i]);
        // }

        let result = true;
        
        // BLACK이 아니면(다른 블럭이 있으면) false 반환
        for(let i = 0; i < realBlock.length; i++) {
            let y = realBlock[i][0];
            let x = realBlock[i][1];

            // console.log("y = " + y + ",x = " + x);
            
            if($myTetris.children[y+preY].children[x].className == "black"){
                result = true;
            }else{
                result = false;
                let preColor = getPreviewColor(curBlock.color);

                
                $myTetris.children[y+preY].children[x].className = preColor;
                // console.log("y+preY = " + (y+preY) + ", x = " + x);
            }
        }

        if(result){
            preY++;  
        }else{
            console.log("preY = " + (preY));
            break;
        }

        // console.log("y = " + (y) + ", x = " + x);
        
        // 임시로 본인블럭(이동전)은 인식 못하게 하기 위함
        // let nowBlock = null;
        // nowBlock = realBlock;

        // for(let i = 0; i < nowBlock.length; i++) {
        //     let y = nowBlock[i][0];
        //     let x = nowBlock[i][1];

        //     dataList[y][x] = BLACK;
        // }

        // // BLOCK이거나 BLACK이 아니면(다른 블럭이 있으면) false 반환
        // for(let i = 0; i < realBlock.length; i++) {
        //     let y = realBlock[i][0];
        //     let x = realBlock[i][1];

        //     if(dataList[y + preY][x + preX] != BLACK) {
        //         result = false;
        //         break;
        //     }
        // }

        // dataList에 현재 본인블럭(이동전) 다시 입력
        // for(let i = 0; i < nowBlock.length; i++) {
        //     let y = nowBlock[i][0];
        //     let x = nowBlock[i][1];

        //     dataList[y][x] = curBlock.color;
        // }


        // if(result == true) {
        //     // console.log("바닥에 안닿");
        //     preY += 1;
        // } else if(result == false) {
        //     // 블럭이 바닥에 닿으면
        //     // console.log("바닥에 닿음!");
        //     let preColor = getPreviewColor(curBlock.color);
        //     console.log("preY = " + (preY) + ", preX = " + (preX));
        //     for(let i = 0; i < realBlock.length; i++) {
        //         let y = realBlock[i][0];
        //         let x = realBlock[i][1];
        
        //         $myTetris.children[preY].children[preX].className = preColor;
        //         console.log("y+preY = " + (y+preY) + ", x+preX = " + (x+preX));
        //         // console.log("preColor = " + preColor);
        //         // console.log("$myTetris.children[y].children[x] =  " + $myTetris.children[y].children[x].className);
        //     }

        //     break;
        // }
        
    

    //dataList에 현재 본인블럭(이동전) 다시 입력
        for(let i = 0; i < realBlock.length; i++) {
            let y = realBlock[i][0];
            let x = realBlock[i][1];

            dataList[y][x] = realBlock.color;
        }
    }

}

function getPreviewColor(curColor) {
    let preColor = "";

    if(curColor == 1){
        preColor = "green_border";
    }else if(curColor == 2){
        preColor = "red_border";
    }else if(curColor == 3){
        preColor = "purple_border";
    }else if(curColor == 4){
        preColor = "orange_border";
    }else if(curColor == 5){
        preColor = "blue_border";
    }else if(curColor == 6){
        preColor = "yellow_border";
    }else if(curColor == 7){
        preColor = "skyblue_border";
    }
    // console.log("getPreviewColor = " + preColor);
    return preColor;
}


// 화면 색칠하기
function draw() {
    // myTetris
    let $myTetris = document.querySelector("#myTetris");

    for(let y = 0; y < row; y++) {
        for(let x = 0; x < col; x++) {
            if(y == 0 || y == 1){
                $myTetris.children[y].children[x].className="white";
                
            }else{
                let index = dataList[y][x];
                $myTetris.children[y].children[x].className = colorList[index];
                // $myTetris.children[y].children[x].innerText = dataList[y][x];
            }
        }  
    }
}

// 다음 블럭 색칠하기
function drawNext() {
    // nextScreen
    nextBlock = blockList[nextRandom];
    let color = nextBlock.color;
    let shape = nextBlock.shape;
    let length = shape.length;

    let blank = (nextLength - length - 2);
    if(blank % 2 != 0){
        blank += 1;
    }
    let leftBlank = blank / 2;
    
    
    if(document.querySelector("#nextTable") != null) {
        document.querySelector("#nextTable").remove();
        nextInit();
    }
    
    
    let $nextTable = document.querySelector("#nextTable");
    let i = 0;
    
    for(let y = 0; y < nextLength; y++){
        let count = 0;
        let j = 0;
        
        for(let x = 0; x < nextLength; x++){
            
            if(y == 0 || y == nextLength - 1 || x == 0 || x == nextLength - 1){
                $nextTable.children[y].children[x].className = colorList[BLOCK];

            }else{
                if(leftBlank < y && leftBlank < count + 1 && i < length && j < length){
                    if(shape[i][j] == 1){
                        $nextTable.children[y].children[x].className = colorList[color];
                    }
                    j++;
                }
                count++;
            }
        }

        if(j == length){
            i += 1;
        }
    }
}


// block배열에서 숫자1의 위치값 + 블럭 현재위치
function getRealBlock(shape) {
    let realBlock = [];

    for(let y = 0; y < shape.length; y++) {
        for(let x = 0; x < shape[y].length; x++) {
            if(shape[y][x] == 1) {
                realBlock.push([curY + y, curX + x]);
            }
        }
    }
    return realBlock;
}

// 왼쪽 이동
function left() {
    let nextY = 0;
    let nextX = -1;
    let nowBlock = null;

    let shape = curBlock.shape;
    let realBlock = getRealBlock(shape);
    let movable = isMovable(realBlock, nextY, nextX, nowBlock);

     if(movable == true) {
        // dataList 값을 전부 BLACK로 변경
        setData(realBlock, 0, 0, BLACK);
        // 이동 후의 위치로 dataList 값 변경
        setData(realBlock, nextY, nextX, curBlock.color);
        
        curX -= 1;
    }
}

// 오른쪽 이동
function right() {
    let nextY = 0;
    let nextX = 1;
    let nowBlock = null;

    let shape = curBlock.shape;
    let realBlock = getRealBlock(shape);
    let movable = isMovable(realBlock, nextY, nextX, nowBlock);

    if(movable == true) {
        // dataList 값을 전부 BLACK 로 변경
        setData(realBlock, 0, 0, BLACK);
        // 이동 후의 위치로 dataList 값 변경
        setData(realBlock, nextY, nextX, curBlock.color);
        
        curX += 1;
    }
}

// 아래로 이동
function down() {
    let nextY = 1;
    let nextX = 0;
    let nowBlock = null;
    

    let shape = curBlock.shape;
    let realBlock = getRealBlock(shape);
    let movable = isMovable(realBlock, nextY, nextX, nowBlock);

    if(movable == true) {
        // dataList 값을 전부 BLACK 로 변경
        setData(realBlock, 0, 0, BLACK, movable);
        // 이동 후의 위치로 dataList 값 변경
        setData(realBlock, nextY, nextX, curBlock.color);
        downScore++;
        curY += 1;
    } else if(movable == false) {
        // 블럭이 바닥에 닿으면
        setData(realBlock, 0, 0, curBlock.color);
    }

    return movable;
}

// 회전
function rotate() {
    let curShape = curBlock.shape;
    let realBlock = getRealBlock(curShape);
    let nowBlock = realBlock;

    // console.log("현재 회전블럭모양 = ");
    // for(let i = 0; i < curShape.length; i++) {
    //     console.log(curShape[i]);
    // }

    let nextShape = getNextShape(curShape);
    let nextRealBlock = getRealBlock(nextShape);
    
    let movable = isMovable(nextRealBlock, 0, 0, nowBlock);
    
    // console.log("회전 movable =" + movable);
    if(movable) {
        setData(realBlock, 0, 0, BLACK);
        setData(nextRealBlock, 0, 0, curBlock.color);
        curBlock.shape = nextShape;
    }
}

// 회전 상태의 모양 구하기
function getNextShape(curShape) {
    let tempBlock = [];

    for(let i = 0; i < curShape.length; i++) {
        let temp = [];
        for(let j = 0; j < curShape[i].length; j++) {
            temp.push(0);
        }
        tempBlock.push(temp);
    }

    let index = curShape.length - 1;

    for(let y = 0; y < curShape.length; y++) {
        for(let x = 0; x < curShape[y].length; x++) {
            tempBlock[x][index] = curShape[y][x];
        }
        index--;
    }

    // console.log("다음 회전블럭모양 = ");
    // for(let i = 0; i < tempBlock.length; i++) {
    //     console.log(tempBlock[i]);
    // }
    return tempBlock;
}


// 이동가능한지 확인
function isMovable(nextRealBlock, nextY, nextX, nowBlock) {
    let result = true;

    // 임시로 본인블럭(이동전)은 인식 못하게 하기 위함
    if(nowBlock == null){
        nowBlock = nextRealBlock;
    }

    for(let i = 0; i < nowBlock.length; i++) {
        let y = nowBlock[i][0];
        let x = nowBlock[i][1];

        dataList[y][x] = BLACK;
    }

    // BLOCK이거나 BLACK이 아니면(다른 블럭이 있으면) false 반환
    for(let i = 0; i < nextRealBlock.length; i++) {
        let y = nextRealBlock[i][0];
        let x = nextRealBlock[i][1];

        if(dataList[y + nextY][x + nextX] == BLOCK || dataList[y + nextY][x + nextX] != BLACK) {
            result = false;
            break;
        }
    }

    // dataList에 현재 본인블럭(이동전) 다시 입력
    for(let i = 0; i < nowBlock.length; i++) {
        let y = nowBlock[i][0];
        let x = nowBlock[i][1];

        dataList[y][x] = curBlock.color;
    }

    return result;
}

// 이동 후 dataList 값 수정
function setData(realBlock, nextY, nextX, color) {
    for(let i = 0; i < realBlock.length; i++) {
        let y = realBlock[i][0];
        let x = realBlock[i][1];

        dataList[y + nextY][x + nextX] = color;
    }
}

// 한 줄 완성되면 삭제
function lineClear() {
    let del = [];

    for(let y = 1; y < row-1; y++) {
        let count = 0;
        for(let x = 1; x < col-1; x++) {
            if(dataList[y][x] != "0") {
                count++;
            }
        }
        if(count == 10) {
            lineClearCount++;
            score += level * 100;
            document.querySelector("#score").innerText = score;
            document.querySelector("#lineClearCount").innerText = lineClearCount;
            del.push(y);
        }
    }

    for(let i = 0; i < del.length; i++) {
        dataList.splice(del[i], 1);
        dataList.splice(0, 1);
        dataList.unshift([BLOCK,BLACK,BLACK,BLACK,BLACK,BLACK,BLACK,BLACK,BLACK,BLACK,BLACK,BLOCK]);
        dataList.unshift([BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK,BLOCK]);
    }
}

function plusScore(drop) {
    if(drop == "hardDrop"){
        // console.log("하드드랍");
        score += downScore * level * 2;
    }else if(drop == "softDrop"){
        // console.log("소프트드랍");
        score += downScore * level * 1;
    }

    document.querySelector("#score").innerText = score;
}

// 게임 종료
function isGameOver() {
    let realBlock = getRealBlock(curBlock.shape);

    for(let y=0; y<realBlock.length; y++) {
        if(dataList[realBlock[y][0]][realBlock[y][1]] != BLACK) {
            gameOver = true;
            break;
        }
    }
    console.log(gameOver);
}

// 이벤트 등록
document.addEventListener("keydown", function(e) {
    
    if(e.code == "ArrowLeft") {
        left();
    } else if(e.code == "ArrowRight") {
        right();
    } else if(e.code == "ArrowDown") {
        downScore = 0;
        if(down() == false) {
            lineClear();
            setNewBlock();
        }
        plusScore("softDrop");
    } else if(e.code == "ArrowUp") {
        rotate();
    } else if(e.code == "Space") {
        downScore = 0;
        while(down()) {}

        lineClear();
        setNewBlock();
        plusScore("hardDrop");
    } 

    draw();
});

// function openPop() {
//     document.querySelector("#popup_layer").style.display = "block";
// }

// function closePop() {
//     document.querySelector("#popup_layer").style.display = "none";
// }


init();
setNewBlock();
draw();
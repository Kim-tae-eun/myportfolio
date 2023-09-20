let me = "";
let com = "";
let dataList = [];
let turn = true; //true:O, false:X
let game = 0;
let size = 3;

// 플레이어 선택 창
function selectPlayer(player) {
    me = player;
    if(me == "O") {
        com = "X";
    } else {
        com = "O";
        turn = false;
    }

    // 시작 화면 지우기
    document.querySelector("#mainTable").remove();
    document.querySelector("#title").style.display="block";
    init();
}

function drawTurnTable() {
    let $turnTable = document.createElement("table");
    $turnTable.id = "turnTable";

    let $tr = document.createElement("tr");

    let $td = document.createElement("td");
    let $playerBtn = document.createElement("button");
    $playerBtn.className = "playerBtn";
    $playerBtn.innerText = "O's Turn";
    $td.append($playerBtn);
    $tr.append($td);
    
    $td = document.createElement("td");
    $playerBtn = document.createElement("button");
    $playerBtn.className = "playerBtn";
    $playerBtn.innerText = "X's Turn";
    $td.append($playerBtn);
    $tr.append($td);
    
    $turnTable.append($tr);

    document.querySelector("#gameTableTd").append($turnTable);
}

function drawContentTable() {
    let $contentTable = document.createElement("table");
    $contentTable.id = "contentTable";

    for(let i = 0; i < size; i++) {
        let $tr = document.createElement("tr");

        let $td = document.createElement("td");
        $td.className = "block";
        $tr.append($td);

        $td = document.createElement("td");
        $td.className = "block";
        $tr.append($td);

        $td = document.createElement("td");
        $td.className = "block";
        $tr.append($td);

        $contentTable.append($tr);
    }
    document.querySelector("#gameTableTd").append($contentTable);
    //위치가 한칸 위로 가도 작동이 되는듯?
}

function drawFooter() {
    let $footerTable = document.createElement("table");
    $footerTable.id = "footerTable";

    let $tr = document.createElement("tr");
    let $td = document.createElement("td");
    $tr.append($td);
    $footerTable.append($tr);

    document.querySelector("#gameTableTd").append($footerTable);
}

function init() {
    drawTurnTable();
    drawContentTable();
    drawFooter();

    // dataList 생성
    for(let i = 0; i < size; i++) {
        let temp = [0, 0, 0];
        dataList.push(temp);
    }

    // playerBtn 시작 색상 설정
    if(me == "O") {
        document.querySelectorAll(".playerBtn")[0].style.backgroundColor = "hwb(345 44% 0%)";
        com = "X";
    } else {
        document.querySelectorAll(".playerBtn")[1].style.backgroundColor = "hwb(345 44% 0%)";
        com = "O";
    }

    // 블럭에 click 이벤트 부여
    let blockList = document.querySelectorAll(".block");
    for(let i = 0; i < blockList.length; i++) {
        blockList[i].addEventListener("click", mark);
    }
}

function mark() {
    let $turnTable = document.createElement("table");
    $turnTable.id = "turnTable";
    let $contentTable = document.querySelector("#contentTable");

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {

            if(this == $contentTable.children[i].children[j] && this.innerText == "") {
                // 차례에 따라 마크 + turnTable 색상 바꾸기
                if(turn) {
                    this.innerText = "O";
                    dataList[i][j] = 1;
                    document.querySelectorAll(".playerBtn")[0].style.backgroundColor = "";
                    document.querySelectorAll(".playerBtn")[1].style.backgroundColor = "hwb(345 44% 0%)";
                } else {
                    this.innerText = "X";
                    dataList[i][j] = 2;
                    document.querySelectorAll(".playerBtn")[0].style.backgroundColor = "hwb(345 44% 0%)";
                    document.querySelectorAll(".playerBtn")[1].style.backgroundColor = "";
                }

                turn = !turn;
            }
        }
    }

    let result = checkWin();

    if(result == 1) {
        document.querySelector("#footerTable").innerHTML = "Player <span id=winner>O</span> won the game!";
    } else if(result == 2) {
        document.querySelector("#footerTable").innerHTML = "Player <span id=winner>X</span> won the game!";
    } else if(result == 3) {
        document.querySelector("#footerTable").innerHTML = "The game ended in a tie.";
    }

    if(result != 0){
        removeEvent();
        document.querySelector("#replayBtn").style.display = "block";
    }

}

function removeEvent() {
    let blockList = document.querySelectorAll(".block");
    for(let i=0; i<blockList.length; i++) {
        blockList[i].removeEventListener("click", mark);
        blockList[i].style.cursor = "auto";
    }
}

function checkWin() {
    let win1 = false;
    let win2 = false;
    let win3 = false;
    
    // 가로 검사
    for(let i = 0; i < size; i++) {
        let count1 = 0;
        let count2 = 0;

        for(let j = 0; j < size; j++) {
            if(dataList[i][j] == 1) {
                count1 += 1;
            }
            if(dataList[i][j] == 2) {
                count2 += 1;
            }
        }

        if(count1 == 3) {
            win1 = true;
        }
        if(count2 == 3) {
            win2 = true;
        }
    }

    // 세로 검사
    for(let i = 0; i < size; i++) {
        let count1 = 0;
        let count2 = 0;

        for(let j = 0; j < size; j++) {
            if(dataList[j][i] == 1) {
                count1 += 1;
            }
            if(dataList[j][i] == 2) {
                count2 += 1;
            }
        }
        if(count1 == 3) {
            win1 = true;
        }
        if(count2 == 3) {
            win2 = true;
        }
    }

    // 대각선 / 검사
    if(dataList[0][2] == 1 && dataList[1][1] == 1 && dataList[2][0] == 1) {
        win1 = true;
    }
    if(dataList[0][2] == 2 && dataList[1][1] == 2 && dataList[2][0] == 2) {
        win2 = true;
    }
    // 대각선 \ 검사
    if(dataList[0][0] == 1 && dataList[1][1] == 1 && dataList[2][2] == 1) {
        win1 = true;
    }
    if(dataList[0][0] == 2 && dataList[1][1] == 2 && dataList[2][2] == 2) {
        win2 = true;
    }

    
    // 무승부
    let count3 = 0;

    for(let i = 0; i < dataList.length; i++) {
        for(let j = 0; j < dataList.length; j++) {
            if(dataList[i][j] == 0) {
                count3++;
                break;
            }
        }
    }
    if(count3 == 0){
        win3 = true;
    }

    if(win1) {
        game = 1;
    }
    if(win2) {
        game = 2;
    }
    if(win3) {
        game = 3;
    }
    console.log("game = " + game);

    return game;
}

function replay() {
    location.href="tictactoe copy.html";
}
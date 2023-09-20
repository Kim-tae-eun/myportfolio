let gameNum = 1;
let time = 0;
let timeId = null;          
let size = 5;
let frontList = [];
let backList = [];
let $center = document.querySelector("#center");
let $table = document.createElement("table");
let $tdList = [];
let $hintButton = document.querySelector("#hintButton");

function init() {
    let num = 1;

    for(let i = 0; i < size; i++) {
        let frontTemp = [];
        let backTemp = [];

        for(let j = 0; j < size; j++) {
            frontTemp.push(num);
            backTemp.push(num + size*size);
            num += 1;
        }

        frontList.push(frontTemp);
        backList.push(backTemp);
    }

    // 셔플(shuffle) : 무작위
    for(let i = 0; i < 100; i++) {
        let y = Math.floor(Math.random() * size);
        let x = Math.floor(Math.random() * size);
        let temp = frontList[0][0];

        frontList[0][0] = frontList[y][x];
        frontList[y][x] = temp;

        y = Math.floor(Math.random() * size);
        x = Math.floor(Math.random() * size);

        temp = backList[0][0];
        backList[0][0] = backList[y][x];
        backList[y][x] = temp;
    }
    
    console.log("frontList = " + frontList);
    console.log("backList = " + backList);

    for(let i = 0; i < size; i++) {
        let $tr = document.createElement("tr");
        let $tempTdList = [];

        for(let j = 0; j < size; j++) {
            let $td = document.createElement("td");

            $td.addEventListener("click", clickEvent);
            $td.innerText = frontList[i][j];
            
            $tr.append($td);
            $tempTdList.push($td);
        }
        $tdList.push($tempTdList);
        $table.append($tr);
    }
    $center.append($table);

    blinkId = setInterval(setBlink, 500);
}

function setBlink() {
    let blink = document.querySelector("#blink");

    if(blink.style.color == "white"){
        blink.style.color = "#f55217";
    }else{
        blink.style.color = "white";
    }
}


function setTimer() {
    time += 0.01;
    document.querySelector("#timer").innerText = time.toFixed(2);
}

function clickEvent() {
    let y = 0;
    let x = 0;

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            if(this == $tdList[i][j]) {
                y = i;
                x = j;
                break;
            }
        }
    }

    if(this.innerText == gameNum) {
        if(1 <= gameNum && gameNum <= size * size) {
            if(gameNum == 1) {
                timeId = setInterval(setTimer, 10);
            }
            this.innerText = backList[y][x];
            this.style.backgroundColor="#ffecb9";
            this.style.color="#ff8859";
        } else {
            this.innerText = "";
            this.style.backgroundColor="white";
            this.style.cursor="auto";
        }
        gameNum += 1;
        document.querySelector("#nextNum").innerText = gameNum;
    }
    
    gameOver();
}

function hintClick() {
    let y = 0;
    let x = 0;

    for(let i = 0; i < size; i++) {
        for(let j = 0; j < size; j++) {
            if($tdList[i][j].innerText == gameNum) {
                y = i;
                x = j;
                break;
            }
        }
    }
    $tdList[y][x].style.backgroundColor = "rgb(255, 115, 0)";
    $tdList[y][x].style.color = "white";
}

function replay() {
    location.href="speedGame.html"
}

function clearTable() {
    $center.removeChild($table);
}

//게임종료
function gameOver() {
    if(gameNum > size * size + size * size) {
        document.querySelector("#gameEnd").innerHTML = "<img src='images/clear.jpg' id='clear'>";
        clearInterval(timeId);
        clearInterval(blinkId);
        clearTable();
        $hintButton.style.cursor = "auto";
    }
}

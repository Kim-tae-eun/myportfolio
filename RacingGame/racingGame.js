let myInterval = null;
let $table = null;
let $center = document.querySelector("#center");
let row = 5;
let col = 30;
let horse = [0,0,0,0,0];
let gameOver = false;
let result = [];
let count = 0;


function stopRadio() {
    //radio 비활성화 (하나의 태그에 onclick 은 한개만 적용 가능)
    $radioBtn = document.getElementsByName("horse");
    let $selNum_radio = document.querySelectorAll(".selNum_radio");
    //클래스는 all로 가져오기

    for(let i = 0; i < $radioBtn.length; i++){
        $radioBtn[i].setAttribute("disabled", true);
        $selNum_radio[i].style.cursor="auto";
    }
}

function init() {
    //경주 테이블 그리기 & 현재 칸에 색 칠하기
    let horseIdx = 0;
    let colorList = ["red", "orange", "yellow", "green", "blue"];
    let colorListIdx = 0;
    let num = 1;

    if($table != null) {
        $table.remove();
    }

    $table = document.createElement("table");
    $table.setAttribute("id", "racingTable");
    // == $table.id = "racingTable";

    for(let i = 0; i < row; i++){
        let $tr = document.createElement("tr");
        let colorCheck = false;

            for(let j = 0; j < col; j++){
                let $td = document.createElement("td");
                $td.style.border="1px solid dimgray";
                $td.setAttribute("class", "racingTd");
                
                if(j == horse[horseIdx]){
                    if(colorCheck == false){
                        $td.innerText = num;
                        $td.style.textAlign="center";
                        $td.style.fontWeight = "bold";
                        $td.style.backgroundColor=colorList[colorListIdx];
                        colorListIdx++;
                        horseIdx++;
                        num++;
                        colorCheck = true;
                    }
                }
                $tr.append($td);
                
            }
            
        $table.append($tr);
    }
    
    $center.append($table);
}

function gameStart() {
    //인터벌 설정
    myInterval = setInterval(racing, 200);

    document.querySelector("#playBtn").setAttribute("disabled", true);
    document.querySelector("#playBtn").style.background = "gray";
    document.querySelector("#playBtn").style.cursor = "auto";

    stopRadio();
}

function racing() {

    $table = document.querySelector("#racingTable");

    // while(true){
        // ==> interval로 자동 반복 되기 때문에 무한반복 사용하지 않아도 됨

        //말 이동
        for(let i = 0; i < row; i++){
            let move = Math.floor(Math.random() * 3) + 1;
            horse[i] += move;
            // console.log(i + "번 말" + horse[i] + "번 칸");

            //result에 등수 저장
            // 동시등수 고려x
            if(horse[i] >= col - 1){
                horse[i] = col - 1;

                let checkGameover = false;

                console.log("horse = " + horse);
                
                for(let j = 0; j < result.length; j++){
                    if(i + 1 == result[j]){
                        checkGameover = true;
                        break;
                    }
                }

                if(checkGameover == false){
                    result.push(i+1);
                    count++;
                }
            }

            //게임 종료 체크
            if(count == row){
                gameOver = true;
                break;
            }

        }

        // //게임 종료 체크
        // console.log("horse = " + horse);

        // for(let i = 0; i < horse.length; i++){
            
        //     if(horse[i] == col - 1){
                
        //         //result 배열에 이미 등수가 있는지 확인
        //         let checkGameover = false;
        //         for(let j = 0; j < result.length; j++){
        //             if(i + 1 == result[j]){
        //                 checkGameover = true;
        //             }
        //         }

        //         //없다면 result 배열에 등수 기록
        //         if(checkGameover == false){
        //             count++;
        //             result.push(i + 1);
        //             // console.log("result = " + result);
        //             // console.log("count = " + count);
        //         }

        //         if(count == row){
        //             gameOver = true;
        //             break;
        //         }
        //     }
        // }

        if(gameOver){
            clearInterval(myInterval);
            drawFooter();
            // break;
        }
        init();
    // }
}

function drawFooter() {
    let num = 1;

    let $footer = document.querySelector("#footer");
    let $footerTable = document.createElement("table");
    $footerTable.id="footerTable";

    // let $horseSec = document.getElementsByName("horse");
    let horseSelected = document.querySelector('input[name="horse"]:checked').value;

    for(let i = 0; i < 4; i++){
        let $tr = document.createElement("tr");
        for(let j = 0; j < 5; j++){
            let $td = document.createElement("td");
            $td.id = "footerTd";

            if(i == 0){
                $td.innerText = num + "등";

                if(horseSelected == result[j]){
                    $td.style.color="#FF4500";
                    $td.style.fontWeight="bold";
                }
                num++;
                $tr.append($td);
            }
            else if(i == 1){
                let rank = result[j];
                $td.innerText = rank + "번";

                if(horseSelected == rank){
                    $td.style.color="#FF4500";
                    $td.style.fontWeight="bold";
                }
                $td.style.borderTop="1px solid #BDBDBD";
                $tr.append($td);
            }
            else if(i == 2 && j == 0){
                $td.setAttribute("colspan", 5);
                // getAttribute 가 아닌 setAttribute

                if(result[0] == horseSelected){
                    $td.innerText="1등입니다!";
                }else{
                    $td.innerText="아쉽네요!";
                }

                console.log("result = " + result);
                console.log("result[0] = " + result[0]);
                console.log("horseSelected = " + horseSelected);

                $td.style.color="red";
                $td.style.fontWeight="bold";
                
                $tr.append($td); //조건문 안에 적어야 한번만 생성
            }
            else if(i == 3 && j == 0){
                $td.setAttribute("colspan", 5);
                let replayBtn = document.createElement("input");
                replayBtn.type="button";
                replayBtn.value="다시하기";
                replayBtn.id="replayBtn";
                $td.append(replayBtn);
                $td.addEventListener("click", replay);
                // $td.appendChild("button");
                $tr.append($td);
            }
            
        }
        $footerTable.append($tr);
    }
    $footer.append($footerTable);
}

function replay() {
    location.href="racingGame.html";
}
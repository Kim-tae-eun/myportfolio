let $btnUndo = document.querySelector("#btnUndo");
let $center = document.querySelector("#center");
let $selectTable = null;
let $gameTable = null;
let $gameTr = [];
let $gameTd = [];
let size = 0;
let count = 0;
let board = [];
let before = [];
let after = [];

    function selectGame() {
        // 초기 화면 생성
        $selectTable = document.createElement("table");
        $selectTable.id = "selectTable";

        for(let i = 0; i < 3; i++){
            $tr = document.createElement("tr");
            $td = document.createElement("td");
            $td.id = "selectTd";
            let $button = document.createElement("input");

            $button.type = "button";
            $button.classList = "selectBtn";
            //==> 동적 생성시엔 class가 아닌 classList

            if(i == 0){
                $button.value = "3 X 3";
                $button.name = "3";
            }else if(i == 1){
                $button.value = "4 X 4";
                $button.name = "4";
            }else{
                $button.value = "5 X 5"; 
                $button.name = "5";  
            }
            $button.addEventListener("click", this.init);

            $td.append($button);
            $tr.append($td);
            $selectTable.append($tr);
        }
        $center.append($selectTable);
    }
    
    function init() {
        // 초기 화면 초기화
        if($selectTable != null){
        document.querySelector("#selectTable").remove();
        // document.querySelector("#center") = null;
            // $selectTable = null;
            // $center = null;
            //왜 null은 안되는가? ==> html코드(태그)를 가져오는거라서 remove 해야함
            //js로 생성된 것은 null로 지우기 가능.
        }
        $selectTable = null;
        size = this.name;
        $gameTable = document.createElement("table");
        $gameTable.id = "gameTable";

        // 게임 화면 생성
        for(let i = 0; i < size; i++){
            let $tr = document.createElement("tr");
            $tr.className = "gameTr";
            
            for(let j = 0; j < size; j++){
                let $td = document.createElement("td");
                $td.className = "gameTd";
                
                if(size == 3){
                    $td.style.width="120px";
                    $td.style.fontSize="45px";
                    $td.style.border="10px solid hsl(28, 26%, 73%)";
                }else if(size == 4){
                    $td.style.fontSize="30px";
                    $td.style.border="8px solid hsl(28, 26%, 73%)";
                }

                $tr.append($td);
            }
            $gameTable.append($tr);
        }
        $center.append($gameTable);
        
        startGame();
    }

    function startGame() {
        $gameTable = document.querySelector("#gameTable");
        $gameTr = document.querySelectorAll(".gameTr");
        $gameTd = document.querySelectorAll(".gameTd");
        
        // 게임 시작시, 신규 숫자 생성
        while(true){
            let r1 = Math.floor(Math.random() * size);
            let r2 = Math.floor(Math.random() * size);
            let r3 = Math.floor(Math.random() * size);
            let r4 = Math.floor(Math.random() * size);

            if(r1 == r3 && r2 == r4){
                continue;
            }else{
                if($gameTr[r1].children[r2].innerText == ""){
                    // alert(r1 + "," + r2 + "," + r3 + "," + r4);
                    
                    $gameTr[r1].children[r2].innerText = "2";
                    $gameTr[r3].children[r4].innerText = "2";
                    break;
                }
            }
        }
        coloring();
        document.addEventListener("keydown", keydownHandler);
        // == document.onkeydown = keydownHandler(); 메서드 설정시엔 event 적지않음.
    }
    
    
    // 키보드 입력 처리
    function keydownHandler(event) { //함수 작동시에는 컴퓨터에서 event를 받는 것.
        // alert("this.key = " + event.key + "<br>this.code = " + event.code);
        // ArrowLeft, ArrowUp, ArrowRight, ArrowDown
        //        37,      38,         39,        40 
        let move = false;
        console.log($gameTr[0].children[1].innerText);
        console.log($gameTd[0].innerText);

        // board 배열에 현재 게임테이블 숫자 넣기
        board = [];

        for(let i = 0; i < size; i++){
            let tmp = [];
            for(let j = 0; j < size; j++){
                tmp.push($gameTr[i].children[j].innerText);
            }
            board.push(tmp);
        }
        
        before = [];
        console.log("before")
        for(let i = 0; i < board.length; i++) {
            let tmp = [];
            for(let j = 0; j < board[i].length; j++) {
                tmp.push(board[i][j]);
            }
            before.push(tmp);
        }
        console.log(before);
        // console.log(board); //변수명으로 적으면 변경전 보드가 출력이 안됨(이슈)

        // board 숫자 입력방향으로 밀기
        // 왼쪽방향키
        if(event.keyCode == "37"){
            // == if(event.code == "ArrowLeft"){ //키워드가 아니라 문자열이라서 ""넣어주기
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        if(board[i][j] == "" && j+1 < size){
                            board[i][j] = board[i][j+1];
                            if(board[i][j+1] != ""){
                                move = true;
                                check = true;
                            }
                            board[i][j+1] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }

            // 같은숫자 합치기
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    if(board[i][j] != "" && j+1 < size && board[i][j] == board[i][j+1]){
                        let tmp = Number(board[i][j]) + Number(board[i][j+1]);
                        board[i][j] = tmp;
                        board[i][j+1] = "";
                        move = true;
                        j++;
                    }
                }
            }

            // 합치고 나서 빈칸 있으면 밀기
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        if(board[i][j] == "" && j+1 < size){
                            board[i][j] = board[i][j+1];
                            if(board[i][j+1] != ""){
                                move = true;
                                check = true;
                            }
                            board[i][j+1] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }
        }

        // 위쪽 방향키
        else if(event.keyCode == "38"){
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        if(board[j][i] == "" && j+1 < size){
                            board[j][i] = board[j+1][i];
                            if(board[j+1][i] != ""){
                                move = true;
                                check = true;
                            }
                            board[j+1][i] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }

            // 같은숫자 합치기
            for(let i = 0; i < size; i++){
                for(let j = 0; j < size; j++){
                    if(board[j][i] != "" && j+1 < size && board[j][i] == board[j+1][i]){
                        let tmp = Number(board[j][i]) + Number(board[j+1][i]);
                        board[j][i] = tmp;
                        board[j+1][i] = "";
                        move = true;
                        j++;
                    }
                }
            }

            // 합치고 나서 빈칸 있으면 밀기
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = 0; j < size; j++){
                        if(board[j][i] == "" && j+1 < size){
                            board[j][i] = board[j+1][i];
                            if(board[j+1][i] != ""){
                                move = true;
                                check = true;
                            }
                            board[j+1][i] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }
        }

        // 오른쪽 방향키
        else if(event.keyCode == "39"){
            while(true){
                let check = false;
                for(let i = size - 1; i >= 0; i--){
                    for(let j = size - 1; j >= 0; j--){
                        if(board[i][j] == "" && j-1 >= 0){
                            board[i][j] = board[i][j-1];
                            if(board[i][j-1] != ""){
                                move = true;
                                check = true;
                            }
                            board[i][j-1] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }

            // 같은숫자 합치기
            for(let i = 0; i < size; i++){
                for(let j = size-1; j >= 0; j--){
                    if(board[i][j] != "" && j-1 >= 0 && board[i][j] == board[i][j-1]){
                        let tmp = Number(board[i][j]) + Number(board[i][j-1]);
                        board[i][j] = tmp;
                        board[i][j-1] = "";
                        move = true;
                        j--;
                    }
                }
            }

            // 합치고 나서 빈칸 있으면 밀기
            while(true){
                let check = false;
                for(let i = size - 1; i >= 0; i--){
                    for(let j = size - 1; j >= 0; j--){
                        if(board[i][j] == "" && j-1 >= 0){
                            board[i][j] = board[i][j-1];
                            if(board[i][j-1] != ""){
                                move = true;
                                check = true;
                            }
                            board[i][j-1] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }
        }

        // 아래 방향키
        else if(event.keyCode == "40"){
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = size - 1; j >= 0; j--){
                        if(board[j][i] == "" && j-1 >= 0){
                            board[j][i] = board[j-1][i];
                            if(board[j-1][i] != ""){
                                move = true;
                                check = true;
                            }
                            board[j-1][i] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }

            // 같은숫자 합치기
            for(let i = 0; i < size; i++){
                for(let j = size-1; j >= 0; j--){
                    if(board[j][i] != "" && j-1 >= 0 && board[j][i] == board[j-1][i]){
                        let tmp = Number(board[j][i]) + Number(board[j-1][i]);
                        board[j][i] = tmp;
                        board[j-1][i] = "";
                        move = true;
                        j--;
                    }
                }
            }

            // 합치고 나서 빈칸 있으면 밀기
            while(true){
                let check = false;
                for(let i = 0; i < size; i++){
                    for(let j = size - 1; j >= 0; j--){
                        if(board[j][i] == "" && j-1 >= 0){
                            board[j][i] = board[j-1][i];
                            if(board[j-1][i] != ""){
                                move = true;
                                check = true;
                            }
                            board[j-1][i] = "";
                        }
                    }
                }
                if(check == false){
                    break;
                }
            }
        }

        after = [];
        console.log("after")
        for(let i = 0; i < board.length; i++) {
            let tmp = [];
            for(let j = 0; j < board[i].length; j++) {
                tmp.push(board[i][j]);
            }
            after.push(tmp);
        }
        console.log(after);
        console.log("move = " + move);

        // 현재 게임테이블에 board 배열 넣기
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                $gameTr[i].children[j].innerText = board[i][j];
            }
        }
        
        // 타일이동시 신규 숫자 생성
        if(move == true){
            count++;
            while(true){
                let r1 = Math.floor(Math.random() * size);
                let r2 = Math.floor(Math.random() * size);
                
                if($gameTr[r1].children[r2].innerText == ""){
                    $gameTr[r1].children[r2].innerText = "2";
                    // console.log(r1 + ", " + r2 + " = 새로생긴 타일");
                    break;
                }
            }
            $btnUndo.addEventListener("click", undoEvent);
            $btnUndo.style.backgroundColor = "#F57F17";
            document.querySelector("#tdUndo").style.backgroundColor = "#F57F17";
        }

        coloring();
        checkScore(move);
        checkGameover();
        
    }

    // 칸 색칠
    function coloring() {
       
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                let cell = $gameTr[i].children[j];

                if(cell.innerText == ""){
                    cell.style.backgroundColor="#dfcfc1";
                    cell.style.color="#463a34";
                }else if(cell.innerText == "2"){
                    cell.style.backgroundColor="#FBEDDC";
                    cell.style.color="#684A23";
                }else if(cell.innerText == "4"){
                    cell.style.backgroundColor="#F9E2C7";
                    cell.style.color="#684A23";
                }else if(cell.innerText == "8"){
                    cell.style.backgroundColor="#F6D5AB";
                    cell.style.color="#684A23";
                }else if(cell.innerText == "16"){
                    cell.style.backgroundColor="#F2C185";
                    cell.style.color="#684A23";
                }else if(cell.innerText == "32"){
                    cell.style.backgroundColor="#EFB46D";
                    cell.style.color="#684A23";
                }else if(cell.innerText == "64"){
                    cell.style.backgroundColor="#EBA24A";
                    cell.style.color="#FFFFFF";
                }else if(cell.innerText == "128"){
                    cell.style.backgroundColor="#E78F24";
                    cell.style.color="#FFFFFF";
                }else if(cell.innerText == "256"){
                    cell.style.backgroundColor="#E87032";
                    cell.style.color="#FFFFFF";
                }else if(cell.innerText == "512"){
                    cell.style.backgroundColor="#E85532";
                    cell.style.color="#FFFFFF";
                }else if(cell.innerText == "1024"){
                    cell.style.backgroundColor="#E84532";
                    cell.style.color="#FFFFFF";
                }else if(cell.innerText == "2048"){
                    cell.style.backgroundColor="#E83232";
                    cell.style.color="#FFFFFF";
                }else {
                    cell.style.backgroundColor="#E51A1A";
                    cell.style.color="#FFFFFF";
                }
            }
        }
    }
    
    function undoEvent() {
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                $gameTr[i].children[j].innerText = before[i][j];
            }
        }
        coloring();
        removeUndoEvent();
    }

    function removeUndoEvent() {
        $btnUndo.removeEventListener("click", undoEvent);
        $btnUndo.style.cursor = "auto";
        $btnUndo.style.backgroundColor = "gray";
        document.querySelector("#tdUndo").style.backgroundColor = "gray";
    }

    function removeKeyEvent() {
        document.removeEventListener("keydown", keydownHandler);
    }

    //점수체크 (새로 생성된 타일 제외한 점수합)
    function checkScore(move) {
        let best = 0;
        let score = 0;

        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                score += Number(board[i][j]);
            }
        }

        let $score = document.querySelector("#score");
        let $best = document.querySelector("#best");
        $score.innerText = score;
        $best.innerText = score;
    }

    function checkGameover() {
        // 2048 달성
        let goal = 2048;
        let check1 = false;
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(board[i][j] == goal){
                    check1 = true;
                    break;  
                }
            }
        }

        // 더 이상 움직일 타일이 없을 때
        let check2 = true;
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(board[i][j] == ""){
                    check2 = false;
                    break;
                }
            }
        }
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(j+1 < size && board[i][j] == board[i][j+1]){
                    check2 = false;
                    break;  
                }
            }
        }
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++){
                if(j+1 < size && board[j][i] ==board[j+1][i]){
                    check2 = false;
                    break;
                }
            }
        }

        if(check1 == true || check2 == true){
            gameover();
        }
    }

    function gameover() {
        $gameTable.style.opacity="0.7"; // 게임 테이블 반투명화
        removeUndoEvent();
        removeKeyEvent();
        openPop();
        // alert("[ game over ! ]");
    }

    function openPop() {
        document.getElementById("popup_layer").style.display = "block";
    }

    function closePop() {
        document.getElementById("popup_layer").style.display = "none";
    }

    
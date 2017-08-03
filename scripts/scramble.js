Array.prototype.selectRandom = function(startIndex = 0, endIndex = this.length - 1) {
    return this[Math.floor(Math.random()*(endIndex-startIndex + 1))+startIndex];
}

var opposite = new Object;
opposite["R"] = "L"; opposite["L"] = "R";
opposite["U"] = "D"; opposite["D"] = "U";
opposite["F"] = "B"; opposite["B"] = "F";


function genScramble2() {
    return scramblers["222"].getRandomScramble();
}

function genScramble3() {
    return scramblers["333"].getRandomScramble();
}

function genScramble3b() {
    return scramblers["333bf"].getRandomScramble();
}

function genScramble4() {
    return scramblers["444"].getRandomScramble();
}

function genScramble5() {
    return scramblers["555"].getRandomScramble();
}

function genScramble6() {
    var sc = scramblers["666"].getRandomScramble();
    
    // Convert to moves
    var moves = sc.scramble_string.split(" ");
    
    // For each move
    for (var i = 0; i < moves.length; i++) {
        var m = moves[i];
        var moveWidth = m[0];
        var move = m[1];
        var moveDir = m[2] || "";
        
        if (moveWidth == 2) {
            moves[i] = move + "w" + moveDir;
        }
        if (moveWidth == 3) {
            moves[i] = moveWidth + move + "w" + moveDir;
        }
    }
    
    
    sc.scramble_string = moves.join(" ");
    return sc;
}

function genScramble7() {
    var sc = scramblers["666"].getRandomScramble();
    
    // Convert to moves
    var moves = sc.scramble_string.split(" ");
    
    // For each move
    for (var i = 0; i < moves.length; i++) {
        var m = moves[i];
        var moveWidth = m[0];
        var move = m[1];
        var moveDir = m[2] || "";
        
        if (moveWidth == 2) {
            moves[i] = move + "w" + moveDir;
        }
        if (moveWidth == 3) {
            moves[i] = moveWidth + move + "w" + moveDir;
        }
    }
    
    sc.scramble_string = moves.join(" ");
    return sc;
}

function genScrambleM() {
    var s = scramblers["minx"].getRandomScramble();
    s2 = s.scramble_string.split("<br>");
    
    for (var i = 0; i < s2.length; i++) {
        if (s2[i][s2[i].length - 1] == "U") { s2[i] += " "; }
    }
    
    s.scramble_string = s2.join("<br>");
    return s;
}


function genScrambleP() {
    return scramblers["pyram"].getRandomScramble();
}

function genScrambleS1() {
    return scramblers["sq1"].getRandomScramble();
}

function genScrambleS(len = 10) {
    var before;
    var final = [];
    var alter = ["", "'"];
    
    while (len > 0) {
        var poss = ["R", "L", "F", "B"];
        poss.splice(poss.indexOf(before), 1);
        
        var move = poss.selectRandom();
        before = move;
        final.push(move);
        len -= 1;
    }
    
    for (var a = 0; a < final.length; a++) {
        final[a] = final[a] + alter.selectRandom();
    }
    
    return final.join(" ");
}

function genScrambleEmpty() { return " "; }

var currentScramble;



function updateScramble() {
    
    // Scramble element above time element
    var scrambleElement = document.getElementById("scramble");
    
    // Set currentScramble, put scramble on webpage
    currentScramble = currentEvent.scramble();
    scrambleElement.innerHTML = currentScramble.scramble_string || currentScramble;
    
}
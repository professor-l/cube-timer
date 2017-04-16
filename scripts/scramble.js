/*****************************************************\
                        SYNTAXES

genScramble3() returns a formatted 3x3 scramble.
genScramble4() returns a formatted 4x4 scramble.
The pattern continues, from 2 to 7.

Each scramble has a reccommended length, but if you
provide a custom length as an argument instead of
void, it will generate a scramble with that length.

genScramble2(10) generates a 10 move 2x2 scramble.
genScramble5(1000) generates a 1000 move 5x5 scramble.

genScrambleP() is for Pyraminx.
genScrambleS() is for Skewb.
genScrambleM() is for Megaminx.

\*****************************************************/

Array.prototype.selectRandom = function() {
	return this[Math.floor(Math.random()*this.length)];
}
Array.prototype.remove = function(val){
	for (x in this) {
		if (this[x] == val) {this.splice(this.indexOf(val), 1)}
	}
}

var opposite = new Object;
opposite["R"] = "L"; opposite["L"] = "R";
opposite["U"] = "D"; opposite["D"] = "U";
opposite["F"] = "B"; opposite["B"] = "F";

function genScramble2(len = 12) {
	var final=[]; var alter=["","'","2"]; var before;

	while (len > 0) {
		var poss = ["R","U","F"]; poss.remove(before); 
        // Avoids things like R2 R'
        
		move = poss.selectRandom(); before = move;
		
		if (len<(len/2)) {
			if (move=="U") {move=move+alter.selectRandom();}
			else {move=move+2;}
		}
		else {move=move+alter.selectRandom();}
        // Keeps non-U moves to 180° for first half of scramble
		
        final.push(move);
		len -= 1;
	}
	return final.join(" ");
}

function genScramble3(len = 25) {
	var final = [];
	var alter = ["", "'", "2"];
	var before; var beforeThat;
	
	while (len > 0) {
		var poss = ["R", "L", "U", "D", "F", "B"];
		poss.remove(before); // Avoids things like R2 R'
		if (opposite[before] == beforeThat) { poss.remove(beforeThat); }
        // Avoids things like F' B2 F'
		
		var move = poss.selectRandom();
		beforeThat = before; before = move;
		final.push(move);
		len -= 1;	
        
	}
    
	for (var m = 0; m < final.length; m++) {
		if (m < 10) {
			if (final[m] == "U" || final[m] == "D"){
				final[m] = final[m] + alter.selectRandom();
			}
			else { 
				final[m]  = final[m] + "2";
			}
		}
		
		else {
			final[m] = final[m] + alter.selectRandom();
		}
	}
	
	return final.join(" ");
}

function genScramble4(len = 40) {
    var final = [];
    var alter = ["", "'", "2"];
    var alterw = ["", "w"];
    var before; var beforeThat;
    
    while (len > 0) {
        var poss = ["R", "L", "U", "D", "F", "B"]
        
        poss.remove(before);
        if (opposite[before] == beforeThat){
            poss.remove(beforeThat);
        }
        
        var move = poss.selectRandom();
        beforeThat = before; before = move;
        final.push(move);
        len -= 1;
    }
    for (m in final) {
        if (final[m] == "U" || final[m] == "R" || final[m] == "F") {
            final[m] = final[m] + alterw.selectRandom() + alter.selectRandom();
        }
        else { final[m] = final[m] + alter.selectRandom(); }
    }
    return final.join(" ");
}

function genScramble5(len = 60) {
    var final = [];
    var alter = ["", "'", "2"];
    var alterw = ["", "w"];
    var before; var beforeThat;
    
    while (len > 0) {
        var poss = ["R", "L", "U", "D", "F", "B"]
        poss.remove(before);
        if (opposite[before] == beforeThat) {poss.remove(beforeThat); }
        
        var move = poss.selectRandom();
        beforeThat = before; before = move;
        final.push(move);
        len -= 1;
    }
    for (m in final) {
        final[m] = final[m] + alterw.selectRandom() + alter.selectRandom();
    }
    return final.join(" ");
}

function genScramble6(len = 80) {
    var final = [];
    var alter = ["", "'", "2"];
    var alter2 = ["", "2"];
    var alter3 = ["", "2", "3"];
    var before; var beforeThat;
    
    while (len > 0) {
        var poss = ["R", "L", "U", "D", "F", "B"]
        poss.remove(before);
        if (opposite[before] == beforeThat) { poss.remove(beforeThat); }
        
        var move = poss.selectRandom();
        beforeThat = before; before = move;
        final.push(move);
        len -= 1;
    }
    for (m in final) {
        if (final[m] == "U" || final[m] == "R" || final[m] == "F") {
            final[m] = alter3.selectRandom() + final[m] + alter.selectRandom();
        }
        else { final[m] = alter2.selectRandom() + final[m] + alter.selectRandom(); }
    }
    return final.join(" ");    
}

function genScramble7(len = 100) {
    var final = [];
    var alter = ["", "'", "2"];
    var alter2 = ["", "2", "3"];
    var before; var beforeThat;
    
    while (len > 0) {
        var poss = ["R", "L", "U", "D", "F", "B"];
        poss.remove(before);
        if (opposite[before] == beforeThat) {
            poss.remove(beforeThat);
        }
        
        var move = poss.selectRandom();
        beforeThat = before; before = move;
        final.push(move);
        len -= 1;
    }
    for (m in final) {
        final[m] = alter2.selectRandom() + final[m] + alter.selectRandom();
    }
    return final.join(" ");
}

function genScrambleP(len = 10) {
    var before;
    var final = [];
    var alter = ["", "'"];
    
    while (len > 0) {
        var poss = ["R", "U", "L", "B"];
        poss.remove(before);
        
        var move = poss.selectRandom();
        before = move;
        final.push(move);
        len -= 1;
    }
    
    var tipsToTurn = Math.floor(Math.random()*5);
    console.log(tipsToTurn);
    var tips = ["r", "u", "b", "l"];
    
    while (tipsToTurn > 0) {
        var toTurn = tips.selectRandom();
        tips.remove(toTurn);
        final.push(toTurn);
        
        tipsToTurn -= 1;
    }
    
    for (var a = 0; a < final.length; a++) {
        final[a] = final[a] + alter.selectRandom();
    }
    return final.join(" ");
}

function genScrambleS(len = 10) {
    var before;
    var final = [];
    var alter = ["", "'"];
    
    while (len > 0) {
        var poss = ["R", "L", "F", "B"];
        poss.remove(before);
        
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

function genScrambleM(len = 70) {
    var final = [];
    
    for (var a = 0; a < len; a++) {
        if (a%2 == 0) { final.push( ["R++", "R--"].selectRandom() ); }
        else { final.push( ["D++", "D--"].selectRandom() ); }
    }
    
    for (var b = 10; b < len+1; b+=10) {
        final.splice(b, 0, ["U", "U'"].selectRandom());
    }
    
    return final.join(" ");
}

function genScrambleEmpty() { return ""; }

// Rules for craps


/*
if (roll == 2 || roll == 3 || roll == 12) {
    result = "loss";
}
if (roll == 7 || roll == 11) {
    result = "win";
}

else ( points() )
*/

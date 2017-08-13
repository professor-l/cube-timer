var base64Encoding = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                      'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
                      'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
                      'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
                      'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
                      'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
                      'w', 'x', 'y', 'z', '1', '2', '3', '4',
                      '5', '6', '7', '8', '9', '0', '+', '/'];

function decimalTo64(i) {
    var final = [];
    
    // Number of digits necessary
    var digits = 1;
    // 1 more than max value at digits
    var bound = 63;
    
    // While i to convert is too large for current digits
    while (i > bound) {
        
        // Multiply by 64, add 1 to digits
        bound *= 64;
        digits++;
    }
    
    // Get powers of 64 for each digit in decending order
    var exp = []; 
    
    for (var j = 0; j < digits; j++) {
        exp.push(j);
    }
    exp.reverse();
    
    // For each digit
    for (var k = 0; k <= exp.length; k++) {
        
        // Power of 64, multiple of which will be
        // Represented as the k'th digit of the b64 value
        var component = Math.pow(64, exp[k]);

        // This digit as a base 10 value
        var thisDigit = Math.floor(i / component);

        // Adding base64 encoding of digit to final
        final.push(base64Encoding[thisDigit]);

        // Subtracting thisDigit from i
        i -= thisDigit * component;
    }
    return final.join("");
}

function base64ToDecimal(s) {
    var int = 0;
    
    // Beginning at appropriate power of 64
    var p = Math.pow(64, s.length - 1);
    
    // For each character
    for (var i = 0; i < s.length; i++) {
        
        // Add digit * p to final integer
        int += (base64Encoding.indexOf(s[i]) * p);
        
        p /= 64;
        
    }
    return int;
}



var scrambleDecodeTo = ["R", "R'", "R2", "U", "U'", "U2",
                        "F", "F'", "F2", "L", "L'", "L2",
                        "B", "B'", "B2", "D", "D'", "D2",
                      
                        "Rw", "Rw'", "Rw2", "Uw", "Uw'", "Uw2",
                        "Fw", "Fw'", "Fw2", "Lw", "Lw'", "Lw2",
                        "Bw", "Bw'", "Bw2", "Dw", "Dw'", "Dw2",
                      
                        "3Rw", "3Rw'", "3Rw2", "3Uw", "3Uw'", "3Uw2",
                        "3Fw", "3Fw'", "3Fw2", "3Lw", "3Lw'", "3Lw2",
                        "3Bw", "3Bw'", "3Bw2", "3Dw", "3Dw'", "3Dw2",
                       
                       "D++", "D--", "R++", "R--",
                       "l", "l'", "b", "b'", "r", "r'", "u", "u'"];

// A-Z, a-z, 0-9, and + / - _
// Order randomized because it looks cooler when you export :P
var scrambleEncodeTo = ["X", "x", "S", "9", "V", "H", "h", "+",
                        "W", "o", "a", "6", "U", "z", "f", "u",
                        "p", "O", "i", "v", "E", "C", "1", "/",
                        "_", "P", "I", "j", "r", "t", "k", "7",
                        "Z", "g", "L", "2", "G", "e", "-", "d",
                        "5", "D", "K", "M", "Q", "T", "3", "q",
                        "l", "R", "s", "n", "N", "J", "y", "b",
                        "A", "Y", "w", "m", "8", "0", "B", "F",
                        "c", "4"];

function encodeScramble(s) {
    // Split scramble into moves
    var moves = s.split(" ");
    
    // Remove blanks
    for (var q = 0; q < moves.length; q++) {
        if (moves[q] == "") {moves.splice(q, 1); q--;}
    }
    
    var final = [];
    
    // For each move
    for (var i = 0; i < moves.length; i++) {
        
        // Get value of move in encoded form with indexOf
        var e = scrambleEncodeTo[scrambleDecodeTo.indexOf(moves[i])];
        
        // If it encoded properly, add it to final
        if (e) { final.push(e); }
        
        // If it didn't encode properly, return uncompressed scramble
        else { return s; }
    }
    
    // Return string of final
    return final.join("");
}

function decodeScramble(s) {
    // Compressed moves in array form
    var movesC = s.split("");
    var final = [];
    
    // For each move
    for (var i = 0; i < movesC.length; i++) {
        
        // Get value of move in decoded form with indexOf
        var d = scrambleDecodeTo[scrambleEncodeTo.indexOf(movesC[i])];
        
        // If it decoded properly, add it to final
        if (d) { final.push(d); }
        
        // If it didn't, return compressed scramble
        else { return s; }
    }
    
    return final.join(" ");
}

function encodeTimeObject(ObjectToEncode) {
    
    var timeEncoded = decimalTo64(ObjectToEncode.time);
    var scrambleEncoded = encodeScramble(ObjectToEncode.scramble);
    
    var extra = "";
    if (ObjectToEncode.plusTwo) {extra = "!";}
    if (ObjectToEncode.dnf) {extra += "!!";}
    
    return extra + timeEncoded + ":" + scrambleEncoded;
}

function encodeEventTimes(event) {
    var final = [];
    
    // For each time, encode it and add it to list
    for (var i = 0; i < event.times.length; i++) {
        final.push(encodeTimeObject(event.times[i]));
    }
    
    // Get final list joined with commas
    var f = final.join(",");
    
    var lbl = "{" + event.name + "}";
    return lbl + f;
}

function encodeEverything() {
    var final = [];
    
    for (var i = 0; i < events.length; i++) {
        
        // Current event in parsing
        var parsing = events[i];
        
        if (parsing.times.length != 0) {
            final.push(encodeEventTimes(parsing));
        }
    }
    return final.join("");
}

function importEvent(encodedEvent) {
    
    // Split times by comma
    var times = encodedEvent.split(",");
    
    // For each time
    for (var i = 0; i < times.length; i++) {
        
        // Weed out invalid times
        if (times[i] == "") { continue; }
      
        // Split milliseconds and scramble
        var t = times[i].split(":");
        var ms = t[0];
        var sc = t[1];
        
        var dnf = false;
        var plusTwo = false;
        
        // Either +2 or DNF or both
        if (ms[0] == "!") {
            if (ms[1] == "!") {
                dnf = true;
                if (ms[2] == "!") { plusTwo = true; }
            }
            else { plusTwo = true; }
        }
        
        // Remove exclamation points from beginning
        while (ms[0] == "!") { ms = ms.slice(1); }
        
        ms = base64ToDecimal(ms);
        
        if (plusTwo) { ms -= 2000; }
        
        // Add time without updating scramble
        var timeObject = addTime(ms, decodeScramble(sc), false);
        
        if (plusTwo) {
            var affectsBest = (timeObject.time == currentEvent.best);
            var affectsWorst = (timeObject.time + 2000 > currentEvent.worst);

            // Value to add or subtract from session mean
            var valueChanged = 2000/currentEvent.times.length

            // If penalty was added, add value to session mean
            if ( timeObject.togglePenalty(true) ) {
                currentEvent.sessionMean += valueChanged;
            }

            // Else subtract same value from session mean
            else {
                currentEvent.sessionMean -= valueChanged;
            }

            // If we modified the best or worst time
            if (affectsBest || affectsWorst) {

                recalculateBestWorst();
            }

            updateAverageDisplays();
            recalculateAveragesAffectedBy(currentEvent.times.length - 1);
        }
        if (dnf) {
            
            timeObject.toggleDNF(true);
            
            if (currentEvent.best == timeObject.time || 
                currentEvent.worst == timeObject.time) {

                recalculateBestWorst();

            }
            
            recalculateAveragesAffectedBy(currentEvent.times.length - 1);
            updateAverageDisplays();
            
        }
    }
}

function importEvents(longstring) {
    
    // Store current event to revert back to
    var eventBefore = currentEvent;
    
    // Split into events
    var e = longstring.split("{");
    // For each event
    for (var i = 1; i < e.length; i++) {
        // Split into name and times
        var a = e[i].split("}");
        var name = a[0];
        var times = a[1];
        
        // Change event to event with that name
        for (var k = 0; i < events.length; i++) {
            if (events[i].name == name) {
                changeEvent(events[i]);
                break;
            }
        }
        
        // Import all those times
        importEvent(times);
    }
    
    // Change event back
    changeEvent(eventBefore);
}

window.onload = function() {
    // For each event
    for (var i = 0; i < events.length; i++) {
        
        // If localStorage has this event
        if (localStorage[events[i].name]) {
          
            // Parse, remove double commas
            localStorage[events[i].name] = localStorage[events[i].name].replace(",,", ",");
          
            // Change to this event
            changeEvent(events[i]);
            // Load times from localStorage
            importEvent(localStorage[events[i].name]);
        }
    }
    
    changeEvent(threeByThree);
}
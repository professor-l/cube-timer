var t2 = {times:[], scrambles:[], scramble:function() { return genScramble2(); }, el:document.getElementById("2x2"), name:"2", bao5:"-", bao12:"-" }

var t3 = {times:[], scrambles:[], scramble:function() { return genScramble3(); }, el:document.getElementById("3x3"), name:"3", bao5:"-", bao12:"-" }

var t4 = {times:[], scrambles:[], scramble:function() { return genScramble4(); }, el:document.getElementById("4x4"), name:"4", bao5:"-", bao12:"-" }

var t5 = {times:[], scrambles:[], scramble:function() { return genScramble5(); }, el:document.getElementById("5x5"), name:"5", bao5:"-", bao12:"-" }

var t6 = {times:[], scrambles:[], scramble:function() { return genScramble6(); }, el:document.getElementById("6x6"), name:"6", bao5:"-", bao12:"-" }

var t7 = {times:[], scrambles:[], scramble:function() { return genScramble7(); }, el:document.getElementById("7x7"), name:"7", bao5:"-", bao12:"-" }

var tOH = {times:[], scrambles:[], scramble:function() { return genScramble3(); }, el:document.getElementById("OH"), name:"oh", bao5:"-", bao12:"-" }

var tBLD = {times:[], scrambles:[], scramble:function() { return genScramble3(); }, el:document.getElementById("BLD"), name:"bld", bao5:"-", bao12:"-" }

var tPyra = {times:[], scrambles:[], scramble:function() { return genScrambleP(); }, el:document.getElementById("Pyra"), name:"pyra", bao5:"-", bao12:"-" }

var tMega = {times:[], scrambles:[], scramble:function() { return genScrambleM(); }, el:document.getElementById("Mega"), name:"mega", bao5:"-", bao12:"-" }

var tSkewb = {times:[], scrambles:[], scramble:function() { return genScrambleS(); }, el:document.getElementById("Skewb"), name:"skewb", bao5:"-", bao12:"-" }

var tOther = {times:[], scrambles:[], scramble:function() { return genScrambleEmpty(); }, el:document.getElementById("Other"), name:"other", bao5:"-", bao12:"-" }

var allTimeObjects = [t2, t3, t4, t5, t6, t7, tOH, tBLD, tPyra, tMega, tSkewb, tOther];

var timesCurrent = t3;

var timerTimeout;
var timerIsRunning = false;
var currentScramble;

function padZero(num, size) {
    var s = num.toString();
    while (s.length < size) { s = "0" + s; }
    return s;
}

function formatTime(rawMil) {
    // Formats 183649 milliseconds into 3:03.649
    if (typeof rawMil != "number") { return rawMil; }
    if (isNaN(rawMil) || rawMil == 0) { return "-" }
    
    rawMil = Math.round(rawMil);
    
    var hours = "";
    var minutes = "";
    
    var minutes = padZero(Math.floor(rawMil/60000), 2);
    rawMil -= minutes*60000;
    
    var seconds = padZero(Math.floor(rawMil/1000), 2);
    rawMil -= seconds*1000;
    
    var milliseconds = padZero(rawMil, 3);
    
    if (minutes >= 60) {
        hours = Math.floor(minutes/60) + ":";
        minutes = minutes % 60;
    }
    
    var toReturn = hours.toString() + minutes.toString() + ":" + seconds.toString() + "." + milliseconds.toString();
    if (hours == 0 && minutes < 10) { toReturn = toReturn.substring(1); }
    if (hours == 0 && minutes == 0 && hours == 0) { toReturn = toReturn.substring(2); }
    if (hours == 0 && minutes == 0 && hours == 0 && seconds < 10) { toReturn = toReturn.substring(1); }
    return toReturn;
}

document.getElementById("timer").innerHTML = "0.000";
currentScramble = genScramble3();
document.getElementById("scramble").innerHTML = currentScramble;

function addTime(ms) {
    timesCurrent.times.push(ms);
    timesCurrent.scrambles.push(currentScramble);
    // add ms to time list, scramble to scramble list
    
    currentScramble = timesCurrent.scramble();
    document.getElementById("scramble").innerHTML = currentScramble;
    // Updates scramble
    
    
    var table = document.getElementById("times");
    // table is the table of times element
    
    var newRow = document.createElement("tr");
    newRow.id = "time" + timesCurrent.times.length;
    // Create new <tr> in table
    
    table.insertBefore(newRow, table.firstChild);
    // Add new row into beginning of table
    
    var a = document.createElement("td");
    var num = newRow.appendChild(a);
    num.innerHTML = timesCurrent.times.length + ".";
    
    var b = document.createElement("td");
    var time = newRow.appendChild(b);
    time.innerHTML = formatTime(ms);
    
    var c = document.createElement("td");
    var del = newRow.appendChild(c);
    var d = document.createElement("a");
    var delLink = del.appendChild(d);
    
    delLink.innerHTML = "X";
    var x = timesCurrent.times.length - 1;
    delLink.onclick = function() { deleteTime(x); }
    
    var a5 = timesCurrent.times.avg(5);
    var a12 = timesCurrent.times.avg(12)
    
    if (a5 < timesCurrent.bao5 || timesCurrent.bao5 == "-") {
        timesCurrent.bao5 = a5;
    }
    
    if (a12 < timesCurrent.bao12 || timesCurrent.bao12 == "-") {
        timesCurrent.bao12 = a12;
    }
    
    document.getElementById("ao5").innerHTML = formatTime(a5);
    document.getElementById("ao12").innerHTML = formatTime(a12);
    
    document.getElementById("sessionMean").innerHTML = 
        "Mean: " + formatTime(timesCurrent.times.mean());
    document.getElementById("bestTime").innerHTML = 
        "Best: " + formatTime(timesCurrent.times.min());
    document.getElementById("ao5small").innerHTML = 
        "Average of 5: " + formatTime(timesCurrent.times.avg(5));
    document.getElementById("ao12small").innerHTML = 
        "Average of 12: " + formatTime(timesCurrent.times.avg(12));
    document.getElementById("sessionAvg").innerHTML = 
        "Average: " + formatTime(timesCurrent.times.avg());
    document.getElementById("worstTime").innerHTML = 
        "Worst: " + formatTime(timesCurrent.times.max());
    document.getElementById("bao5").innerHTML = 
        "Best Average of 5: " + formatTime(timesCurrent.bao5);
    document.getElementById("bao12").innerHTML = 
        "Best Average of 12: " + formatTime(timesCurrent.bao12);
}

function deleteTime(i) {   // 0 inclusive
    var timeTable = document.getElementById("times");
    timesCurrent.times.splice(i, 1);
    timesCurrent.scrambles.splice(i, 1);
    
    while (timeTable.lastChild) {
        timeTable.removeChild(timeTable.lastChild);
    }
    
    var newTimes = timesCurrent.times;
    timesCurrent.times = [];
    
    for (var i = 0; i < newTimes.length; i++) {
        addTime(newTimes[i]);
    }
    
    localStorage["t" + timesCurrent.name] = JSON.stringify(timesCurrent.times);
    localStorage["s" + timesCurrent.name] = JSON.stringify(timesCurrent.scrambles);
    if (timesCurrent.times.length == 0) {
        document.getElementById("sessionMean").innerHTML = "Mean: -";
        document.getElementById("bestTime").innerHTML = "Best: -";
        document.getElementById("worstTime").innerHTML = "Worst: -";
    }
    
    if (timesCurrent.times.length < 12) {
        document.getElementById("bao12").innerHTML = "Best Average of 12: -";
        timesCurrent.bao12 = "-";
    }
    
    if (timesCurrent.times.length < 5) {
        document.getElementById("bao5").innerHTML = "Best Average of 5: -";
        timesCurrent.bao5 = "-";
    }
    
}

function changeThemeColor(color) {
    document.getElementsByTagName("body")[0].id = "body" + color.charAt(0).toUpperCase() + color.slice(1);
    localStorage["color"] = color;
}

var c = localStorage["color"];
if (c == "red" || c == "orange" || c == "yellow" ||
    c == "green" || c == "blue" || c == "purple" || c == "black") {
    changeThemeColor(localStorage["color"]);
}
else { changeThemeColor("white"); }

var Timer = new function() {
    this.startedAt = 0;
    this.endedAt = 0;
    this.isRunning = false;
    
    this.start = function() {
        this.isRunning = true;
        this.startedAt = (new Date()).getTime();
    }
    
    this.currentTime = function() {
        if (this.isRunning == false) {
            return this.endedAt - this.startedAt;
        }
        else {
            return (new Date()).getTime() - this.startedAt;
        }
    }
    
    this.stop = function() {
        this.isRunning = false;
        this.endedAt = (new Date()).getTime();
    }
    
    this.reset = function() {
        this.startedAt = 0;
        this.endedAt = 0;
        this.isRunning = false;
    }
}

function startSolve() {
    Timer.start();
    timerTimeout = setInterval(function() { document.getElementById("timer").innerHTML = formatTime(Timer.currentTime()); }, 1)
}

function stopSolve() {
    Timer.stop();
    clearInterval(timerTimeout);
    document.getElementById("timer").innerHTML = formatTime(Timer.currentTime());
    addTime(Timer.currentTime());
    localStorage["t" + timesCurrent.name] = JSON.stringify(timesCurrent.times);
    localStorage["s" + timesCurrent.name] = JSON.stringify(timesCurrent.scrambles);
}

var justStopped = false;
document.body.onkeyup = function(e) {
    if (e.keyCode == 32) {
        if (justStopped == false) { startSolve(); }
        else { justStopped = false; }
    }
}
document.body.onkeydown = function(e) {
    if (e.keyCode == 32) {
        if (Timer.isRunning == true) {
            stopSolve();
            justStopped = true;
        }
    }
}

Array.prototype.avg = function(lengthToAvg = this.length) {
    if (this.length < lengthToAvg || this.length == 0) { return "-"; }
    var newArray = this.slice(this.length - lengthToAvg);
    newArray.splice(newArray.indexOf(newArray.max()), 1);
    newArray.splice(newArray.indexOf(newArray.min()), 1);
    return newArray.mean();
}

function clearTimes() { 
    timesCurrent.times = [];
    timesCurrent.scrambles = [];
    timesCurrent.bao5 = "-";
    timesCurrent.bao12 = "-";
    changeEvent(timesCurrent);
    addTime(0); deleteTime(0);
    localStorage["t" + timesCurrent.name] = "[]";
    localStorage["s" + timesCurrent.name] = "[]";
}

function changeEvent(newEvent) {
    timesCurrent = newEvent;
    var p = document.getElementById("times");
    while (p.lastChild) { p.removeChild(p.lastChild); }
    
    currentScramble = timesCurrent.scramble();
    document.getElementById("scramble").innerHTML = currentScramble;
    
    var tti = timesCurrent.times.length;
    var copy = timesCurrent.times.slice();
    while (timesCurrent.times.length > 0) { timesCurrent.times.pop(); }
    
    var ssi = timesCurrent.scrambles.length;
    var scopy = timesCurrent.scrambles.slice();
    while (timesCurrent.scrambles.length > 0) { timesCurrent.scrambles.pop(); }
    
    for (var a = 0; a < tti; a++) {
        addTime(copy[a]);
    }
    
    var events = document.querySelectorAll("td a");
    
    for (var i = 0; i < events.length; i++) {
        events[i].className = "inactive";
    }
    timesCurrent.el.className = "active";
    
    document.getElementById("ao5").innerHTML = formatTime(timesCurrent.times.avg(5));
    document.getElementById("ao12").innerHTML = formatTime(timesCurrent.times.avg(12));
    
    document.getElementById("sessionMean").innerHTML = "Mean: " + formatTime(timesCurrent.times.mean());
    
    document.getElementById("bestTime").innerHTML = "Best: " + formatTime(timesCurrent.times.min());
    
    document.getElementById("ao5small").innerHTML = "Average of 5: " + formatTime(timesCurrent.times.avg(5));
    
    document.getElementById("ao12small").innerHTML = "Average of 12: " + formatTime(timesCurrent.times.avg(12));
    
    document.getElementById("sessionAvg").innerHTML = "Average: " + formatTime(timesCurrent.times.avg());
    
    document.getElementById("worstTime").innerHTML = "Worst: " + formatTime(timesCurrent.times.max());
    
    document.getElementById("bao5").innerHTML = "Best Average of 5: " + formatTime(timesCurrent.bao5);
    
    document.getElementById("bao12").innerHTML = "Best Average of 12: " + formatTime(timesCurrent.bao12);
}

for (var i = 0; i < allTimeObjects.length; i++) {
    var toTest = localStorage["t" + allTimeObjects[i].name];
    var toTest2 = localStorage["s" + allTimeObjects[i].name];
    
    if (toTest == undefined) { localStorage["t" + allTimeObjects[i].name] = "[]"; }
    if (toTest2 == undefined) { localStorage["s" + allTimeObjects[i].name] = "[]"; }
} 
// if localStorage[t2] or [t4] or whatever is undefined, define it
// same with localStorage[s2] or [s4]

for (var a = 0; a < allTimeObjects.length; a++) {
    allTimeObjects[a].times = JSON.parse(localStorage["t" + allTimeObjects[a].name]);
    allTimeObjects[a].scrambles = JSON.parse(localStorage["s" + allTimeObjects[a].name]);
} // Add all the times and scrambles from localStorage

document.getElementById("2x2").onclick = function() { changeEvent(t2); }
document.getElementById("3x3").onclick = function() { changeEvent(t3); }
document.getElementById("4x4").onclick = function() { changeEvent(t4); }
document.getElementById("5x5").onclick = function() { changeEvent(t5); }
document.getElementById("6x6").onclick = function() { changeEvent(t6); }
document.getElementById("7x7").onclick = function() { changeEvent(t7); }
document.getElementById("OH").onclick = function() { changeEvent(tOH); }
document.getElementById("BLD").onclick = function() { changeEvent(tBLD); }
document.getElementById("Pyra").onclick = function() { changeEvent(tPyra); }
document.getElementById("Mega").onclick = function() { changeEvent(tMega); }
document.getElementById("Skewb").onclick = function() { changeEvent(tSkewb); }
document.getElementById("Other").onclick = function() { changeEvent(tOther); }

changeEvent(t3);
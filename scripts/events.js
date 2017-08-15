// Event object for easy use throughout code
function Event(name, scrambleFunction) {
    
    this.name = name;
    
    this.times = [];
    this.timesToAvg = 0;
    
    this.scramble = scrambleFunction;
    
    this.element = document.getElementById(name);
    
    this.best = new Time(Infinity);
    this.worst = new Time(-Infinity);
    
    this.bestAvg5 = Infinity;
    this.bestAvg12 = Infinity;
    
    this.sessionMean = 0;
}

// All the events included in the timer, plus an 'other'

var twoByTwo = new Event("2x2", genScramble2);

var threeByThree = new Event("3x3", genScramble3);

var fourByFour = new Event("4x4", genScramble4);

var fiveByFive = new Event("5x5", genScramble5);

var sixBySix = new Event("6x6", genScramble6);

var sevenBySeven = new Event("7x7", genScramble7);

var oneHanded = new Event("oh", genScramble3);

var blindfolded = new Event("bld", genScramble3b);

var pyraminx = new Event("pyra", genScrambleP);

var megaminx = new Event("mega", genScrambleM);

var square1 = new Event("sq1", genScrambleS1);

var skewb = new Event("skewb", genScrambleS);

var other = new Event("other", genScrambleEmpty);



var events = [twoByTwo, threeByThree, fourByFour, fiveByFive,
             sixBySix, sevenBySeven, oneHanded, blindfolded,
             pyraminx, megaminx, square1, skewb, other];

var currentEvent;



// Set onclick of each event element

// Parent element of all the event tabs
var eEls = document.getElementById("eventsParent").children;
var eventElements = [];

// Map eEls (parent element) .children to an actual array
for (var k = 0; k < eEls.length; k++) {
    eventElements.push(eEls[k]);
}


for (var i = 0; i < eventElements.length; i++) {
    
    // Set each onclick function
    eventElements[i].onclick = function() {
        if (cubeTimer.isRunning) { return false; }
        // Make this active class instead of previous active
        currentEvent.element.className = "";
        this.className = "active";
        
        // changeEvent using .indexOf(this) in place dynamic var i
        changeEvent(events[eventElements.indexOf(this)]);
    }
}

function changeEvent(changeTo) {
    
    // If it's already that event, skip the rest
    if (changeTo == currentEvent) { return 0; }
    
    // Set currentEvent to changeTo
    currentEvent = changeTo;
    
    // Update font size so scramble doesn't get too large
    updateFontSize();
    
    // Update scramble element and preview if necessary
    updateScramble();
    
    // Update average display box
    updateAverageDisplays();
    timerElement.innerHTML = formatTime(0);
    
    // Clear HTML time list
    var timesElement = document.getElementById("timesTableBody");
    
    while (timesElement.firstElementChild) {
        timesElement.removeChild(timesElement.firstElementChild);
    }
    
    // Add back new times to HTML time list
    for (var i = 0; i < currentEvent.times.length; i++) {
        addTimeElement(currentEvent.times[i].time, i);
    }
    
    var a = document.getElementById("ao5").children[0];
    var b = document.getElementById("bao5").children[0];
    
    
    if (changeTo == sixBySix || 
        changeTo == sevenBySeven ||
        changeTo == blindfolded) {
        a.innerHTML = "Mean of 3:";
        b.innerHTML = "Best mean of 3:";
    }
    
    else {
        a.innerHTML = "Average of 5:"
        b.innerHTML = "Best avg of 5:";
    }
}

function updateFontSize() {
    var scrambleElement = document.getElementById("scramble");
    scrambleElement.style.fontSize = "16pt";
    if (currentEvent == fourByFour || 
        currentEvent == fiveByFive) {
        
        // Set font size of scramble to 14
        scrambleElement.style.fontSize = "14pt";
    }
    
    else if (currentEvent == sixBySix || 
            currentEvent == sevenBySeven || 
            currentEvent == megaminx) {
        
        // Set font size of scramble to 12
        scrambleElement.style.fontSize = "12pt";
    }
    
}

changeEvent(threeByThree);

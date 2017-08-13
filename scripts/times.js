// Time object, for easy use and abstraction
function Time(milliseconds, scramble, element) {
    
    this.time = milliseconds;
    this.formattedTime = formatTime(this.time);
    this.plusTwo = false;
    this.dnf = false;
    
    this.scramble = scramble;
    
    this.element = element;
    
    // Averages of 5 and 12 where this time is last time
    this.ao5 = false;
    this.ao12 = false;
    
    
    this.togglePenalty = function(fromStorage=false) {
        
        // Does it affect best or worst
        var affectsBest = (this.time == currentEvent.best);
        var affectsWorst = (this.time + 2000 == currentEvent.worst);
        
        // Value to add or subtract from session mean
        var valueChanged = 2000/currentEvent.times.length;
        
        // Get encoded value, for adding exclamation points later
        var e = encodeTimeObject(this);
        
        // If penalty is currently true, remove it
        if (this.plusTwo) { 
            this.plusTwo = false;
            this.time -= 2000;
            
            // Remove 'true' from element class
            this.element.children[2].className = "penalty";
        }
        // Else, add penalty
        else { 
            this.plusTwo = true;
            this.time += 2000;
            
            // Add 'true' to element class
            this.element.children[2].className = "penalty true";
        }
        
        // At the end, update this.formattedTime and element
        this.formattedTime = formatTime(this.time);
        this.element.children[1].innerHTML = this.formattedTime;
        
        // Update encoded time object in localStorage
        if (!fromStorage) {
            localStorage[currentEvent.name] = localStorage[currentEvent.name].replace(e, encodeTimeObject(this));
        }
        
        if (this.plusTwo) {
            currentEvent.sessionMean += valueChanged;
        }
        
        else {
            currentEvent.sessionMean -= valueChanged;
        }
        
        if (affectsBest || affectsWorst) {
            recalculateBestWorst();
        }
        
        recalculateAveragesAffectedBy(currentEvent.times.indexOf(this));
        updateAverageDisplays();
        
        // Return new value of plusTwo
        return this.plusTwo;
    }
    
    this.toggleDNF = function(fromStorage=false) {
        
        // Get encoded value, for adding exclamation points later
        var e = encodeTimeObject(this);
        
        // If dnf curently true, remove it
        if (this.dnf) {
            this.dnf = false;
            
            // Remove 'true' from class name
            this.element.children[3].className = "dnf";
        }
        
        // Else, add dnf
        else {
            this.dnf = true;
            
            // Add 'true' to class name
            this.element.children[3].className = "dnf true";
        }
        
        // Update encoded time object in localStorage
        if (!fromStorage) {
            localStorage[currentEvent.name] = localStorage[currentEvent.name].replace(e, encodeTimeObject(this));
        }
        
        if (currentEvent.best == this.time ||
           currentEvent.worst == this.time) {
            recalculateBestWorst();
        }
        
        recalculateAveragesAffectedBy(currentEvent.times.indexOf(this));
        updateAverageDisplays();
        
        // Return value of dnf
        return this.dnf;
    }
    

}

// Calculate cubing 'average' (mean without best or worst) of n solves
// Works with array of times (milliseconds) or Time() objects
Array.prototype.average = function(n, startIndex = this.length-1) {
    
    // If there aren't enough elements for ao5/12 between 
    // startIndex and first element, or if it's trying
    // to start on non-existent index, return false
    if (startIndex - n < -1 || startIndex >= this.length) { return false; }
    
    // Set min, max to last time in avg, sum to 0
    // Support for Time() objects or raw millisecond values
    var min = this[startIndex].time || this[startIndex];
    var max = min;
    var dnfs = 0;
    var sum = [];
    
    // Iterate down through array from startIndex element n times
    for (var i = startIndex; i >= startIndex - (n - 1); i--) {
        
        // var c for consiceness/legibility
        // Support for Time() objects or raw millisecond values
        var c = this[i].dnf || this[i].time || this[i];
        
        if (c === true) { dnfs++; }
        
        // Check for min and max
        if (c > max && Number.isInteger(c)) { max = c; }
        else if (c < min && Number.isInteger(c)) { min = c; }
        
        // Add value to sum - we'll subtract min and max after
        sum.push(c);
    }
    
    // finalSum is integer
    var finalSum = 0;
    
    // If too many dnfs, return dnf
    if (dnfs >= 2) { return "DNF";}
    
    // Add each NUMBER value to finalSum
    for (var k = 0; k < sum.length; k++) {
        if (Number.isInteger(sum[k])) {finalSum += sum[k];}
    }
    
    // If one is a dnf, don't subtract max, else do
    return (dnfs==1) ? (finalSum - min) / (n-2) : (finalSum - (min + max)) / (n - 2);
    
    
}



function addTime(time, scramble=currentScramble.scramble_string||currentScramble, u=true) {
    
    // Add element to time list on webpage
    var el = addTimeElement(time);

    // Recalculate average by...
    var newSessionMean = currentEvent.sessionMean;
    // Multiply average by length of times array to get sum
    newSessionMean *= currentEvent.times.length;
    // Add new time to sum to get new sum
    newSessionMean += time;
    // Divide new sum by (length + 1) to get new average
    newSessionMean /= ( currentEvent.times.length + 1 );
    
    // Update currentEvent.sessionMean to newly calculated
    currentEvent.sessionMean = newSessionMean;
    
    // Create new instance of Time() object
    var thisTime = new Time(time, scramble, el);
    
    // If this time wasn't from local storage, add it
    if (u) {
        // Add it to local storage if it already exists
        if (localStorage[currentEvent.name]) {
            localStorage[currentEvent.name] += "," + encodeTimeObject(thisTime);
        } 

        // Else, create localStorage object and store it there
        else { localStorage[currentEvent.name] = encodeTimeObject(thisTime); }
    }
    
    // Add new time object to currentEvent times array
    currentEvent.times.push(thisTime);
    thisTime.ao5 = currentEvent.times.average(5);
    thisTime.ao12 = currentEvent.times.average(12);
    
    // If best average of 5 or 12 are surpsased, redefine them
    if (!currentEvent.bestAvg5 || thisTime.ao5 < currentEvent.bestAvg5) {
        currentEvent.bestAvg5 = thisTime.ao5;
    }
    
    if (!currentEvent.bestAvg12 || thisTime.ao12 < currentEvent.bestAvg12) {
        currentEvent.bestAvg12 = thisTime.ao12;
    }
    
    
    // If time is new best or worst, take note
    if (time > currentEvent.worst) { currentEvent.worst = time; }
    if (time < currentEvent.best) { currentEvent.best = time; }
    
    // Update scramble var and element text
    if (u) { updateScramble(); }
    
    updateAverageDisplays();
    
    return thisTime;
}

// Allows adding them with custom index (for event switching)
// Index defaults to currentEvent.times.length if time is new
function addTimeElement(time, index = currentEvent.times.length) {
    
    var tableRow = document.createElement("tr");
    tableRow.id = "timeRow" + index;
    
    
    // Number label of time, far left
    var num = document.createElement("td"); 
    num.className = "num";
    // Add innerHTML, index of time + 1, then a dot
    num.innerHTML = (index + 1) + ".";
    
    
    
    // Actual time, formatted
    var timeEl = document.createElement("td");
    timeEl.className = "time";
    timeEl.innerHTML = formatTime(time);
    
    // Add onclick that displays info modal
    timeEl.onclick = function() {
        displayInfo(currentEvent.times[index]);
    }
    
    
    // +2 icon next to each time
    var penalty = document.createElement("td");
    penalty.className = "penalty";
    penalty.innerHTML = "+2";
    
    // Add onclick that toggles plusTwo
    penalty.onclick = function() {
        
        // First get index of time by checking label
        var label = this.parentElement.firstElementChild;
        var indexOfTime = parseInt(label.innerHTML) - 1;
        
        var timeObject = currentEvent.times[indexOfTime];
        
        timeObject.togglePenalty();
    }
    
    // DNF icon next to each time
    var dnf = document.createElement("td");
    dnf.className = "dnf";
    dnf.innerHTML = "DNF";
    
    dnf.onclick = function() {
        
        // Index of time in currentEvent.times
        var label = this.parentElement.firstElementChild;
        var indexOfTime = parseInt(label.innerHTML) - 1;
        
        // Time object in storage
        var timeObject = currentEvent.times[indexOfTime];
        
        timeObject.toggleDNF();
        
    }
    
    
    
    
    // Red X that will delete time
    var del = document.createElement("td");
    del.className = "delete";
    del.innerHTML = "X";
    del.onclick = function() { 
        
        // First get index of time by checking label
        var label = this.parentElement.firstElementChild;
        var indexOfTime = parseInt(label.innerHTML) - 1;
        
        deleteTime(indexOfTime);
    }
    
    // Add elements to row element
    tableRow.appendChild(num);
    tableRow.appendChild(timeEl);
    tableRow.appendChild(penalty);
    tableRow.appendChild(dnf);
    tableRow.appendChild(del);
    
    // Add row element to table
    var t = document.getElementById("timesTableBody");
    t.insertBefore(tableRow, t.firstElementChild);
    
    // Returns HTML element
    return tableRow;
}



function deleteTime(indexOfTime) {
    
    var timeObject = currentEvent.times[indexOfTime];
    
    // First step is to remove HTML element from list
    
    var el = document.getElementById("timeRow" + indexOfTime);
    document.getElementById("timesTableBody").removeChild(el);
    
    // Now, remove time in localStorage
    // Split at time object, remove extra comma
    localStorage[currentEvent.name] = localStorage[currentEvent.name].split(encodeTimeObject(timeObject)).join("").replace(",,", ",");
    
    // If it's "empty", remove object
    if (localStorage[currentEvent.name] == ",") {
        localStorage.removeItem(currentEvent.name);
    }
    
    // Iterate through ever element AFTER deleted one
    var iter = indexOfTime + 1;
    
    while(document.getElementById("timeRow" + iter)) {
        
        // Define element
        el = document.getElementById("timeRow" + iter);
        
        // Change element id and innerHTML
        el.id = "timeRow" + (iter - 1);
        el.firstChild.innerHTML = iter + ".";
        
        iter++;
    }
    
    // Recalculate session mean
    // Multiply mean by length to get sum
    var sum = currentEvent.sessionMean * currentEvent.times.length;
    // Subtract time to delete from sum
    sum -= timeObject.time;
    // Divide sum by new times.length
    currentEvent.sessionMean = sum / (currentEvent.times.length - 1) || 0;
    
    // Check if best, worst, or best ao5/12 were just deleted
    var best = false; var worst = false;
    
    if (timeObject.time == currentEvent.best) {
        best = true;
    }
    
    if (timeObject.time == currentEvent.worst) {
        worst = true;
    }

    
    
    // Third step is to remove the actual Time() object
    // from currentEvent.times array
    currentEvent.times.splice(indexOfTime, 1);
    
    // Fourth step is to recalculate averages and best/worst
    recalculateAveragesAffectedBy(indexOfTime);
    
    // Finally, if any credentials were deleted, find new ones
    if (best || worst) {
        recalculateBestWorst();
    }
    
    // Reset best averages to recalculate
    // I can't find a way around this
    currentEvent.bestAvg5 = Infinity; currentEvent.bestAvg12 = Infinity;
    
    // Loop through times array
    for (var i = 0; i < currentEvent.times.length; i++) {
        
        var t = currentEvent.times[i];
        
        // If new lowest, replace with lowest
        if (t.ao5 && t.ao5 < currentEvent.bestAvg5) { 
            currentEvent.bestAvg5 = t.ao5; 
        }
        
        // If new highest, replace with highest
        if (t.ao12 && t.ao12 < currentEvent.bestAvg12) {
            currentEvent.bestAvg12 = t.ao12;
        }
        
    }
    
    // Update displays
    updateAverageDisplays();
    
}



// Recalculates averages affected by a change or deletion at indexOfTime
function recalculateAveragesAffectedBy(indexOfTime) {
    
    // Bool that determines whether one of the recalculated
    // averages was the event's best
    var bestChanged5 = false, bestChanged12 = false;
    
    // Start at indexOfTime and recalculate next eleven
    for (var i = indexOfTime, k = indexOfTime + 11; i < k; i++) {
        
        var currentTime = currentEvent.times[i];
        
        // If we're beyond list of times, break loop
        if (!currentTime) { break; }
            
        // If it's the event's best average of 5, make note
        if (currentEvent.times[i].ao5 == currentEvent.bestAvg5) {
            bestChanged5 = true;
        }
        // Recalculate ao5
        currentEvent.times[i].ao5 = currentEvent.times.average(5, i);
        
        // If it's the event's best average of 12, make note
        if (currentEvent.times[i].ao12 == currentEvent.bestAvg12) {
            bestChanged12 = true;
        }
        // Recalculate ao12
        currentEvent.times[i].ao12 = currentEvent.times.average(12, i);
    }
    
    // If either best was compromised...
    if (bestChanged5 || bestChanged12) {
        
        var newBest5 = Infinity, newBest12 = Infinity;
        
        // Parse through times array to find new bests
        for (var i = 0; i < currentEvent.times.length; i++) {
            var t = currentEvent.times[i];
            
            if (t.ao5 && t.ao5 < newBest5) { newBest5 = t.ao5; }
            if (t.ao12 && t.ao12 < newBest12) { newBest12 = t.ao12; }
        }
        currentEvent.bestAvg5 = newBest5 || Infinity;
        currentEvent.bestAvg12 = newBest12 || Infinity;
    }
}

function recalculateBestWorst() {
    // Parse through currentEvent again and redefine them
    currentEvent.best = Infinity;
    currentEvent.worst = -Infinity;

    for (var i = 0; i < currentEvent.times.length; i++) {
        
        // Skip it if it's a dnf
        if (currentEvent.times[i].dnf) { continue; }
        
        // Document time value
        var t = currentEvent.times[i].time;

        if (t < currentEvent.best) { currentEvent.best = t; }
        if (t > currentEvent.worst) { currentEvent.worst = t; }
    }
}


function updateAverageDisplays() {
    
    // Define all the HTML element variables
    
    // Averages of 5 and 12
    var ao5 = document.getElementById("ao5").children[1];
    var ao12 = document.getElementById("ao12").children[1];
    
    // Session mean
    var mean = document.getElementById("sessionMean").children[1];
    
    // Best and worst times
    var pb = document.getElementById("best").children[1];
    var pw = document.getElementById("worst").children[1];

    // Best avg of 5 and 12
    var bao5 = document.getElementById("bao5").children[1];
    var bao12 = document.getElementById("bao12").children[1];
    
    ao5.innerHTML = formatTime(currentEvent.times.average(5)) || "-";
    ao12.innerHTML = formatTime(currentEvent.times.average(12)) || "-";
    
    mean.innerHTML = formatTime(currentEvent.sessionMean) || "-";
    if (currentEvent.sessionMean == 0) { mean.innerHTML = "-"; }
    
    pb.innerHTML = formatTime(currentEvent.best) || "-";
    pw.innerHTML = formatTime(currentEvent.worst) || "-";
    
    bao5.innerHTML = formatTime(currentEvent.bestAvg5) || "-";
    bao12.innerHTML = formatTime(currentEvent.bestAvg12) || "-";
    
}
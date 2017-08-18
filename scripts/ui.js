

var red = "#e74c3c";
var green = "#2ecc71";

// Interval variable for timer update
var updateTimer;

// Just stopped prevents timer only being stopped while space is pressed
var justStopped = false;

// heldDown requires space bar held for 0.55 seconds (stackmat reg)
var heldDown = false;
// heldDownTimeout is Timeout variable for 0.55 seconds
var heldDownTimeout;

// bool indicating whether currently in inspection
var inspectionTime = false;
// Interval of inspection time countdown
var inspectionInterval;

// Defined as function to rebind event handlers and avoid
// Rapid re-calling of event function when key is held down
function onkeydownFunction(e) { 
    
    this.onkeydown = null;
    
    // If the timer is running, stop it
    if (cubeTimer.isRunning && e.keyCode != 32) { stopCubeTimer(); }
    
    // If it's not the space bar or timer is disabled, carry on
    if (e.keyCode != 32 || Settings.timerDisabled) { return true; }
    
    if (cubeTimer.isRunning) {
        stopCubeTimer(); heldDown = false;
    }
    
    else {
        heldDown = false;
        timerElement.style.color = red;
        // Begin timeout for 0.55 seconds
        heldDownTimeout = setTimeout(function() {
            heldDown = true;
            timerElement.style.color = green;
        }, Settings.holdDelay);
    }
}

// Bind event to start (unbinds and rebinds as necessary)
document.onkeydown = onkeydownFunction;

// onkeyup event to start timer/inspection
document.onkeyup = function(e) {
    
    // Rebind onkeydown event - works for all events, not just space
    this.onkeydown = onkeydownFunction;
    
    if (e.keyCode != 32 && justStopped) { justStopped = false; }
    // If it's not the space bar or timer is disabled, carry on
    if (e.keyCode != 32 || Settings.timerDisabled) { return true; }
    
    // Remove red or green coloring
    timerElement.style.color = "#444444";
    
    // Clear heldDownTimeout - key is released, timeout restarts
    clearTimeout(heldDownTimeout);
    heldDownTimeout = undefined;
    
    // If it's not running and it's not just stopped AND heldDown==true
    if (!cubeTimer.isRunning && !justStopped && heldDown) {

        heldDown = false;
        
        // Should we include inspection time?
        if (Settings.inspectionTime) {
            
            // If inspection has already started, start solve itself
            if (inspectionTime == true) {
                
                inspectionTime = false;
                clearInterval(inspectionInterval);
                startCubeTimer();
            }
            
            else {
                // Start inspection time
                inspectionTime = true;
                
                // Inspection time (settings variable)
                var timeLeft = Settings.inspectionTimeLength; 
                timerElement.innerHTML = timeLeft;

                // Subtract one each second 
                inspectionInterval = setInterval(function() {
                    
                    timeLeft--;
                    
                    timerElement.innerHTML = timeLeft;

                    // If we're all done, start the solve
                    if (timeLeft == 0) { 
                        clearInterval(inspectionInterval);
                        startCubeTimer();
                    }
                }, 1000)
            } 
        }
        
        // If there's no inspection time to deal with, start solve
        else {
            startCubeTimer();
        }
    }
    
    // If justStopped was true (prevent solve/inspection from starting),
    // set it to false so it works next time around.
    else { justStopped = false; }
}

function startCubeTimer() {
    
    // Start timer object
    cubeTimer.start();
    
    // If settings prefers to hide timer while solving
    if (Settings.hideTimer) {
        // Set variable to "Running"
        timerElement.innerHTML = "Running";
    }
    
    else {
        // Begin updating timer on screen
        updateTimer = setInterval( function () {

            // Display formatted time in timerElement
            updateTimerElement(formatTime(cubeTimer.currentTime()));    

        }, 1);
    }
}

function updateTimerElement(formattedTime) {

    timerElement.innerHTML = formattedTime;
}

function stopCubeTimer() {
    
    // Stop timer object
    cubeTimer.stop();
    
    // Stop updating timer element, then update it one last time
    clearInterval(updateTimer);
    timerElement.innerHTML = formatTime(cubeTimer.currentTime())
    
    
    // Prevent timer from restarting immediately after stopping
    justStopped = true;
    
    addTime(cubeTimer.currentTime());
}

document.getElementById("best").children[1].onclick = function() {
    if (this.innerHTML != "-") {
        displayInfo(currentEvent.best);
    }
}

document.getElementById("worst").children[1].onclick = function() {
    if (this.innerHTML != "-") {
        displayInfo(currentEvent.worst);
    }
}

function ordinalSuffix(i) {
    var j = i % 10;
    var k = i % 100;
    
    if (j == 1 && k != 11) { return i + "st"; }
    if (j == 2 && k != 12) { return i + "nd"; }
    if (j == 3 && k != 13) { return i + "rd"; }
    return i + "th";
}

// Define displayInfo function that displays #timeInfo modal
function displayInfo(timeObject) {
    var indexOfTime = currentEvent.times.indexOf(timeObject);
    
    // Define variables for various elements
    var formattedTimeElement = document.getElementById("timeInfoValue");
    var millisecondsElement = document.getElementById("timeInfoMilliseconds");
    var indexElement = document.getElementById("timeInfoIndex");
    var scrambleElement = document.getElementById("timeInfoScramble");
    
    // Reset color in case previous time was blue
    formattedTimeElement.style.color = "#444444";
    
    // Set innerHTML for each one with accurate info
    formattedTimeElement.innerHTML = timeObject.formattedTime;
    millisecondsElement.innerHTML = timeObject.time + " milliseconds";
    scrambleElement.innerHTML = timeObject.scramble;
    indexElement.innerHTML = "(" + ordinalSuffix(indexOfTime + 1) + " Time)"
    
    // Special case if solve is a +2
    if ( timeObject.plusTwo ) {
        
        formattedTimeElement.innerHTML += "+";
        millisecondsElement.innerHTML += " (originally " + (timeObject.time - 2000) + " milliseconds)";
        
        formattedTimeElement.style.color = "#9b59b6";
        
    }
    
    // Special case if solve is a DNF
    if ( timeObject.dnf ) {
        
        formattedTimeElement.innerHTML = "DNF";
        formattedTimeElement.style.color = "#e67e22";
    }
    
    displayModal(document.getElementById("timeInfoWrapper"));
    
    Settings.timerDisabled = true;
    
}



function displayAverage(indexOfTime, size, omitBW=false) {
    
    // Get index of the time whose avg we're displaying
    var timeObject = currentEvent.times[indexOfTime];
    
    var times = [];
    var sum = 0;
    var average, min, max;
    min = omitBW ? -Infinity : Infinity;
    max = omitBW ? Infinity : -Infinity;
    
    
    for (var i = indexOfTime; i > (indexOfTime - size); i--) {
        
        // If DNF, continue
        if (currentEvent.times[i].dnf) {
            if (max == "DNF" || omitBW) { average = "DNF"; }
            else { max = omitBW ? Infinity : "DNF"; }
        }
        
        // Get time value, check min/max
        var t = currentEvent.times[i].time;
        
        if (!currentEvent.times[i].dnf) {
            if (t < min) { min = t; }
            else if (t > max) { max = t; }
        }
        
        // Add value to times array, add to sum if not dnf
        times.push(currentEvent.times[i].dnf ? "DNF" : t);
        if (!currentEvent.times[i].dnf) { sum += t; }
        
    }
    
    // Subtract max if not dnf, subtract min
    if (max != "DNF" && max != Infinity) { sum -= max; }
    if (min != -Infinity) { sum -= min; }
    
    
    if (average != "DNF") {
        average = sum/(size - (omitBW ? 0 : 2));
    }
    
    // Parse times array, format + add parentheses
    for (var k = 0; k < times.length; k++) {
        
        // Formatted time
        var formatted = formatTime(times[k]);
        
        // If it was a plus two, add + to formatted
        if (currentEvent.times[indexOfTime - k].plusTwo) { formatted += "+"; }
        
        // If var is min or max, add parentheses and format
        if (times[k] == min || times[k] == max) {
            times[k] = "(" + formatted + ")";
        }
        
        // Else just format
        else { times[k] = formatted; }
        
        // If it's a DNF, make it orange
        if (times[k] == "(DNF)") {
            times[k] = "<span style='color:#e67e22;'>" + times[k] + "</span>";
        }
        
        else if (times[k][times[k].length - 1] == "+") {
            times[k] = "<span style='color:#9b59b6;'>" + times[k] + "</span>";
        }
        
    }
    // Reverse it so it starts with the first time and ends with most recent
    times.reverse();
    
    document.getElementById("avgTimesList").innerHTML = times.join(", ");
    document.getElementById("avgInfoValue").innerHTML = formatTime(average);
    document.getElementById("timeIndexes").innerHTML = "(Times " + (indexOfTime - (size - 2)) + " through " + (indexOfTime + 1) + ")";
    
    
    // Display modal
    displayModal(document.getElementById("avgInfoWrapper"));
    
    Settings.timerDisabled = true;
    
}

// On ao5 element click, display ao5 info.  Same with ao12
document.getElementById("ao5").children[1].onclick = function() {
    
    if (this.innerHTML != "-") {
        
        if (currentEvent == sixBySix || 
            currentEvent == sevenBySeven || 
            currentEvent == blindfolded) {
            displayAverage(currentEvent.times.length - 1, 3, true);
        }
        
        else {
            displayAverage(currentEvent.times.length - 1, 5);
        }
    }
}

document.getElementById("ao12").children[1].onclick = function() {
    
    if (this.innerHTML != "-") {
        displayAverage(currentEvent.times.length - 1, 12);
    }
}

// Tricky part: best averages
document.getElementById("bao5").children[1].onclick = function() {
    
    // Don't bother if there isn't an average
    if (this.innerHTML == "-") { return false; }
    
    // First, find time that has this average
    for (var i = 0; i < currentEvent.times.length; i++) {
        
        // If average is found, display its info and break
        if (currentEvent.times[i].ao5 == currentEvent.bestAvg5) {
            
            if (currentEvent == sixBySix || 
                currentEvent == sevenBySeven || 
                currentEvent == blindfolded) {
                displayAverage(i, 3, true);
            }
            
            else {
                displayAverage(i, 5);
            }
            break;
        }
    }
    
}

document.getElementById("bao12").children[1].onclick = function() {
    
    // Don't bother if there isn't an average
    if (this.innerHTML == "-") { return false; }
    
    // First, find time that has this average
    for (var i = 0; i < currentEvent.times.length; i++) {
        
        // If average is found, display its info and break
        if (currentEvent.times[i].ao12 == currentEvent.bestAvg12) {
            
            displayAverage(i, 12);
            break;
        }
    }
    
}



// Make settings and info icons blue on hover
var settingsIcon = document.getElementById("settingsIcon");
var infoIcon = document.getElementById("infoIcon");
var importIcon = document.getElementById("importIcon");
var exportIcon = document.getElementById("exportIcon");

settingsIcon.onmouseenter = function() {
    this.src = "images/settings_blue.png";
}
settingsIcon.onmouseleave = function() {
    this.src = "images/settings_gray.png";
}
infoIcon.onmouseenter = function() {
    this.src = "images/info_blue.png";
}
infoIcon.onmouseleave = function() {
    this.src = "images/info_gray.png";
}
importIcon.onmouseenter = function() {
    this.src = "images/upload_blue.png";
}
importIcon.onmouseleave = function() {
    this.src = "images/upload_gray.png";
}
exportIcon.onmouseenter = function() {
    this.src = "images/download_blue.png";
}
exportIcon.onmouseleave = function() {
    this.src = "images/download_gray.png";
}



infoIcon.onclick = function() {
    displayModal(document.getElementById("infoWrapper"));
    Settings.timerDisabled = true;
}

var it1 = document.getElementById("howTo");
var it2 = document.getElementById("aboutMe");
var it3 = document.getElementById("versionNotes");


// On click functions
document.getElementById("info1").onclick = function() {
    
    // Set class to active, set classes of others to blank
    var c = this.parentElement.children;
    
    for (var i = 0; i < c.length; i++) {
        c[i].className = "";
    }
    this.className = "active";
    
    var toHide = document.getElementsByClassName("infoContent");
    
    for (var i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
    
    document.getElementById("howTo").style.display = "block";
}

document.getElementById("info2").onclick = function() {
    
    // Set class to active, set classes of others to blank
    var c = this.parentElement.children;
    
    for (var i = 0; i < c.length; i++) {
        c[i].className = "";
    }
    this.className = "active";
    
    var toHide = document.getElementsByClassName("infoContent");
    
    for (var i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
    
    document.getElementById("aboutMe").style.display = "block";
}

document.getElementById("info3").onclick = function() {
    
    // Set class to active, set classes of others to blank
    var c = this.parentElement.children;
    
    for (var i = 0; i < c.length; i++) {
        c[i].className = "";
    }
    this.className = "active";
    
    var toHide = document.getElementsByClassName("infoContent");
    
    for (var i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
    
    document.getElementById("versionNotes").style.display = "block";
}



// Define all modal close buttons on webpage
var modalCloseButtons = document.getElementsByClassName("closeModal");

// For each one, define onclick function
for (var i = 0; i < modalCloseButtons.length; i++) {
    
    modalCloseButtons[i].onclick = function() {
        
        // Get modal that is direct parent of this close button
        hideModal(this.parentElement.parentElement);
    }
}

function hideModal(wrapper) {
    var modal = wrapper.firstElementChild;
    
    // Fade out background, move modal up
    wrapper.style.backgroundColor = "transparent";
    modal.style.transform = "translateY(-60px)";
    modal.style.opacity = "0";
    
    // Set timeout for modal hide
    setTimeout(function() {wrapper.style.display = "none";}, 300);
    Settings.timerDisabled = false;
}

// Defining modal animation
function displayModal(wrapper) {
    var modal = wrapper.firstElementChild;
    
    // Display modal
    wrapper.style.display = "flex";
    setTimeout(function() {
        wrapper.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        modal.style.transform = "translateY(0px)";
        modal.style.opacity = 1;
    }, 1);
    
    Settings.timerDisabled = true;
    
}
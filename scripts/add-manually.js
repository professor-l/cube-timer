function addTimeManually(formattedTime, scramble="") {
    if (scramble == "") {
        var s = currentEvent.scramble();
        scramble = s.scramble_string || s;
    }
    
    formattedTime = formattedTime.split(":");
    
    var s = formattedTime.length - 1;
    
    // Get seconds, minutes, hours
    var seconds = parseFloat(formattedTime[s]);
    var minutes = parseInt(formattedTime[s - 1]) || 0;
    var hours = parseInt(formattedTime[s - 2]) || 0;
    
    var milliseconds = (seconds * 1000) + 
                       (minutes * 60 * 1000) + 
                       (hours * 60 * 60 * 1000);
    
    if (milliseconds < 0 || !Number.isInteger(milliseconds)) {
        return false;
    }
    
    addTime(milliseconds, scramble);
    
    return true;
}

function addMultipleTimes(longString) {
    var errors = 0;
    
    // Ignore empty string
    if (times == "") { return false; }
    
    // Split by commas
    var times = longString.split(",");
    
    // Add each time, noting errors
    for (var i = 0; i < times.length; i++) { 
        if (!addTimeManually(times[i])) {
            errors++;
        }
    }
    
    // If all failed, return false, else return failed num
    return errors == times.length ? false : errors;
}

var icon = document.getElementById("addTimesIcon");

icon.onmouseover = function() {
    this.src = "images/add_blue.png";
}

icon.onmouseleave = function() {
    this.src = "images/add_gray.png";
}

icon.onclick = function() {
    displayModal(document.getElementById("addManuallyWrapper"));
}

var addOne = document.getElementById("addOne");
var addOneDiv = document.getElementById("addOneDiv");

var addMany = document.getElementById("addMany");
var addManyDiv = document.getElementById("addManyDiv");

addOne.onclick = function() {
    addOneDiv.style.display = "block";
    addManyDiv.style.display = "none";
    
    this.className = "active";
    addMany.className = "";
}

addMany.onclick = function() {
    addManyDiv.style.display = "block";
    addOneDiv.style.display = "none";
    
    this.className = "active";
    addOne.className = "";
}


var addTimeButton = document.getElementById("addTimeButton");
var timeEl = document.getElementById("timeInput");
var scrambleEl = document.getElementById("scrambleInput");
var successEl = document.getElementById("addTimeSuccess")

addTimeButton.onclick = function() {
    
    // If it worked (also, do it)
    if (addTimeManually(timeEl.value, scrambleEl.value)) {
        
        // Set success element to indicate success
        successEl.innerHTML = "Success!";
        successEl.style.color = "#2ecc71";
        
        // Reset input values
        timeEl.value = "";
        scrambleEl.value = "";
        
    }
    
    // If it didn't work
    else {
        
        // Set success element to indicate failure
        successEl.innerHTML = "Error: invalid time";
        successEl.style.color = "#e74c3c";
    }
    
    successEl.style.display = "block";
    setTimeout(function() { successEl.style.display = "none"; }, 3000);
    
}



var multipleButton = document.getElementById("addTimesButton");
var multipleInput = document.getElementById("addTimesTextarea");
var multipleError = document.getElementById("addTimesSuccess");

multipleButton.onclick = function() {
    var worked = addMultipleTimes(multipleInput.value);
    
    // If it straight up failed, say it
    if (worked === false) {
        multipleError.innerHTML = "Error: invalid format or times."
        multipleError.style.color = "#e74c3c";
    }
    
    // If it partially succeded
    else if (worked > 0) {
        multipleError.innerHTML = "Warning: " + worked + " solves not added due to an error.";
        multipleError.style.color = "#f39c12";
    }
    
    // If it worked
    else {
        multipleError.innerHTML = "Success!";
        multipleError.style.color = "#2ecc71";
    }
    
    multipleError.style.display = "block";
    setTimeout(function() { multipleError.style.display = "none"; }, 3000);
}
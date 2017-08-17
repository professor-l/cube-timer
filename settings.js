var Settings = new Object();

// Inspection time setting - bool, plus length in seconds
Settings.inspectionTime = false;
Settings.inspectionTimeLength = 15;

// Milliseconds of delay before key release actually starts timer
Settings.holdDelay = 550;

// Number of decimal places to show in times
Settings.decimalPlaces = 3;

// Hide timer while solving
Settings.hideTimer = false;

// Timer disabled or not
Settings.timerDisabled = false;







// One global variable for settings change
var digitsChanged = false;

document.getElementById("settingsIcon").onclick = function() {
    // Setting var to false, track changes in digit display preferences
    digitsChanged = false;
    
    // Display modal
    displayModal(document.getElementById("settingsWrapper"));
    
    // Disable timer
    Settings.timerDisabled = true;
    
    // Define HTML variables
    var inspectionBool = document.getElementById("inspectionTimeInput");
    var inspectionInt = document.getElementById("inspectionSeconds");
    
    var holdDelayBool = document.getElementById("holdDelayInput");
    var holdDelayInt = document.getElementById("holdDelaySeconds");
    
    var hideTimerBool = document.getElementById("hideTimerInput");
    
    var scramblePreview = document.getElementById("scramblePreviewInput");
    
    var twoDigits = document.getElementById("digits2");
    var threeDigits = document.getElementById("digits3");
    
    // Inspection time
    inspectionBool.checked = Settings.inspectionTime;
    
    // Disable number input if inspection is turned off
    inspectionInt.disabled = !inspectionBool.checked;
    
    // Update state of number input when value is changed
    inspectionBool.onchange = function() {
        inspectionInt.disabled = !this.checked;
    }
    
    // Hold delay
    holdDelayBool.checked = (Settings.holdDelay != 0);
    
    // Disable number input if hold delay is turned off
    holdDelayInt.disabled = !holdDelayBool.checked;
    
    // Update state of number input when value is changed
    holdDelayBool.onchange = function() {
        holdDelayInt.disabled = !holdDelayBool.checked;
    }
    
    hideTimerBool.checked = Settings.hideTimer;
    
    var digits = document.getElementById("digitsButtonsWrapper").children;
    var which = Settings.decimalPlaces - 2;
    
    digits[which].className = "digit selected";
    digits[(which+1)%2].className = "digit";
    
}

document.getElementById("digits2").onclick = function() {
    Settings.decimalPlaces = 2;
    this.className = "digit selected";
    this.parentElement.children[1].className = "digit";
    digitsChanged = true;
}
document.getElementById("digits3").onclick = function() {
    Settings.decimalPlaces = 3;
    this.className = "digit selected";
    this.parentElement.children[0].className = "digit";
    digitsChanged = true;
}

document.getElementById("settingsSave").onclick = function() {
    
    // Checking inspection time
    var iti = document.getElementById("inspectionTimeInput");
    Settings.inspectionTime = iti.checked;
    
    var toTest = parseInt(document.getElementById("inspectionSeconds").value);
    
    // If it's NaN, set it to 0
    toTest = (isNaN(toTest)) ? 0 : toTest;
    
    // If outside scope 0-59, set it to 0 or 59
    toTest = (toTest > 59) ? 59 : toTest;
    toTest = (toTest < 0) ? 0 : toTest;
    
    Settings.inspectionTimeLength = toTest;
    
    
    // Checking hold delay 
    var hdi = document.getElementById("holdDelayInput");
    if (!hdi.checked) { Settings.holdDelay = 0; }
    else {
        var toTest2 = document.getElementById("holdDelaySeconds").value;
        toTest2 = parseFloat(toTest2);
        
        // If it's NaN, set it to 0
        toTest2 = (isNaN(toTest2)) ? 0 : toTest2;
        
        // If outside scope 0-2, set it to 0 or 2
        toTest2 = (toTest2 > 2) ? 2 : toTest2;
        toTest2 = (toTest2 < 0) ? 0 : toTest2;
        
        Settings.holdDelay = toTest2*1000;
    }
    
    // Set hideTimer preference
    Settings.hideTimer = document.getElementById("hideTimerInput").checked;
    
    if (digitsChanged) {
        
        updateAverageDisplays();
        
        timerElement.innerHTML = formatTime(0);
        
        // Update time label of each time listed
        for (var i = 0; i < currentEvent.times.length; i++) {
            
            // Get time object
            var timeObject = currentEvent.times[i];
            
            var timeLabel = timeObject.element.children[1];
            timeLabel.innerHTML = formatTime(timeObject.time);
            
        } 
    }
    
    hideModal(document.getElementById("settingsWrapper"));
    Settings.timerDisabled = false;
}
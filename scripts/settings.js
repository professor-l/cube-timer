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

Settings.font = "Anonymous Pro"; 

// Timer disabled or not
Settings.timerDisabled = false;

function saveSettings() {
    var toSave = "";
    
    // Encode inspection time and length
    toSave += (Settings.inspectionTime ? 1 : 0);
    toSave += decimalTo64(Settings.inspectionTimeLength);
    
    // Surround holdDelay with semicolons because unknown length
    toSave += ";";
    toSave += decimalTo64(Settings.holdDelay);
    toSave += ";";
    
    // Decimal places, hide timer as boolean vars
    toSave += (Settings.decimalPlaces - 2);
    toSave += (Settings.hideTimer ? 1 : 0);
    
    toSave += ";" + Settings.font;
    
    localStorage["settings"] = toSave;
}

function loadSettings() {
    
    var toLoad = localStorage["settings"];
    
    // If settings don't exist, nothing to load
    if (!toLoad) { return false; }
    
    toLoad = toLoad.split(";");
    
    Settings.inspectionTime = toLoad[0][0] == 0 ? false : true;
    Settings.inspectionTimeLength = base64ToDecimal(toLoad[0][1]);
    
    Settings.holdDelay = base64ToDecimal(toLoad[1]);
    
    Settings.decimalPlaces = parseInt(toLoad[2][0]) + 2;
    Settings.hideTimer = toLoad[2][1] == 0 ? false : true;
    
    Settings.font = toLoad[3];
    
    if (Settings.decimalPlaces == 2) {
        
        updateAverageDisplays();
        
        timerElement.innerHTML = formatTime(0);
        
        // Update time label of each time listed
        for (var i = 0; i < currentEvent.times.length; i++) {
            
            // Get time object
            var timeObject = currentEvent.times[i];
            
            // Rewrite times in list
            var timeLabel = timeObject.element.children[1];
            timeLabel.innerHTML = formatTime(timeObject.time);
            
        } 
    }
    
    timerElement.style.fontFamily = Settings.font;
}




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
    
    var fontPreview = document.getElementById("displayFont");
    
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
    
    fontPreview.style.fontFamily = Settings.font;
    
    hideConfirm();
    
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
            
            // Rewrite times in list
            var timeLabel = timeObject.element.children[1];
            timeLabel.innerHTML = formatTime(timeObject.time);
            
        } 
    }
    
    timerElement.style.fontFamily = Settings.font;
    
    hideModal(document.getElementById("settingsWrapper"));
    
    Settings.timerDisabled = false;
    
    saveSettings();
}

var tab1 = document.getElementById("timerSettings");
var tab2 = document.getElementById("visualSettings");
var tab3 = document.getElementById("eventSettings");

var div1 = document.getElementById("timerSettingsWrapper");
var div2 = document.getElementById("visualSettingsWrapper");
var div3 = document.getElementById("eventSettingsWrapper");

tab1.onclick = function() {
    tab1.className = "active";
    tab2.className = "";
    tab3.className = "";
    
    div1.style.display = "block";
    div2.style.display = "none";
    div3.style.display = "none";
    
    hideConfirm();
}

tab2.onclick = function() {
    tab1.className = "";
    tab2.className = "active";
    tab3.className = "";
    
    div1.style.display = "none";
    div2.style.display = "block";
    div3.style.display = "none";
    
    hideConfirm();
}

tab3.onclick = function() {
    tab1.className = "";
    tab2.className = "";
    tab3.className = "active";
    
    div1.style.display = "none";
    div2.style.display = "none";
    div3.style.display = "block";
    
    hideConfirm();
}

var preview = document.getElementById("displayFont");

// Set fonts onclick
document.getElementById("font1").onclick = function() {
    Settings.font = "Anonymous Pro";
    preview.style.fontFamily = "Anonymous Pro";
}
document.getElementById("font2").onclick = function() {
    Settings.font = "VT323";
    preview.style.fontFamily = "VT323";
}  
document.getElementById("font3").onclick = function() {
    Settings.font = "Iceland";
    preview.style.fontFamily = "Iceland";
}
document.getElementById("font4").onclick = function() {
    Settings.font = "Iceberg";
    preview.style.fontFamily = "Iceberg";
}



function showConfirm() {
    document.getElementById("confirmTimeCount").innerHTML = currentEvent.times.length;
    document.getElementById("confirmEventName").innerHTML = currentEvent.element.innerHTML;
    
    document.getElementById("clearTimesConfirm").style.transform = "translateY(0px)";
}

function hideConfirm() {
    document.getElementById("clearTimesConfirm").style.transform = "translateY(200px)";
}

document.getElementById("clearTimesButton").onclick = function() {
    if (currentEvent.times.length > 0) {
        showConfirm();
    }
}

document.getElementById("clearCancelButton").onclick = hideConfirm;

document.getElementById("clearConfirmButton").onclick = function() {
    hideConfirm();
    currentEvent.reset();
    var timesTable = document.getElementById("timesTableBody");
    while (timesTable.firstElementChild) {
        timesTable.removeChild(timesTable.firstElementChild);
    }
}
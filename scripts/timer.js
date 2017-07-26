var timerElement = document.getElementById("time");

function pad(n) {
    if (n < 10) { return "0" + n; }
    return n;
}



// Formats 183649 milliseconds to '3:03.649'

function formatTime(milliseconds) {
    
    if (typeof(milliseconds) != "number" || 
        milliseconds == Infinity         ||
        milliseconds == -Infinity) {
        return false;
    }
    
    milliseconds = Math.round(milliseconds);
    
    // Array that will contain hours, minutes, and seconds/milliseconds
    var hr_min_sec = [];
    
    var msPerMin = 1000 * 60;
    var msPerHr = msPerMin * 60;
    
    // Get number of hours, then subtract them
    var hours = Math.floor(milliseconds / msPerHr);
    milliseconds -= ( hours * msPerHr );
    
    // Do the same thing with minutes
    var minutes = Math.floor(milliseconds / msPerMin);
    milliseconds -= ( minutes * msPerMin );
    
    var seconds = milliseconds / 1000;
    // Decimal places to display (2 or 3)
    seconds = seconds.toFixed(Settings.decimalPlaces)
    
    
    // If it's more than an hour, account for that
    if (hours > 0) {
        // Add it to the list
        hr_min_sec.push(hours);
        
        // Pad zeroes on minutes and seconds
        minutes = pad(minutes); seconds = pad(seconds);
        
        // Add them to the list too
        hr_min_sec.push(minutes);
        hr_min_sec.push(seconds);
    }
    
    else if (minutes > 0) {
        // Add it to the list
        hr_min_sec.push(minutes);
        
        // Pad zeroes on seconds
        seconds = pad(seconds);
        
        // Add seconds to the list too
        hr_min_sec.push(seconds);
    }
    
    else {
        hr_min_sec.push(seconds);
    }
    
    return hr_min_sec.join(":");
}


// Not technically a timer but a stopwatch.
// Technicalities, technicalities.  My code, I do what I want.

function Timer() {
    
    // startedAt and endedAt are .getTime() of Date()
    // .getTime() returns milliseconds since Jan 1 1970
    this.startedAt = 0;
    this.endedAt = 0;
    
    this.isRunning = false;
    
    
    // Timer.start()
    this.start = function() {
        
        this.isRunning = true;
        
        // Set startedAt to a .getTime() value
        this.startedAt = (new Date()).getTime();
    }
    
    // Timer.stop()
    this.stop = function() {
        
        this.isRunning = false;
        
        // Set endedAt to a .getTime() value
        this.endedAt = (new Date()).getTime();
    }
    
    // Timer.reset()
    this.reset = function() {
        
        this.startedAt = 0;
        this.endedAt = 0;
        
        this.isRunning = false;
    }
    
    // Timer.currentTime() - return current time
    this.currentTime = function() {
        
        // If it's not running, return end minus start
        if ( !this.isRunning ) {
            return this.endedAt - this.startedAt;
        }
        
        // Else, return a new .getTime() value minus start
        return ( (new Date()).getTime() - this.startedAt );
    }
}

var cubeTimer = new Timer();
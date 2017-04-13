document.getElementById("details").onclick = function() {
    
    var table = document.getElementById("timeDetails");
    while (table.firstChild) { table.removeChild(table.firstChild); }
    
    for (var i = 0; i < timesCurrent.times.length; i++) {
        
        var newRow = document.createElement("tr");
        var numCol = document.createElement("td");
        var timeCol = document.createElement("td");
        var scrambleCol = document.createElement("td");
        
        numCol.innerHTML = (i+1) + ".";
        timeCol.innerHTML = formatTime(timesCurrent.times[i]);
        scrambleCol.innerHTML = timesCurrent.scrambles[i];
        
        newRow.appendChild(numCol);
        newRow.appendChild(timeCol);
        newRow.appendChild(scrambleCol);
        
        table.insertBefore(newRow, table.firstChild);
    }
    
    document.getElementById("timesModal").style.display = "block";
}


document.getElementById("closeTimesModal").onclick = function() {
    document.getElementById("timesModal").style.display = "none";
}




document.getElementById("clearTimes").onclick = function() {
    var onEvent = document.getElementsByClassName("active")[0].innerHTML;
    var clear = confirm("Are you sure?  This will erase all times for the current session (" + onEvent + "), and is irreversible.");
    
    if (clear == true) {
        clearTimes();
        
        var toClear = document.getElementById("timeDetails");
        while (toClear.firstChild) { toClear.removeChild(toClear.firstChild); }
    }
    
}

document.getElementById("settings").onclick = function() {
    document.getElementById("settingsModal").style.display = "block";
}
document.getElementById("closeSettingsModal").onclick = function() {
    document.getElementById("settingsModal").style.display = "none";
}

var colors = ["red", "orange", "yellow", "green", "blue", "purple", "white", "black"];

for (var i = 0; i < colors.length; i++) {
    var c = colors[i];
    document.getElementById(c).onclick = function() {
        changeThemeColor(this.id);
    }
}
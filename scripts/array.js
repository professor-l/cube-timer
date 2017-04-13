/*
* array.js is designed to simplify arrays, specifically
* numerical arrays, in JavaScript.  It currently supports:
* 
*       myArray.remove(val) removes all instances of val in myArray
*       myArray.selectRandom() returns random value in myArray
*       myArray.hasValue(val) returns true if myArray contains val, false otherwise
*       myArray.removeDuplicates() removes duplicates in myArray
*       myArray.randomize() randomizes order of the myArray and returns it
*       myArray.unNest() removes all nesting, making a flat, one dimensional array
*       myArray.count(val) counts occurances of val in myArray
*
*
*                           Statistics Functions:
*
*       myArray.mean() returns mean of myArray
*       myArray.min(), myArray.max() return min, max of myArray
*       myArray.sum() returns sum of all values of myArray
*       myArray.median() returns median of myArray
*       myArray.standardDeviation() returns standard deviation of values in myArray
*
*/

Array.prototype.remove = function(val) {
    for (var x = 0; x < this.length; x++) {
		if (this[x] == val) {this.splice(this.indexOf(val), 1); x -= 1;}
	}
    return val;
}

Array.prototype.selectRandom = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
	return newArray[Math.floor(Math.random()*newArray.length)];
}

Array.prototype.mean = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    return newArray.sum() / newArray.length;
}

Array.prototype.min = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    if (newArray.length == 0) { return 0; }
    return Math.min.apply(Math, newArray);
}

Array.prototype.max = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    if (newArray.length == 0) { return 0; }
    return Math.max.apply(newArray, this);
}

Array.prototype.sum = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    var s = 0;
    for (var i = 0; i < newArray.length; i++) { s += newArray[i]; }
    return s;
}

Array.prototype.median = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    newArray.sort( function(a, b) { return a - b; } );
    while (newArray.length >= 3) {
        newArray.shift(); newArray.pop();
    }
    return newArray.avg();
}

Array.prototype.standardDeviation = function(startIndex = 0, endIndex = this.length - 1) {
    var newArray = this.slice(startIndex, endIndex+1);
    var meanArray = [];
    
    var m = newArray.mean();
    for (var i = 0; i < newArray.length; i++) {
        meanArray.push( (newArray[i] - m) * (newArray[i] - m) );
    }
    return Math.sqrt(meanArray.mean());
}

Array.prototype.hasValue = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) { return true; }
    }
    return false;
}

Array.prototype.removeDuplicates = function() {
    var unique = [];
    var dups = [];
    for (var i = 0; i < this.length; i++) {
        if (unique.hasValue(this[i]) == false) { unique.push(this[i]); }
        else { dups.push(this[i]); }
    }
    while (this.length > 0) { this.pop(); }
    
    for (var k = 0; k < unique.length; k++) {
        this.push(unique[k]);
    }
    return dups;
}

Array.prototype.randomize = function() {
    var final = [];
    while (this.length > 0) {
        var r = Math.floor(Math.random()*this.length);
        final.push(this[r]);
        this.splice(r, 1);
    }
    
    while (this.length > 0) { this.pop(); }
    
    for (var k = 0; k < final.length; k++) {
        this.push(final[k]);
    }
    return this;
}

Array.prototype.unNest = function() {
    var final = [];
    
    function loopThrough(a) {
        if (a instanceof Array) {
            for (var i = 0; i < a.length; i++) {
                loopThrough(a[i])
            }
        }
        else { final.push(a); }
    }
    loopThrough(this);
    
    while (this.length > 0) { this.pop(); }
    
    for (var k = 0; k < final.length; k++) {
        this.push(final[k]);
    }
    return this;
}

Array.prototype.count = function(toCount) {
    var total = 0;
    for (var i = 0; i < this.length; i++) {
        if (this[i] === toCount) { total += 1; }
    }
    
    return total;
}
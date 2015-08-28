var _ = require('lodash');

// takes an array, removes all non-numbers and numbers < 1 and > 9, and returns the new array
function removeInvalidArrayObjects(a) {
  if (!(a instanceof Array)) a = [a];
  return a.filter(function (e) {
    if (isNaN(parseInt(e, 10))) {
      return false;
    }
    if (parseInt(e, 10) < 1 || parseInt(e, 10) > 9) {
      return false;
    }
    return true;
  });
}

function DigitSet(possibles) {
  this.possibles = [];
  if (arguments.length === 0) {
    for (var i = 1; i < 10; i++) {
      this.possibles.push(i.toString())
    }
  } else {
    this.add(possibles)
  }
}

DigitSet.prototype.size = function () {
  return this.possibles.length;
};

DigitSet.prototype.set = function (arrayOfDigits) {
  if (arrayOfDigits instanceof Array) {
    arrayOfDigits = removeInvalidArrayObjects(arrayOfDigits);
  } else {
    return;
  }
  this.possibles = _.union(arrayOfDigits);
};

DigitSet.prototype.add = function (digits) {
  if (digits.constructor === DigitSet.prototype.constructor) {
    digits = digits.toArray();
  }
  digits = removeInvalidArrayObjects(digits);
  this.possibles =  _.union(digits, this.possibles);
};

DigitSet.prototype.eliminate = function (digits) {
  if (digits.constructor === DigitSet.prototype.constructor) {
    digits = digits.toArray();
  }
  digits = removeInvalidArrayObjects(digits);
  this.possibles = _.difference(this.possibles, digits);
  return this;
};

DigitSet.prototype.toString = function (delim) {
  if (arguments.length === 0) delim = ","
  return this.possibles.join(delim);
};

DigitSet.prototype.toArray = function () {
  this.possibles.sort();
  return this.possibles.slice();
};

DigitSet.prototype.isUncertain = function () {
  if (this.possibles.length > 1){
    return true;
  }else{
    return false;
  }
};

DigitSet.prototype.contains = function (digit) {
  if (this.possibles.indexOf(digit) > -1){
    return true;
  }else{
    return false;
  }
};

DigitSet.prototype.inspect = function(depth, opts) {
  return 'DigitSet -> (' + this.toArray() + ')';
};

module.exports = DigitSet;

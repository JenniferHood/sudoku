var Grid = require('./grid.js');

function Viewer(grid) {
  this.grid = grid;
  this.album = [];
}

Viewer.prototype.drawSelf = function() {
  return this.createASCIIBoard(this.grid.toString());
};

Viewer.prototype.createASCIIBoard = function(str){
  var board = ""; // the string we will build up and eventually return
  var bar = "+---------+---------+---------+\n"; // a horizontal bar
  var numbers = str.split(''); // make a copy of the array -- we'll remove and print the first element each time we need to display a number
  // loop over over row and either draw a horizontal "bar" or iterate over fake data
  for (var i = 0; i < 13; i++) {
    if (i % 4 === 0) {
      board += bar;
    } else {
      var newline = "|"; // make a new row of text, starting off with a vertical bar
      // loop over the 12 remaining slots in the row and either draw a bar or the next number
      for (var j = 1; j < 13; j++) {
        if (j % 4 === 0) {
          newline += "|";
        } else {
          // grab the first element from the data array and pad it with a space on either side
          newline += " " + numbers.shift() + " ";
        }
      }
      board += (newline += "\n");
    }
  }
  return board;
};

Viewer.prototype.showHint = function(cellToken) {
  var board = this.grid.toString().split('');
  board.splice(cellToken, 1, '*' );
  var string = board.join('');
  var hint = this.createASCIIBoard(string);
  hint += '\n\n\n* Could be:' + this.grid.getAllDigitSets()[cellToken].toString();
  return hint;
};

Viewer.prototype.snapshot = function(){
  var pic =  this.createASCIIBoard(this.grid.toString());
  this.album.push(pic);
  return pic;
};

// TODO: When we have an interface.
// Viewer.prototype.playBack = function() {
//
//  setInterval(1000)
// };


module.exports = Viewer;

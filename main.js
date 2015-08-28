var Grid = require('./grid.js');
var Viewer = require('./viewer.js');

var testStr = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';

var game = new Grid(testStr);

var viewer = new Viewer(game);
console.log(viewer.drawSelf());
// console.log(viewer.showHint(3));
console.log(game.groupNeeds(['c', 3]));
console.log(game.groupNeeds(['b', 0]));
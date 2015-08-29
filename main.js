var Grid = require('./grid.js');
var Solver = require('./solver.js');
var Viewer = require('./viewer.js');

var testStr = '..2..7....1.....3...8..6..4..4....623...82..7...56.3.....4.5.........27.8.17.....';
// var testStr = '158.2..6.2...8..9..3..7.8.2.6.74......4.6.7......19.5.4.9.3..2..2..5...8.7..9.413';

var game = new Grid(testStr);

var solver = new Solver(game);
var viewer = new Viewer(game);
console.log(viewer.drawSelf());
console.log(game.remaining());
solver.trim()
solver.solve()
console.log(game.remaining());


// var viewer = new Viewer(game);
// console.log(viewer.drawSelf());
// console.log(viewer.showHint(3));
// console.log(game.groupNeeds(['c', 3]));
// console.log(game.groupNeeds(['b', 0]));
// console.log(game.getNeighborhood(0));
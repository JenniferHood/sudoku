/* Solver instance methods:

solver.trim()	// try trimming each cell's possibilities
solver.grab()	// try grabbing digits needed to complete each group
solver.guess()	// try guessing a cell and then examine the implications

solver.solve() // try everything until finished

*/

// Load other modules:
if (typeof DigitSet === 'undefined')
	var DigitSet = require('./digitset.js');
if (typeof Viewer === 'undefined')
	var Viewer = require('./viewer.js');
if (typeof _ === 'undefined')
	var _ = require('lodash');


var Solver = (function() {

	function Impossibility(str) {
		this.str = str;
	}

	var score = 0,
		total = 0,
		debug = {
			messages: true,
			// when to draw board:
			beforeGuess: false,
			afterUndo: false,
			afterEachTrim: false,
			afterEachGrab: false,
			afterTrimRound: false,
			afterGrabRound: false,
		};

	function Solver(game) {
		this.game = game;
		this.viewer = new Viewer(game);
		this.gameState = [];
	}

	Solver.prototype.report = function() {
		if (debug.messages) {
			var spaces = '                      ';
			var indent = spaces.slice(0,2*this.gameState.length);
			arguments[0] = indent+arguments[0];
			console.log.apply(console,arguments);
		}
	}
	Solver.prototype.undo = function() {
		var snapshot = this.restore();
		var cell = snapshot.cell;
		var guess = snapshot.guess;
		this.report('Impossible for cell %s to be %s',this.game.cellName(cell),guess);
		var newSet = this.game.getPossible(cell).eliminate(guess)
		this.examineTrim(cell,newSet);
		if (debug.afterUndo)
			this.show();
	}

	Solver.prototype.store = function(cell,guess) {
		this.gameState.push({
			cell:cell,
			guess:guess,
			data:this.game.save()
		});
	}
	Solver.prototype.restore = function() {
		var snapshot = this.gameState.pop();
		if (!snapshot) //uh-oh
			throw new Impossibility("Found impossibility but can't backtrack!"); //"Snapshot stack is empty!"
		//console.log(snapshot.data);
		this.game.restore(snapshot.data);
		return snapshot;
	}
	Solver.prototype.guess = function() {
		if (debug.beforeGuess)
				this.show();
		//if (this.gameState.length>15) throw ("Uh-oh, stack is getting deep");
		var game = this.game;

		var unsolved = game.cells().filter(function(cell) {
			return game.getPossible(cell).size()>1;
		});
		if (!unsolved.length) return;
		unsolved.sort(function(cellA,cellB){
			return game.getPossible(cellA).size() - game.getPossible(cellB).size();
		})
		var cell = unsolved[0];
		var digits = game.getPossible(cell).toString();
		var guess = digits[0];
		this.store(cell,guess);

		this.report('Suppose that cell %s is %s...',game.cellName(cell),guess);
		game.setPossible(cell,new DigitSet(guess));
		return guess;
	}

	// If the grid object has no neighborhood method, use this substitute:
	Solver.prototype.neighborhood = function(cell) {
		var grid = this.game;
		var groups = grid.groups(cell);
		var cells = groups.map(function(grp){return grid.cells(grp)});
		cells=_.flatten(cells);
		cells=_.uniq(cells);
		var digits = cells.map(function(cell){return grid.getPossible(cell)})
						.filter(function(digitset){return digitset.size()===1});
		return digits.reduce(function(set1,set2) {return set1.add(set2)}, new DigitSet(0));
	}

	Solver.prototype.examineTrim = function(cell,digitset) {
		var size = digitset.size();
		if (size===0)
			throw new Impossibility('Cell '+ this.game.cellName(cell) + " can't be anything!");
		if (size===1) {
			this.report('Cell %s must be %s',this.game.cellName(cell),digitset.toString());
			if (debug.afterEachTrim)
				this.show();
		}
	}

	Solver.prototype.trimCell = function(cell) {
		if (this.game.getPossible(cell).size() ===1)
			return;
		var union = (this.game.neighborhood)?
			this.game.neighborhood(cell):
			this.neighborhood(cell);
		var newSet = this.game.getPossible(cell).eliminate(union);
		this.game.setPossible(cell,newSet);
		this.examineTrim(cell,newSet);
	}


	Solver.prototype.grabGroup = function(group) {
		var solver = this;
		var game = this.game;
		var digitsMissing = game.groupNeeds(group).toArray();
		//console.log(digitsMissing);
		digitsMissing.forEach(function(digit,bit) {
			//console.log(digit,bit);
			var possibleCells = game.cells(group).filter(function(cell) {
				return game.getPossible(cell).contains(digit);
			})
			if (possibleCells.length===0) {
				throw new Impossibility(game.groupName(group) + ' cannot get a '+digit+'!');
			}
			if (possibleCells.length===1) {
				solver.report('%s can only get %s from cell %s',game.groupName(group),digit,game.cellName(possibleCells[0]));
				game.setPossible(possibleCells[0],new DigitSet(digit))
				if (debug.afterEachGrab)
					solver.show();
				//game.cellHas(possibleCells[0]);
			}
		})
	}

	Solver.prototype.grab = function() {
		var solver = this;
		solver.game.groups().forEach(function(grp) {
			solver.grabGroup(grp);
		})
		if (debug.afterGrabRound)
			solver.show();
	}

	Solver.prototype.trim = function() {
		var solver = this;
		solver.game.cells().forEach(function(cell) {
			solver.trimCell(cell);
		})
		if (debug.afterTrimRound)
			solver.show();
	}

	Solver.prototype.trimHard = function() {
		var unsolved;
		var lastProgress = Infinity;
		var prevProgress = Infinity;
		while ((unsolved=this.game.remaining()) && (unsolved < prevProgress)) {
			prevProgress = lastProgress;
			lastProgress = unsolved;
			try {
				this.trim();
				this.grab();
				//console.log(this.game.remaining());
			} catch (err) {
				if (err instanceof Impossibility) { //Found Sudoku impossibility; backtrack
					this.report(err.str);
					this.undo();
				} else throw err; // some other error
			}
		}
		return unsolved;		
	}

	Solver.prototype.solve = function() {
		var unsolved;
		while (unsolved = this.trimHard()) {
			// must've gotten stuck; time for a guess
			this.guess();
		}
		this.show();
		return unsolved;
	}

	Solver.prototype.show = function() {
		this.viewer.showCertain() // may want viewer.showPossible()
	}

	return Solver;
})()

if (typeof module !== 'undefined')
	module.exports = Solver;

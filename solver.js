/* Solver instance methods:

solver.trim()		// try trimming each cell's possibilities
solver.complete()	// try completing each group
solver.guess()		// try guessing a cell and then examine the implications

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
	var score = 0,
		total = 0,
		debug = true;

	function Solver(game) {
		this.game = game;
		this.viewer = new Viewer(game);
		this.gameState = [];
	}

	Solver.prototype.report = function() {
		if (debug) {
			var spaces = '              ';
			var indent = spaces.slice(0,this.gameState.length);
			arguments[0] = indent+arguments[0];
			//console.log(arguments);
			console.log.apply(console,arguments);
		}
	}
	Solver.prototype.undo = function() {
		var snap = this.restore();
		var cell = snap.cell;
		var guess = snap.guess;
		this.report('Impossible for %s to be %s',cell.name,guess);
		this.game.getPossible(cell).eliminate(guess);
		//this.game.eliminate(cell,Sudoku.possible(guess));
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
			throw "Snapshot stack is empty!"
		//console.log(snapshot.data);
		this.game.restore(snapshot.data);
		return snapshot;
	}
	Solver.prototype.guess = function() {
		if (this.gameState.length>15) throw ("Uh-oh, stack is too deep");
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
		this.report('Supposing that cell %s is %s...',cell.name,guess);
		this.store(cell,guess);
		game.setPossible(cell,new DigitSet(guess));
		return guess;
	}
	Solver.prototype.trim = function() {
		var solver = this;
		solver.game.cells().forEach(function(cell) {
			var digit = solver.trimCell(cell);
			if (digit)
				solver.report('Cell %s must be %s',cell.name,digit);
		})
		if (debug)
			solver.viewer.show();
	}

	// If the grid object has no neighborhood method, use this substitute:
	Solver.prototype.neighborhood = function(cell) {
		var grid = this.game;
		var groups = grid.groups(cell);
		var cells = groups.map(function(grp){return grid.cells(grp)});
		cells=_.flatten(cells);
		cells=_.uniq(cells);
		//return cells;
		var digits = cells.map(function(cell){return grid.getPossible(cell)})
						.filter(function(digitset){return digitset.size()===1});
		//return digits;
		return digits.reduce(function(set1,set2) {return set1.add(set2)}, new DigitSet(0));
	}

	Solver.prototype.trimCell = function(cell) {//-->1-9 if newly unique, else undef
	//!bug!  to fix: first build union of all neighbors, then eliminate from cell
		if (this.game.getPossibles(cell).size() ===1)
			return;
		var union = (this.game.neighborhood)?
			this.game.neighborhood(cell):
			this.neighborhood(cell);
		var newSet = this.game.getPossible(cell).eliminate(union);
		this.game.setPossible(cell,newSet);
		if (newSet.size()===1)
			return newSet.toString();
	}

	Solver.prototype.complete = function() {
		var solver = this;
		solver.game.groups().forEach(function(grp) {
			solver.completeGroup(grp);
		})
		//if (debug)
		//	solver.viewer.show();
	}

	Solver.prototype.completeGroup = function(group) {
		var game = this.game;
		var digitsMissing = game.groupNeeds(group).toArray();
		//console.log(digitsMissing);
		digitsMissing.forEach(function(digit,bit) {
			//console.log(digit,bit);
			var possibleCells = game.cells(group).filter(function(cell) {
				var digitset = game.getPossible(cell);
				return digitset.contains(digit);
			})
			if (possibleCells.length===0) {
				throw (group.name + ' cannot get a '+digit+'!');
			}
			if (possibleCells.length===1) {
				console.log(group.name+' can only get '+digit+' from cell '+possibleCells[0].name)
				game.setPossible(possibleCells[0],new DigitSet(digit))
				//game.cellHas(possibleCells[0]);
			}
		})
	}

	Solver.prototype.trimHard = function() {
		var unsolved;
		var lastProgress = Infinity;
		var prevProgress = Infinity;
		while (((unsolved=this.game.remaining()) < prevProgress) && unsolved) {
			prevProgress = lastProgress;
			lastProgress = unsolved;
			try {
				this.trim();
				this.complete();
				if (debug) {
					this.viewer.show();
					//console.log(this.game.remaining());
				}
			} catch (err) {
				this.report(err);
				//console.log(err);
				this.undo();
			}
		}
		return unsolved;		
	}

	Solver.prototype.solve = function() {
		var unsolved;
		while (unsolved = this.trimHard()) {
			// must've gotten stuck; time for a guess
			if (debug)
				this.viewer.show();
			this.guess();
		}
		if (!unsolved)
			score++;
		total++;
		return unsolved;
	}


	return Solver;
})()

if (typeof module !== 'undefined')
	module.exports = Solver;

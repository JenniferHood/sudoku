var Grid = require('../grid.js');
var DigitSet = require('../digitset.js');
var chai = require('chai');
var expect = chai.expect;
var grid;

describe('Testing Grid', function() {
  before(function() {
    grid = new Grid('123456789456789123789123456234567891567891234891234567345678912678912345912345678');
    describe('grid.cells()', function() {
      var cells = grid.cells();
      it('should return an array with 81 members', function(){
        expect(cells.length).to.equal(81);
      });
      it('should have 80 at index 80', function(){
        expect(cells[80]).to.equal(80);
      });
    });
    describe('grid.cells(["c", 0])', function() {
      it('its array should have 9 members', function(){
        expect(grid.cells(["c", 0]).length).to.equal(9);
      });
      it('should have 72 as its last member', function(){
        expect(grid.cells(["c", 0])[8]).to.equal(72);
      })
      it('should have 0 as its first member', function(){
        expect(grid.cells(["c", 0])[0]).to.equal(0);
      })
    });
    describe('grid.cells(["r", 5])', function() {
      it('its array should have 9 members', function(){
        expect(grid.cells(["r", 5]).length).to.equal(9);
      });
      it('should have 49 as its fifth member', function(){
        expect(grid.cells(["r", 5])[4]).to.equal(49);
      })
      it('should have 45 as its first member', function(){
        expect(grid.cells(["r", 5])[0]).to.equal(45);
      })
    });
    describe('grid.cells(["b", 0])', function() {
      it('its array should have 9 members', function(){
        expect(grid.cells(["b", 0]).length).to.equal(9);
      });
      it('should have 0 as its first member', function(){
        expect(grid.cells(["b", 0])[0]).to.equal(0);
      })
      it('should have 10 as its fifth member', function(){
        expect(grid.cells(["b", 0])[4]).to.equal(10);
      })
      it('should have 20 as its last member', function(){
        expect(grid.cells(["b", 0])[8]).to.equal(20);
      })
    });
    describe('grid.groups()', function(){
      it('should return an array with 27 members', function(){
        expect(grid.groups().length).to.equal(27);
      })
      it('should have ["c", 0] as its first member', function(){
        expect(grid.groups()[0]).to.deep.equal(["c", 0]);
      })
      it('should have ["b", 8] as its last member', function(){
        expect(grid.groups()[26]).to.deep.equal(["b", 8]);
      })
    })
    describe('grid.groups(40)', function(){
      it('should return an array with 3 members', function(){
        expect(grid.groups(40).length).to.equal(3);
      })
      it('should have ["c", 4] as its first member', function(){
        expect(grid.groups(40)[0]).to.deep.equal(["c", 4]);
      })
      it('should have ["r", 4] as its second member', function(){
        expect(grid.groups(40)[1]).to.deep.equal(["r", 4]);
      })
      it('should have ["b", 4] as its last member', function(){
        expect(grid.groups(40)[2]).to.deep.equal(["b", 4]);
      })
    })
    describe('grid.getRow()', function(){
      it('should return an array with 9 members', function(){
        expect(grid.getRow().length).to.equal(9);
      })
      it('should have ["r", 0] as its first member', function(){
        expect(grid.getRow()[0]).to.deep.equal(["r", 0]);
      })
      it('should have ["r", 8] as its last member', function(){
        expect(grid.getRow()[8]).to.deep.equal(["r", 8]);
      })
    })
    describe('grid.getRow(53)', function(){
      it('should return an array with 2 members', function(){
        expect(grid.getRow(53).length).to.equal(2);
      })
      it('should equal ["r", 0]', function(){
        expect(grid.getRow(53)).to.deep.equal(["r", 5]);
      })
    })
  });
  describe('grid.getRowNumber()', function() {

    it('getRowNumber(0) should return 0', function() {
      expect(grid.getRowNumber(0)).to.equal(0);
    });
    it('getRowNumber(37) should return row 4', function() {
      expect(grid.getRowNumber(37)).to.equal(4);
    });
    it('getRowNumber(99) should return NaN', function() {
      expect(Number.isNaN(grid.getRowNumber(99))).to.be.true;
    });
    it('getRowNumber("") should return NaN', function() {
      expect(Number.isNaN(grid.getRowNumber(''))).to.be.true;
    });
    
      describe('grid.getPossible()', function() {
        
          it('returns the cell token', function() {
            expect(grid.getPossible(40)).to.deep.equal(new DigitSet('9'));
          });
      });
  });        
  
      describe('grid.setPossible()', function() {
        
          it('sets the cell token to the DigitSet', function() {
            grid.setPossible(40, new DigitSet());
            expect(grid.getPossible(40)).to.deep.equal(new DigitSet());
          });
      });
  
  describe('grid.getColNumber()', function() {

    it('getColNumber(0) should return 0', function() {
      expect(grid.getColNumber(0)).to.equal(0);
    });
    it('getColNumber(37) should return row 4', function() {
      expect(grid.getColNumber(37)).to.equal(1);
  });
    it('getColNumber(99) should return NaN', function() {
      expect(Number.isNaN(grid.getColNumber(99))).to.be.true;
    });
    it('getColNumber("") should return NaN', function() {
      expect(Number.isNaN(grid.getColNumber(''))).to.be.true;
    });
  });
  
  describe('grid.getAllDigitSets()', function() {

    it('cells() should return an Array', function() {
      expect(grid.getAllDigitSets()).to.be.an.instanceof(Array);
    });
    it('That has 81 members', function() {
      expect(grid.getAllDigitSets().length).to.equal(81);
    });
    it('First digitset should contain 1', function() {
      expect(grid.getAllDigitSets()[0]).to.deep.equal(new DigitSet('1'));
    });
  });
});

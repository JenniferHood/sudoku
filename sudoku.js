// $(document).ready(function() {
//
// })


var tab = document.createElement('table');
for (var r=0, i=0; r < numRows; ++r){
  var tr = document.createElement('tr');
  tab.appendChild(tr);
  for(var c = 0; c < numCols; ++c, ++i){
    var td = document.createElement('td');
    td.setAttributes('id', 'n' + i);
    td.classList.add(((r+c)%2)? 'odd':'even');
    tr.appendChild(td);
    }
  }
    var something = container.appendChild(tab);
  }
}

var board;
function doStuff(){
  board = new Sudoku ('sudoku');
  board.render();
}

var dataway = require('./dataway');

function printSep(title) {
  var line = '';
  for (var i = 0; i < 10; i++) line += '-';

  console.log(line + ' [' + title + '] ' + line);
}

var dw = new dataway.Dataway({debug: true});

var points = [
  {
    measurement: 'M1',
    tags       : {'T1': 'X', 'T2': 'Y', 'T3': ''},
    fields     : {'F1': 'A', 'F2': dataway.asInt(42), 'F3': 4.2, 'F4': true, 'F5': false, 'F6': '', 'F7': null},
    timestamp  : '1577808000000000001',
  },
  {
    measurement: 'M1',
    tags       : {'T1': 'X'},
    fields     : {'F1': 'A'},
    timestamp  : 1577808001,
  },
  {
    measurement: 'M1',
    tags       : null,
    fields     : {'F1': 'A'},
    timestamp  : 1577808002,
  },
  {
    measurement: 'M1',
    fields     : {'F1': 'A'},
  },
];

// 1
printSep('Dataway.writePoint()')
dw.writePoint(points[0], function() {

  // 2
  printSep('Dataway.writePoints()')
  dw.writePoints(points);
});

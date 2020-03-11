var dataway = require('./dataway');

function printSep(title) {
  var line = '';
  for (var i = 0; i < 10; i++) line += '-';

  console.log(line + ' [' + title + '] ' + line);
}

var dw = new dataway.Dataway({
  debug   : true,
  protocol: 'https',
  host    : 'openway.dataflux.cn',
  port    : 443,
  token   : 'YOUR_DATAWAY_TOKEN'
});

var points = [
  {
    'measurement': 'M1',
    'tags'       : {'T1': 'X', 'T2': 'Y', 'T3': ''},
    'fields'     : {'F1': 'A', 'F2': dataway.asInt(42), 'F3': 4.2, 'F4': true, 'F5': false, 'F6': '', 'F7': null},
    'timestamp'  : '1577808000000000001',
  },
  {
    'measurement': 'M1',
    'tags'       : {'T1': 'X'},
    'fields'     : {'F1': 'A'},
    'timestamp'  : 1577808001,
  },
  {
    'measurement': 'M1',
    'tags'       : null,
    'fields'     : {'F1': 'A'},
    'timestamp'  : 1577808002,
  },
  {
    'measurement': 'M1',
    'fields'     : {'F1': 'A'},
  },
];

var keyevents = [
  {
    'title'    : 'T1',
    'des'      : 'D1',
    'link'     : 'http://link',
    'source'   : 'S1',
    'tags'     : {'T1': 'X'},
    'timestamp': 1577808000,
  },
  {
    'title'    : 'T1',
    'timestamp': 1577808001,
  },
];

var flows = [
  {
    'app'      : 'A1',
    'traceId'  : 'TRACE-001',
    'name'     : 'N1',
    'duration' : dataway.asInt(10),
    'parent'   : 'P1',
    'tags'     : {'T1': 'X'},
    'fields'   : {'F1': 'A'},
    'timestamp': 1577808000,
  },
  {
    'app'       : 'A1',
    'traceId'   : 'TRACE-001',
    'name'      : 'N1',
    'durationMs': dataway.asInt(10000),
    'timestamp' : 1577808001,
  },
];

// 1
printSep('Dataway.writePoint()')
dw.writePoint(points[0], function() {

  // 2
  printSep('Dataway.writePoints()')
  dw.writePoints(points, function() {

    // 3
    printSep('Dataway.writeKeyevent()')
    dw.writeKeyevent(keyevents[0], function() {

      // 4
      printSep('Dataway.writeKeyevents()')
      dw.writeKeyevents(keyevents, function() {

        // 5
        printSep('Dataway.writeFlow()')
        dw.writeFlow(flows[0], function() {

          // 6
          printSep('Dataway.writeFlows()')
          dw.writeFlows(flows);
        });
      });
    });
  });
});

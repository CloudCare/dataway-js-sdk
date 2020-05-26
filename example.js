var dataway = require('./dataway');

function printSep(title) {
  var line = '';
  for (var i = 0; i < 10; i++) line += '-';

  console.log(line + ' [' + title + '] ' + line);
}

var dw = new dataway.DataWay({
  debug   : true,
  protocol: 'https',
  host    : 'openway.dataflux.cn',
  port    : 443,
  token   : null,
  rp      : 'rp0',
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
  {
    'measurement': '中文指标名',
    'tags'       : {'中文标签': '中文标签值'},
    'fields'     : {'中文字段': '中文字段值'},
  },
  {
    'measurement': '中文指标名2',
    'tags'       : {'中文标签2': '中文标签值2'},
    'fields'     : {'中文字段2': '中文字段值2'},
  },
];

var keyevents = [
  {
    'title'    : 'T1',
    'timestamp': 1577808000,
  },
  {
    'title'        : 'T2',
    'eventId'      : 'event-001',
    'source'       : 'SRC1',
    'status'       : 'info',
    'ruleId'       : 'rule-001',
    'ruleName'     : 'R1',
    'type'         : 'TYPE-1',
    'alertItemTags': {'AT1': 'X', 'AT2': 'Y'},
    'actionType'   : 'A1',
    'content'      : 'C1',
    'suggestion'   : 'SUG-1',
    'duration'     : 10,
    'dimensions'   : ['D-1', '维度2', '维度3'],
    'tags'         : {'T1': 'X', 'T2': 'Y'},
    'fields'       : {'F1': 'A', 'F2': 'B'},
    'timestamp'    : 1577808001,
  },
];

var flows = [
  {
    'app'      : 'A1',
    'traceId'  : 'TRACE-001',
    'name'     : 'N1',
    'duration' : 10,
    'parent'   : 'P1',
    'tags'     : {'T1': 'X'},
    'fields'   : {'F1': 'A'},
    'timestamp': 1577808000,
  },
  {
    'app'       : 'A1',
    'traceId'   : 'TRACE-001',
    'name'      : 'N1',
    'durationMs': 10000,
    'timestamp' : 1577808001,
  },
];

// 1
printSep('DataWay write point')
dw.writePoint(points[0], function() {

  // 2
  printSep('DataWay write points')
  dw.writePoints(points, function() {

    // 3
    printSep('DataWay write keyevent')
    dw.writeKeyevent(keyevents[0], function() {

      // 4
      printSep('DataWay write keyevents')
      dw.writeKeyevents(keyevents, function() {

        // 5
        printSep('DataWay write flow')
        dw.writeFlow(flows[0], function() {

          // 6
          printSep('DataWay write flows')
          dw.writeFlows(flows);
        });
      });
    });
  });
});

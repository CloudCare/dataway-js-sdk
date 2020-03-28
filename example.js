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

var alerts = [
  {
    'level'        : 'critical',
    'alertId'      : 'ALERT-001',
    'ruleId'       : 'RULE-001',
    'ruleName'     : 'R1',
    'noData'       : true,
    'duration'     : 10,
    'checkValue'   : {'M1': 90, 'M2': 90},
    'actionType'   : 'mail',
    'actionContent': {'to': 'someone@somemail.com', 'title': 'Test Alert Title', 'content': 'Test Alert Value'},
    'alertItemTags': {'T1': 'X', 'T2': 'Y'},
    'tags'         : {'T1': 'X'},
    'timestamp'    : 1577808000,
  },
  {
    'level'        : 'ok',
    'alertId'      : 'ALERT-001',
    'ruleId'       : 'RULE-001',
    'ruleName'     : 'R1',
    'noData'       : false,
    'durationMs'   : 10000,
    'checkValue'   : {'M1': 10, 'M2': 10},
    'actionType'   : 'mail',
    'actionContent': {'to': 'someone@somemail.com', 'title': 'Test Alert Title', 'content': 'Test Alert Value'},
    'alertItemTags': {'T1': 'X', 'T2': 'Y'},
    'tags'         : {'T1': 'X'},
    'timestamp'    : 1577808001,
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
          dw.writeFlows(flows, function() {

            // 7
            printSep('DataWay write alert')
            dw.writeAlert(alerts[0], function() {

              // 8
              printSep('DataWay write alerts')
              dw.writeAlerts(alerts);
            });
          });
        });
      });
    });
  });
});

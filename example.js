var dataway = require('./dataway');

function printSep(title) {
  var line = '';
  for (var i = 0; i < 10; i++) line += '-';

  console.log('\n' + line + ' [' + title + '] ' + line);
}

var dw = new dataway.DataWay({
  protocol: 'https',
  host    : 'openway.dataflux.cn',
  port    : 443,
  token   : '<TOKEN>',
  rp      : '<RP>',
  debug   : true,
  dryRun  : false,
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

printSep('DataWay ping');
dw.get({path: '/ping'}, function() {

  printSep('DataWay post line protocol');
  dw.postLineProtocol(points, {withRP: true, precision: "ms"}, function() {
    // End
  });
});

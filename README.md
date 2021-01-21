# DataFlux DataWay JS SDK -nodep

Javascript 版 DataFlux DataWay SDK。

## 特性

1. 兼容不同单位的时间戳：
    - 秒
    - 毫秒（1/1000 秒）
    - 微秒（1/1000,000 秒）
    - 纳秒（1/1000,000,000 秒）

2. Low-Level API 支持，包括：
    - 发送GET请求
    - 发送行协议POST请求
    - 发送JSON POST请求

3. High-Level API 支持，包括：
    - 写入指标数据（`metric`/`point`）
    - 写入关键事件数据（`keyevent`）

4. DataWay 认证支持。

5. HTTP/HTTPS 支持。

6. 单文件即可使用。

7. 无第三方包依赖。

## TODO

1. 由于当前版本 DataWay 并未对来自浏览器的跨域请求作适当的处理，
所以在前端项目中使用SDK 时，可能需要后端服务器或Nginx 做代理。

2. 由于当前版本 DataWay 开启认证后，需要调用方在HTTP请求中设置`Date`头。
此要求于浏览器标准冲突，浏览器并不允许AJAX 请求附带`Date` 头，
所以在浏览器中使用SDK 时，暂时无法使用签名认证。

## 安装

无需通过 `npm`/`yarn`，只要拷贝文件`dataway.js`/`dataway.min.js`到项目中，引用即可使用。

见 [example.js](example.js) 或 [example.html](example.html)

## 简单示例

```javascript
var dataway = require('./dataway');

var dw = new dataway.DataWay({
  url: 'http://localhost:9528/v1/write/metric?token=xxxxxx',
});

// 写入指标数据
dw.writeMetric({
  measurement: 'M1',
  tags       : {'T1': 'X'},
  fields     : {'F1': 'A'},
  timestamp  : 1577808001,
});

// 批量写入指标数据
dw.writeMetrics([
    {
        measurement: 'M1',
        tags       : {'T1': 'X', 'T2': 'Y'},
        fields     : {'F1': 'A', 'F2': dataway.asInt(42), 'F3': 4.2, 'F4': true, 'F5': false},
        timestamp  : 1577808000,
    },
    {
        measurement: 'M1',
        tags       : {'T1': 'X'},
        fields     : {'F1': 'A'},
        timestamp  : 1577808001,
    }
]);
```

## API文档

###### *class* `DataWay(options)`

DataWay 类

|    `options`参数字段    |        类型       | 是否必须 |        默认值        |                                     说明                                     |
|-------------------------|-------------------|----------|----------------------|------------------------------------------------------------------------------|
| `url`                   | `String`          | 可选     | `null`               | DataWay 完整地址，如：`"http://localhost:9528/v1/write/metric?token=xxxxxx"` |
| `host`                  | `String`          | 可选     | `"localhost"`        | DataWay 主机地址                                                             |
| `port`                  | `Integer`         | 可选     | `9528`               | DataWay 主机端口                                                             |
| `protocol`              | `String`          | 可选     | `"http"`             | DataWay 访问协议。`"http"`/`"https"`                                         |
| `path`                  | `String`          | 可选     | `"/v1/write/metric"` | DataWay 数据上报路径                                                         |
| `token`                 | `String`          | 可选     | `null`               | DataFlux 工作空间上报Token。只有OpenWay和内部DataWay需要填写                 |
| `rp`                    | `String`          | 可选     | `null`               | 写入目标`retention policy`                                                   |
| `accessKey`/`secretKey` | `String`/`String` | 可选     | `null`/`null`        | DataWay 认证用 AccessKey 和 SecretKey                                        |
| `debug`                 | `Boolean`         | 可选     | `false`              | 是否打印详细调试信息                                                         |
| `dryRun`                | `Boolean`         | 可选     | `false`              | 是否仅以演习方式运行（不实际发送HTTP请求）                                   |

以下两种初始化方式等价：
- `DataWay({ url: "http://localhost:9528/v1/write/metric?token=xxxxxx" })`
- `DataWay({ host: "localhost", port: "9528", protocol: "http", path: "/v1/write/metric", token: 'xxxxxx' })`

`token`可以在`url`中作为参数出现，或者通过`token`传递。

`accessKey`/`secretKey` 只有在 DataWay 开启认证后才需要填写。DataWay 开启认证方式如下：

```shell
sudo vim /usr/local/cloudcare/forethought/dataway/dataway.yaml
```

修改以下内容

```yaml
routes_config:
    - name: default
      ak_open: false # true 为开启认证；false 为关闭认证
      lua:
```

最后，AccessKey 和 SecretKey 即为文件中的`accessKey`和`secretKey`。



### Low-Level API

#### *method* `DataWay.get(opt, callback)`

发送GET请求

|      参数     |    类型    | 是否必须 |   默认值    |              说明             |
|---------------|------------|----------|-------------|-------------------------------|
| `opt.path`    | `String`   | 必须     |             | 请求路径，如：`/ping`         |
| `opt.query`   | `JSON`     | 可选     | `undefined` | 请求Query参数                 |
| `opt.headers` | `JSON`     | 可选     | `undefined` | 请求Headers参数               |
| `callback`    | `Function` | 可选     | `undefined` | 回调函数 `function(err, ret)` |



---



#### *method* `DataWay.postLineProtocol(points, opt, callback)`

使用POST方式发送行协议数据

|            参数            |    类型    | 是否必须 |           默认值            |                               说明                              |
|----------------------------|------------|----------|-----------------------------|-----------------------------------------------------------------|
| `points`                   | `Array`    | 必须     |                             | 数据点列表                                                      |
| `points[#]`                | `JSON`     | 必须     |                             | 数据点                                                          |
| `points[#]["measurement"]` | `String`   | 必须     |                             | 指标集名称                                                      |
| `points[#]["tags"]`        | `JSON`     | 可选     | `undefined`                 | 标签。键名和键值必须都为字符串                                  |
| `points[#]["fields"]`      | `JSON`     | 必须     |                             | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `points[#]["timestamp"]`   | `Number`   | 可选     | 当前时间                    | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `opt`                      | `JSON`     | 可选     | `undefined`                 | 请求参数                                                        |
| `opt.path`                 | `String`   | 可选     | `DataWay`实例化时指定的路径 | 请求路径，如：`/v1/write/keyevent`                              |
| `opt.query`                | `JSON`     | 可选     | `undefined`                 | 请求Query参数                                                   |
| `opt.headers`              | `JSON`     | 可选     | `undefined`                 | 请求Headers参数                                                 |
| `opt.withRP`               | `Boolean`  | 可选     | `false`                     | 是否自动附带`rp`参数                                            |
| `callback`                 | `Function` | 可选     | `undefined`                 | 回调函数 `function(err, ret)`                                   |

*注意：由于SDK会自动将时间戳`timestamp`转换为纳秒，因此请勿在`query`中额外指定`precision`参数*



---



#### *method* `DataWay.postJSON(jsonObj, opt, callback)`

使用POST方式发送行协议数据

|      参数     |    类型    | 是否必须 |   默认值    |              说明             |
|---------------|------------|----------|-------------|-------------------------------|
| `jsonObj`     | `JSON`     | 必须     |             | JSON数据                      |
| `opt`         | `JSON`     | 必须     |             | 请求参数                      |
| `opt.path`    | `String`   | 必须     |             | 请求路径，如：`/v1/object`    |
| `opt.query`   | `JSON`     | 可选     | `undefined` | 请求Query参数                 |
| `opt.headers` | `JSON`     | 可选     | `undefined` | 请求Headers参数               |
| `opt.withRP`  | `Boolean`  | 可选     | `false`     | 是否自动附带`rp`参数          |
| `callback`    | `Function` | 可选     | `undefined` | 回调函数 `function(err, ret)` |




### High-Level API

###### *method* `DataWay.writeMetric(data, callback)`

写入数据点

|        参数        |    类型    | 是否必须 |   默认值    |                               说明                              |
|--------------------|------------|----------|-------------|-----------------------------------------------------------------|
| `data`             | `JSON`     | 必须     |             | 数据点                                                          |
| `data.measurement` | `String`   | 必须     |             | 指标集名称                                                      |
| `data.tags`        | `JSON`     | 可选     | `undefined` | 标签。键名和键值必须都为字符串                                  |
| `data.fields`      | `JSON`     | 可选     | `undefined` | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `data.timestamp`   | `Number`   | 可选     | 当前时间    | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `callback`         | `Function` | 可选     | `undefined` | 回调函数 `function(err, ret)`                                   |



---



###### *method* `DataWay.writeMetrics(data, callback)`

写入多个数据点

|          参数         |    类型    | 是否必须 |   默认值    |                               说明                              |
|-----------------------|------------|----------|-------------|-----------------------------------------------------------------|
| `data`                | `Array`    | 必须     |             | 数据点列表                                                      |
| `data[#]`             | `JSON`     | 必须     |             | 数据点                                                          |
| `data[#].measurement` | `String`   | 必须     |             | 指标集名称                                                      |
| `data[#].tags`        | `JSON`     | 可选     | `undefined` | 标签。键名和键值必须都为字符串                                  |
| `data[#].fields`      | `JSON`     | 可选     | `undefined` | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `data[#].timestamp`   | `Number`   | 可选     | 当前时间    | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `callback`            | `Function` | 可选     | `undefined` | 回调函数 `function(err, ret)`                                   |



---



#### *method* `DataWay.writePoint(data, callback)`

「写入指标数据」方法`DataWay.writeMetric(...)`的别名



---



#### *method* `DataWay.writePoint(points, callback)`

「批量写入指标数据」方法`DataWay.writeMetrics(...)`的别名

## 声明

我们从 [crypto-js](https://github.com/brix/crypto-js) 摘录了部分代码，主要用于实现 MD5 和 Hmac-Sha1。

## 许可协议

[Apache License Version 2.0](LICENSE)

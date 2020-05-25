# DataFlux DataWay JS SDK -nodep

Javascript 版 DataFlux DataWay SDK。

[English Version](README-en.md)

## 特性

1. 兼容 Node.js 和 浏览器，在以下环境中通过测试：
    - Node `v0.10.48` / `v0.12.18` / `v4.9.1` /`v6.11.5` / `v8.16.0` / `v10.15.3` / `v12.12.0`
    - Chrome `79.0.3945.117 (Mac x64)`
    - Safari `13.0.4 (Mac)`
    - Firefox `72.0.2 (Mac x64)`

2. 兼容不同单位的时间戳：
    - 秒
    - 毫秒（1/1000 秒）
    - 微秒（1/1000,000 秒）
    - 纳秒（1/1000,000,000 秒）

3. 关键事件（`Keyevent`）/ 流程行为（`FLow`）/ 告警（`Alert`）支持。

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
  url: 'http://localhost:9528/v1/write/metrics?token=xxxxxx',
});

// Write a point
dw.writePoint({
  measurement: 'M1',
  tags       : {'T1': 'X'},
  fields     : {'F1': 'A'},
  timestamp  : 1577808001,
});

// Write many points
dw.writePoints([
    {
        measurement: 'M1',
        tags       : {'T1': 'X', 'T2': 'Y'},
        fields     : {'F1': 'A', 'F2': 42, 'F3': 4.2, 'F4': True, 'F5': False},
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

|    `options`参数字段    |        类型       | 是否必须 |        默认值         |                                      说明                                     |
|-------------------------|-------------------|----------|-----------------------|-------------------------------------------------------------------------------|
| `url`                   | `String`          | 可选     | `null`                | DataWay 完整地址，如：`"http://localhost:9528/v1/write/metrics?token=xxxxxx"` |
| `host`                  | `String`          | 可选     | `"localhost"`         | DataWay 主机地址                                                              |
| `port`                  | `Integer`         | 可选     | `9528`                | DataWay 主机端口                                                              |
| `protocol`              | `String`          | 可选     | `"http"`              | DataWay 访问协议。`"http"`/`"https"`                                          |
| `path`                  | `String`          | 可选     | `"/v1/write/metrics"` | DataWay 数据上报路径                                                          |
| `token`                 | `String`          | 可选     | `null`                | DataFlux 工作空间上报Token。只有OpenWay和内部DataWay需要填写                  |
| `rp`                    | `String`          | 可选     | `null`                | 写入目标`retention policy`                                                    |
| `accessKey`/`secretKey` | `String`/`String` | 可选     | `null`/`null`         | DataWay 认证用 AccessKey 和 SecretKey                                         |
| `debug`                 | `Boolean`         | 可选     | `False`               | 是否打印详细调试信息                                                          |

以下两种初始化方式等价：
- `DataWay({ url: "http://localhost:9528/v1/write/metrics?token=xxxxxx" })`
- `DataWay({ host: "localhost", port: "9528", protocol: "http", path: "/v1/write/metrics", token: 'xxxxxx' })`

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



---



###### *method* `DataWay.writePoint(data, callback)`

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



###### *method* `DataWay.writePoints(points, callback)`

写入多个数据点

|           参数          |    类型    | 是否必须 |   默认值    |                               说明                              |
|-------------------------|------------|----------|-------------|-----------------------------------------------------------------|
| `points`                | `Array`    | 必须     |             | 数据点列表                                                      |
| `points[#]`             | `JSON`     | 必须     |             | 数据点                                                          |
| `points[#].measurement` | `String`   | 必须     |             | 指标集名称                                                      |
| `points[#].tags`        | `JSON`     | 可选     | `undefined` | 标签。键名和键值必须都为字符串                                  |
| `points[#].fields`      | `JSON`     | 可选     | `undefined` | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `points[#].timestamp`   | `Number`   | 可选     | 当前时间    | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `callback`              | `Function` | 可选     | `undefined` | 回调函数 `function(err, ret)`                                   |



---



###### *method* `DataWay.writeKeyevent(data, callback)`

写入关键事件

|          参数          |    类型    |  是否必须  |   默认值    |                               说明                              |
|------------------------|------------|------------|-------------|-----------------------------------------------------------------|
| `data.title`           | `String`   | 必须       |             | 标题                                                            |
| `data.timestamp`       | `Number`   | 必须       |             | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `data.duration`        | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（秒）                              |
| `data.duration_ms`     | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（毫秒）                            |
| `data.event_id`        | `String`   | 可选       | `undefined` | 事件ID                                                          |
| `data.source`          | `String`   | 可选       | `undefined` | 来源                                                            |
| `data.status`          | `String`   | 可选       | `undefined` | "critical" / "error" / "warning" / "info" / "ok" 之一           |
| `data.rule_id`         | `String`   | 可选       | `undefined` | 规则ID                                                          |
| `data.rule_name`       | `String`   | 可选       | `undefined` | 规则名称                                                        |
| `data.type_`           | `String`   | 可选       | `undefined` | 类型                                                            |
| `data.alert_item_tags` | `String`   | 可选       | `undefined` | 告警对象标签。键名和键值必须都为字符串                          |
| `data.action_type`     | `String`   | 可选       | `undefined` | 动作类型                                                        |
| `data.content`         | `String`   | 可选       | `undefined` | 内容                                                            |
| `data.tags`            | `JSON`     | 可选       | `undefined` | 标签。键名和键值必须都为字符串                                  |
| `data.fields`          | `JSON`     | 可选       | `undefined` | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `callback`             | `Function` | 可选       | `undefined` | 回调函数 `function(err, ret)`                                   |



---



###### *method* `DataWay.writeKeyevents(keyevents, callback)`

写入多个关键事件

|              参数             |    类型    |  是否必须  |   默认值    |                               说明                              |
|-------------------------------|------------|------------|-------------|-----------------------------------------------------------------|
| `keyevents`                   | `Array`    | 必须       |             | 关键事件列表                                                    |
| `keyevents[#]`                | `JSON`     | 必须       |             | 关键事件                                                        |
| `keyevents[#]title`           | `String`   | 必须       |             | 标题                                                            |
| `keyevents[#]timestamp`       | `Number`   | 必须       |             | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |
| `keyevents[#]duration`        | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（秒）                              |
| `keyevents[#]duration_ms`     | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（毫秒）                            |
| `keyevents[#]event_id`        | `String`   | 可选       | `undefined` | 事件ID                                                          |
| `keyevents[#]source`          | `String`   | 可选       | `undefined` | 来源                                                            |
| `keyevents[#]status`          | `String`   | 可选       | `undefined` | "critical" / "error" / "warning" / "info" / "ok" 之一           |
| `keyevents[#]rule_id`         | `String`   | 可选       | `undefined` | 规则ID                                                          |
| `keyevents[#]rule_name`       | `String`   | 可选       | `undefined` | 规则名称                                                        |
| `keyevents[#]type_`           | `String`   | 可选       | `undefined` | 类型                                                            |
| `keyevents[#]alert_item_tags` | `String`   | 可选       | `undefined` | 告警对象标签。键名和键值必须都为字符串                          |
| `keyevents[#]action_type`     | `String`   | 可选       | `undefined` | 动作类型                                                        |
| `keyevents[#]content`         | `String`   | 可选       | `undefined` | 内容                                                            |
| `keyevents[#]tags`            | `JSON`     | 可选       | `undefined` | 标签。键名和键值必须都为字符串                                  |
| `keyevents[#]fields`          | `JSON`     | 可选       | `undefined` | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `callback`                    | `Function` | 可选       | `undefined` | 回调函数 `function(err, ret)`                                   |



---



###### *method* `DataWay.writeFlow(data, callback)`

写入流程行为

|        参数       |    类型    |  是否必须  |   默认值    |                                 说明                                |
|-------------------|------------|------------|-------------|---------------------------------------------------------------------|
| `data`            | `JSON`     | 必须       |             | 流程行为                                                            |
| `data.app`        | `String`   | 必须       |             | 应用名                                                              |
| `data.traceId`    | `String`   | 必须       |             | 标示一个流程单的唯一ID                                              |
| `data.name`       | `String`   | 必须       |             | 节点名称                                                            |
| `data.timestamp`  | `Number`   | 必须       |             | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒            |
| `data.duration`   | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（秒）                                  |
| `data.durationMs` | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（毫秒）                                |
| `data.parent`     | `String`   | 可选       | `undefined` | 上一个节点的名称。第一个节点不用上报                                |
| `data.tags`       | `JSON`     | 可选       | `undefined` | 额外标签。键名和键值必须都为字符串                                  |
| `data.fields`     | `JSON`     | 可选       | `undefined` | 额外指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `callback`        | `Function` | 可选       | `undefined` | 回调函数 `function(err, ret)`                                       |

`data.duration`和`data.durationMs`两者必须填一个



---



###### *method* `DataWay.writeFlows(flows, callback)`

写入多个流程行为

|          参数         |    类型    |  是否必须  |   默认值    |                                 说明                                |
|-----------------------|------------|------------|-------------|---------------------------------------------------------------------|
| `flows`               | `Array`    | 必须       |             | 流程行为列表                                                        |
| `flows[#]`            | `JSON`     | 必须       |             | 流程行为                                                            |
| `flows[#].app`        | `String`   | 必须       |             | 应用名                                                              |
| `flows[#].traceId`    | `String`   | 必须       |             | 标示一个流程单的唯一ID                                              |
| `flows[#].name`       | `String`   | 必须       |             | 节点名称                                                            |
| `flows[#].timestamp`  | `Number`   | 必须       |             | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒            |
| `flows[#].duration`   | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（秒）                                  |
| `flows[#].durationMs` | `Integer`  | 必须二选一 |             | 在当前节点滞留时间或持续时间（毫秒）                                |
| `flows[#].parent`     | `String`   | 可选       | `undefined` | 上一个节点的名称。第一个节点不用上报                                |
| `flows[#].tags`       | `JSON`     | 可选       | `undefined` | 额外标签。键名和键值必须都为字符串                                  |
| `flows[#].fields`     | `JSON`     | 可选       | `undefined` | 额外指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `callback`            | `Function` | 可选       | `undefined` | 回调函数 `function(err, ret)`                                       |

## 声明

我们从 [crypto-js](https://github.com/brix/crypto-js) 摘录了部分代码，主要用于实现 MD5 和 Hmac-Sha1。

## 许可协议

[Apache License Version 2.0](LICENSE)

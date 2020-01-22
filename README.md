# DataFlux Dataway JS SDK -nodep

Javascript 版 DataFlux Dataway SDK。

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

3. 关键事件（`Keyevent`）/流程行为（`FLow`）支持。

4. Dataway 认证支持。

5. HTTP/HTTPS 支持。

6. 单文件即可使用。

7. 无第三方包依赖。

## TODO

1. 由于当前版本 Dataway 并未对来自浏览器的跨域请求作适当的处理，
所以在前端项目中使用SDK 时，可能需要后端服务器或Nginx 做代理。

2. 由于当前版本 Dataway 开启认证后，需要调用方在HTTP请求中设置`Date`头。
此要求于浏览器标准冲突，浏览器并不允许AJAX 请求附带`Date` 头，
所以在浏览器中使用SDK 时，暂时无法使用签名认证。

## 安装

无需通过 `npm`/`yarn`，只要拷贝文件`dataway.js`/`dataway.min.js`到项目中，引用即可使用。

见 [example.js](example.js) 或 [example.html](example.html)

## 简单示例

```javascript
var dataway = require('./dataway');

var dw = new dataway.Dataway({debug: true});

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

###### *class* `Dataway(options)`

Dataway 类

|    `options`参数字段    |        类型       | 是否必须 |          默认值          |                               说明                               |
|-------------------------|-------------------|----------|--------------------------|------------------------------------------------------------------|
| `url`                   | `String`          | 可选     | `null`                   | Dataway 完整地址，如：`"http://localhost:9528/v1/write/metrics"` |
| `host`                  | `String`          | 可选     | `"localhost"`            | Dataway 主机地址                                                 |
| `port`                  | `Integer`         | 可选     | `9528`                   | Dataway 主机端口                                                 |
| `protocol`              | `String`          | 可选     | `"http"`                 | Dataway 访问协议。`"http"`/`"https"`                             |
| `path`                  | `String`          | 可选     | `"/v1/write/metrics"`    | Dataway 数据上报路径                                             |
| `datakitUUID`           | `String`          | 可选     | `"dataway-js-sdk-nodep"` | 数据上报采集器名称                                               |
| `accessKey`/`secretKey` | `String`/`String` | 可选     | `null`/`null`            | Dataway 认证用 AccessKey 和 SecretKey                            |
| `debug`                 | `Boolean`         | 可选     | `False`                  | 是否打印详细调试信息                                             |

以下两种初始化方式等价：
- `Dataway({ url: "http://localhost:9528/v1/write/metrics" })`
- `Dataway({ host: "localhost", port: "9528", protocol: "http", path: "/v1/write/metrics" })`

`datakitUUID`参数尽可能填写上报数据的业务系统名称，方便在 DataFlux 中查询

`accessKey`/`secretKey` 只有在 Dataway 开启认证后才需要填写。Dataway 开启认证方式如下：

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



###### *method* `Dataway.writePoint(data)`

写入数据点

|        参数        |   类型   | 是否必须 |  默认值  |                               说明                              |
|--------------------|----------|----------|----------|-----------------------------------------------------------------|
| `data`             | `JSON`   | 必须     |          | 数据点                                                          |
| `data.measurement` | `String` | 必须     |          | 指标集名称                                                      |
| `data.tags`        | `JSON`   | 可选     | `null`   | 标签。键名和键值必须都为字符串                                  |
| `data.fields`      | `JSON`   | 可选     | `null`   | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `data.timestamp`   | `Number` | 可选     | 当前时间 | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |



---



###### *method* `Dataway.writePoints(data)`

写入多个数据点

|          参数         |   类型   | 是否必须 |  默认值  |                               说明                              |
|-----------------------|----------|----------|----------|-----------------------------------------------------------------|
| `data`                | `Array`  | 必须     |          | 数据点列表                                                      |
| `data[#]`             | `JSON`   | 必须     |          | 数据点                                                          |
| `data[#].measurement` | `String` | 必须     |          | 指标集名称                                                      |
| `data[#].tags`        | `JSON`   | 可选     | `null`   | 标签。键名和键值必须都为字符串                                  |
| `data[#].fields`      | `JSON`   | 可选     | `null`   | 指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |
| `data[#].timestamp`   | `Number` | 可选     | 当前时间 | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒        |



---



###### *method* `Dataway.writeKeyevent(data)`

写入关键事件

|       参数       |   类型   | 是否必须 | 默认值 |                             说明                             |
|------------------|----------|----------|--------|--------------------------------------------------------------|
| `data`           | `JSON`   | 必须     |        | 关键事件                                                     |
| `data.title`     | `String` | 必须     |        | 标题                                                         |
| `data.timestamp` | `Number` | 必须     |        | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒     |
| `data.des`       | `String` | 可选     |        | 描述                                                         |
| `data.link`      | `String` | 可选     |        | 关联的完整外部链接地址，如：`"http://some-domain/some-path"` |
| `data.source`    | `String` | 可选     |        | 来源                                                         |
| `data.tags`      | `JSON`   | 可选     | `null` | 额外的标签。键名和键值必须都为字符串                         |



---



###### *method* `Dataway.writeKeyevents(keyevents)`

写入多个关键事件

|           参数           |   类型   | 是否必须 | 默认值 |                             说明                             |
|--------------------------|----------|----------|--------|--------------------------------------------------------------|
| `keyevents`              | `Array`  | 必须     |        | 关键事件列表                                                 |
| `keyevents[#]`           | `JSON`   | 必须     |        | 关键事件                                                     |
| `keyevents[#].title`     | `String` | 必须     |        | 标题                                                         |
| `keyevents[#].timestamp` | `Number` | 必须     |        | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒     |
| `keyevents[#].des`       | `String` | 可选     |        | 描述                                                         |
| `keyevents[#].link`      | `String` | 可选     |        | 关联的完整外部链接地址，如：`"http://some-domain/some-path"` |
| `keyevents[#].source`    | `String` | 可选     |        | 来源                                                         |
| `keyevents[#].tags`      | `JSON`   | 可选     | `null` | 额外的标签。键名和键值必须都为字符串                         |



---



###### *method* `Dataway.writeFlow(trace_id, name, type_, timestamp, duration=None, duration_ms=None, parent=None, fields=None, tags=None)`

写入流程行为

|        参数       |    类型   |  是否必须  | 默认值 |                                 说明                                |
|-------------------|-----------|------------|--------|---------------------------------------------------------------------|
| `data`            | `JSON`    | 必须       |        | 流程行为                                                            |
| `data.traceId`    | `String`  | 必须       |        | 标示一个流程单的唯一ID                                              |
| `data.name`       | `String`  | 必须       |        | 节点名称                                                            |
| `data.type`       | `String`  | 必须       |        | 类型                                                                |
| `data.timestamp`  | `Number`  | 必须       |        | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒            |
| `data.duration`   | `Integer` | 必须二选一 |        | 在当前节点滞留时间或持续时间（秒）                                  |
| `data.durationMs` | `Integer` | 必须二选一 |        | 在当前节点滞留时间或持续时间（毫秒）                                |
| `data.parent`     | `String`  | 可选       | `null` | 上一个节点的名称。第一个节点不用上报                                |
| `data.tags`       | `JSON`    | 可选       | `null` | 额外标签。键名和键值必须都为字符串                                  |
| `data.fields`     | `JSON`    | 可选       | `null` | 额外指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |

`data.duration`和`data.durationMs`两者必须填一个



---



###### *method* `Dataway.writeFlows(flows)`

写入多个流程行为

|          参数         |     类型     |  是否必须  | 默认值 |                                 说明                                |
|-----------------------|--------------|------------|--------|---------------------------------------------------------------------|
| `flows`               | `Array`      | 必须       |        | 流程行为列表                                                        |
| `flows[#]`            | `JSON`       | 必须       |        | 流程行为                                                            |
| `flows[#].traceId`    | `String`     | 必须       |        | 标示一个流程单的唯一ID                                              |
| `flows[#].name`       | `String`     | 必须       |        | 节点名称                                                            |
| `flows[#].type`       | `String`     | 必须       |        | 类型                                                                |
| `flows[#].timestamp`  | `Number`     | 必须       |        | 时间戳，支持秒/毫秒/微秒/纳秒。SDK会判断并自动转换为纳秒            |
| `flows[#].duration`   | `int`/`long` | 必须二选一 |        | 在当前节点滞留时间或持续时间（秒）                                  |
| `flows[#].durationMs` | `int`/`long` | 必须二选一 |        | 在当前节点滞留时间或持续时间（毫秒）                                |
| `flows[#].parent`     | `String`     | 可选       | `null` | 上一个节点的名称。第一个节点不用上报                                |
| `flows[#].tags`       | `JSON`       | 可选       | `null` | 额外标签。键名和键值必须都为字符串                                  |
| `flows[#].fields`     | `JSON`       | 可选       | `null` | 额外指标。键名必须为字符串，键值可以为字符串/整数/浮点数/布尔值之一 |

## 声明

我们从 [crypto-js](https://github.com/brix/crypto-js) 摘录了部分代码，主要用于实现 MD5 和 Hmac-Sha1。

## 许可协议

[Apache License Version 2.0](LICENSE)

# DataFlux DataWay JS SDK -nodep

A DataFlux DataWay SDK for Javascript.

[中文版](README.md)

## Feature

1. Compatible with Node.js and Browser. Tested in following environments:
    - Node `v0.10.48` / `v0.12.18` / `v4.9.1` /`v6.11.5` / `v8.16.0` / `v10.15.3` / `v12.12.0`
    - Chrome `79.0.3945.117 (Mac x64)`
    - Safari `13.0.4 (Mac)`
    - Firefox `72.0.2 (Mac x64)`

2. Compatible with different timestamp:
    - second
    - millisecond (1/1000 second)
    - microsecond (1/1000,000 second)
    - nanosecond (1/1000,000,000 second)

3. `Keyevent` / `FLow` / `Alert` Support.

4. DataWay Authorization support.

5. HTTP/HTTPS support.

6. All-in-one file.

7. No third-party package dependency.

## TODO

1. Because of the current version of DataWay does not handle the Cross-Site AJAX request from browser properly,
a proxy like backend server or Nginx may be needed when using SDK in frontend projects.

2. Because of the requirement of `Date` header by the current version of DataWay in ak-open mode,
signature is not avaliable in frontend projects. (`Date` header is not allowed in AJAX request according to the standard).

## Installation

No need to `npm`/`yarn`, just copy the only file `dataway.js`/`dataway.min.js` to your project and `require` it or include the file in HTML.

See [example.js](example.js) or [example.html](example.html)

## Quick Example

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

## API Document

###### *class* `DataWay(options)`

DataWay class

|   Fields of `options`   |        Type       | Required |     Default Value     |                                      Description                                      |
|-------------------------|-------------------|----------|-----------------------|---------------------------------------------------------------------------------------|
| `url`                   | `String`          | Optional | `null`                | DataWay full access URL, e.g. `"http://localhost:9528/v1/write/metrics?token=xxxxxx"` |
| `host`                  | `String`          | Optional | `"localhost"`         | DataWay host                                                                          |
| `port`                  | `Integer`         | Optional | `9528`                | DataWay port                                                                          |
| `protocol`              | `String`          | Optional | `"http"`              | DataWay protocol. `"http"`/`"https"`                                                  |
| `path`                  | `String`          | Optional | `"/v1/write/metrics"` | DataWay report path                                                                   |
| `token`                 | `String`          | Optional | `null`                | DataFlux Workspace Token. Only for OpenWay and Internal DataWay                       |
| `rp`                    | `String`          | Optional | `null`                | Target `retention policy`                                                             |
| `accessKey`/`secretKey` | `String`/`String` | Optional | `null`/`null`         | DataWay AccessKey and SecretKey for authorization                                     |
| `debug`                 | `Boolean`         | Optional | `false`               | Print detailed debug info or not                                                      |

The following instantiation are equivalent:
- `DataWay({ url: "http://localhost:9528/v1/write/metrics?token=xxxxxx" })`
- `DataWay({ host: "localhost", port: "9528", protocol: "http", path: "/v1/write/metrics", token: 'xxxxxx' })`

`token` can be place in `url` or be passed as `token` parameter.

`accessKey`/`secretKey` is required when the authorization of DataWay opened. To open the authorization of DataWay:

```shell
sudo vim /usr/local/cloudcare/forethought/dataway/dataway.yaml
```

Change the content

```yaml
routes_config:
    - name: default
      ak_open: false # set true to open, false to close
      lua:
```

Finally, the AccessKey and SecretKey are the `accessKey` and `secretKey` in the YAML file.



---



###### *method* `DataWay.writePoint(data, callback)`

Write one point

|     Parameter      |    Type    | Required |   Default Value   |                                                 Description                                                  |
|--------------------|------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------|
| `data`             | `JSON`     | Required |                   | data point                                                                                                   |
| `data.measurement` | `String`   | Required |                   | measurement                                                                                                  |
| `data.tags`        | `JSON`     | Optional | `undefined`       | tags. Both key and value should be a string                                                                  |
| `data.fields`      | `JSON`     | Optional | `undefined`       | fields. Key should be a string, value should be a string/integer/float/boolean value                         |
| `data.timestamp`   | `Number`   | Optional | Current Timestamp | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `callback`         | `Function` | Optional | `undefined`       | Callback function `function(err, ret)`                                                                       |



---



###### *method* `DataWay.writePoints(points, callback)`

Write many points

|        Parameter        |    Type    | Required |   Default Value   |                                                 Description                                                  |
|-------------------------|------------|----------|-------------------|--------------------------------------------------------------------------------------------------------------|
| `points`                | `Array`    | Required |                   | data point list                                                                                              |
| `points[#]`             | `JSON`     | Required |                   | data point data                                                                                              |
| `points[#].measurement` | `String`   | Required |                   | measurement                                                                                                  |
| `points[#].tags`        | `JSON`     | Optional | `undefined`       | tags. Both key and value should be a string                                                                  |
| `points[#].fields`      | `JSON`     | Optional | `undefined`       | fields. Key should be a string, value should be a string/integer/float/boolean value                         |
| `points[#].timestamp`   | `Number`   | Optional | Current Timestamp | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `callback`              | `Function` | Optional | `undefined`       | Callback function `function(err, ret)`                                                                       |



---



###### *method* `DataWay.writeKeyevent(data, callback)`

Write a key event

|    Parameter     |    Type    | Required | Default Value |                                                    Description                                                     |
|------------------|------------|----------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `data`           | `JSON`     | Required |               | keyevent data                                                                                                      |
| `data.title`     | `String`   | Required |               | title                                                                                                              |
| `data.timestamp` | `Number`   | Required |               | event timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data.des`       | `String`   | Optional | `undefined`   | description                                                                                                        |
| `data.link`      | `String`   | Optional | `undefined`   | related external link, e.g. `"http://some-domain/some-path"`                                                       |
| `data.source`    | `String`   | Optional | `undefined`   | source                                                                                                             |
| `data.tags`      | `JSON`     | Optional | `undefined`   | extra tags. Both key and value should be a string                                                                  |
| `callback`       | `Function` | Optional | `undefined`   | Callback function `function(err, ret)`                                                                             |



---



###### *method* `DataWay.writeKeyevents(keyevents, callback)`

Write many key events

|        Parameter         |    Type    | Required | Default Value |                                                    Description                                                     |
|--------------------------|------------|----------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `keyevents`              | `Array`    | Required |               | key event list                                                                                                     |
| `keyevents[#]`           | `JSON`     | Required |               | key event data                                                                                                     |
| `keyevents[#].title`     | `String`   | Required |               | title                                                                                                              |
| `keyevents[#].timestamp` | `Number`   | Required |               | event timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `keyevents[#].des`       | `String`   | Optional | `undefined`   | description                                                                                                        |
| `keyevents[#].link`      | `String`   | Optional | `undefined`   | related external link, e.g. `"http://some-domain/some-path"`                                                       |
| `keyevents[#].source`    | `String`   | Optional | `undefined`   | source                                                                                                             |
| `keyevents[#].tags`      | `JSON`     | Optional | `undefined`   | extra tags. Both key and value should be a string                                                                  |
| `callback`               | `Function` | Optional | `undefined`   | Callback function `function(err, ret)`                                                                             |



---



###### *method* `DataWay.writeFlow(data, callback)`

Write a flow

|     Parameter     |    Type    |   Required  | Default Value |                                                 Description                                                  |
|-------------------|------------|-------------|---------------|--------------------------------------------------------------------------------------------------------------|
| `data`            | `JSON`     | Required    |               | flow data                                                                                                    |
| `data.app`        | `String`   | Required    |               | app name                                                                                                     |
| `data.traceId`    | `String`   | Required    |               | flow trace ID                                                                                                |
| `data.name`       | `String`   | Required    |               | node name                                                                                                    |
| `data.timestamp`  | `Number`   | Required    |               | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data.duration`   | `Integer`  | Alternative |               | duration of the flow on the node (second)                                                                    |
| `data.durationMs` | `Integer`  | Alternative |               | duration of the flow on the node (millisecond)                                                               |
| `data.parent`     | `String`   | Optional    | `undefined`   | previous node name. The first node do not have one                                                           |
| `data.tags`       | `JSON`     | Optional    | `undefined`   | extra tags. Both key and value should be a string                                                            |
| `data.fields`     | `JSON`     | Optional    | `undefined`   | extra fields. Key should be a string, value should be a string/integer/float/boolean value                   |
| `callback`        | `Function` | Optional    | `undefined`   | Callback function `function(err, ret)`                                                                       |

Either `data.duration` or `data.durationMs` should be spcified.



---



###### *method* `DataWay.writeFlows(flows, callback)`

Write many flows

|       Parameter       |    Type    |   Required  | Default Value |                                                 Description                                                  |
|-----------------------|------------|-------------|---------------|--------------------------------------------------------------------------------------------------------------|
| `flows`               | `Array`    | Required    |               | flow list                                                                                                    |
| `flows[#]`            | `JSON`     | Required    |               | flow data                                                                                                    |
| `flows[#].app`        | `String`   | Required    |               | app name                                                                                                     |
| `flows[#].traceId`    | `String`   | Required    |               | flow trace ID                                                                                                |
| `flows[#].name`       | `String`   | Required    |               | node name                                                                                                    |
| `flows[#].timestamp`  | `Number`   | Required    |               | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `flows[#].duration`   | `Integer`  | Alternative |               | duration of the flow on the node (second)                                                                    |
| `flows[#].durationMs` | `Integer`  | Alternative |               | duration of the flow on the node (millisecond)                                                               |
| `flows[#].parent`     | `String`   | Optional    | `undefined`   | previous node name. The first node do not have one                                                           |
| `flows[#].tags`       | `JSON`     | Optional    | `undefined`   | extra tags. Both key and value should be a string                                                            |
| `flows[#].fields`     | `JSON`     | Optional    | `undefined`   | extra fields. Key should be a string, value should be a string/integer/float/boolean value                   |
| `callback`            | `Function` | Optional    | `undefined`   | Callback function `function(err, ret)`                                                                       |



---



###### *method* `DataWay.writeAlert(data, callback)`

Write an alert

|         参数         |           类型           |   是否必须  |   默认值    |                                                     说明                                                     |
|----------------------|--------------------------|-------------|-------------|--------------------------------------------------------------------------------------------------------------|
| `data.level`         | `String`                 | Required    |             | one of `"critical"` / `"warning"` / `"info"` / `"ok"`                                                        |
| `data.alertId`       | `String`                 | Required    |             | alert ID                                                                                                     |
| `data.checkValue`    | `JSON` / `String` (JSON) | Required    |             | check Value in JSON or JSON string                                                                           |
| `data.timestamp`     | `Number`                 | Required    |             | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data.duration`      | `Integer`                | Alternative |             | duration of the flow on the node (second)                                                                    |
| `data.durationMs`    | `Integer`                | Alternative |             | duration of the flow on the node (millisecond)                                                               |
| `data.ruleId`        | `String`                 | Optional    |             | rule ID                                                                                                      |
| `data.ruleName`      | `String`                 | Optional    |             | rule Name                                                                                                    |
| `data.noData`        | `Boolean`                | Optional    |             | if the alert is a no-data alert                                                                              |
| `data.actionType`    | `String`                 | Optional    |             | action type                                                                                                  |
| `data.actionContent` | `JSON` / `String` (JSON) | Optional    |             | action data in JSON or JSON string                                                                           |
| `data.alertItemTags` | `JSON`                   | Optional    | `undefined` | alert item extra tags. Both key and value should be a string                                                 |
| `data.tags`          | `JSON`                   | Optional    | `undefined` | extra tags. Both key and value should be a string                                                            |
| `callback`           | `Function`               | Optional    | `undefined` | Callback function `function(err, ret)`                                                                       |

Either `data.duration` or `data.durationMs` should be spcified.



---



###### *method* `DataWay.writeAlerts(alerts, callback)`

Write many alerts

|           参数           |           类型           |   是否必须  |   默认值    |                                                     说明                                                     |
|--------------------------|--------------------------|-------------|-------------|--------------------------------------------------------------------------------------------------------------|
| `alert`                  | `Array`                  | Required    |             | alert list                                                                                                   |
| `alert[#]`               | `JSON`                   | Required    |             | alert data                                                                                                   |
| `alert[#].level`         | `String`                 | Required    |             | `one of `"critical"` / `"warning"` / `"info"` / `"ok"`                                                       |
| `alert[#].alertId`       | `String`                 | Required    |             | alert ID                                                                                                     |
| `alert[#].checkValue`    | `JSON` / `String` (JSON) | Required    |             | check Value in JSON or JSON string                                                                           |
| `alert[#].timestamp`     | `Number`                 | Required    |             | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `alert[#].duration`      | `Integer`                | Alternative |             | duration of the flow on the node (second)                                                                    |
| `alert[#].durationMs`    | `Integer`                | Alternative |             | duration of the flow on the node (millisecond)                                                               |
| `alert[#].ruleId`        | `String`                 | Optional    |             | rule ID                                                                                                      |
| `alert[#].ruleName`      | `String`                 | Optional    |             | rule Name                                                                                                    |
| `alert[#].noData`        | `Boolean`                | Optional    |             | if the alert is a no-data alert                                                                              |
| `alert[#].actionType`    | `String`                 | Optional    |             | action type                                                                                                  |
| `alert[#].actionContent` | `JSON` / `String` (JSON) | Optional    |             | action data in JSON or JSON string                                                                           |
| `alert[#].alertItemTags` | `JSON`                   | Optional    | `undefined` | alert item extra tags. Both key and value should be a string                                                 |
| `alert[#].tags`          | `JSON`                   | Optional    | `undefined` | extra tags. Both key and value should be a string                                                            |
| `callback`               | `Function`               | Optional    | `undefined` | Callback function `function(err, ret)`                                                                       |

## Announcement

We picked some code from [crypto-js](https://github.com/brix/crypto-js) for MD5 and Hmac-Sha1.

## License

[Apache License Version 2.0](LICENSE)

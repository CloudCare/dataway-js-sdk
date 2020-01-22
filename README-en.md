# DataFlux Dataway JS SDK -nodep

A DataFlux Dataway SDK for Javascript.

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

3. `Keyevent`/`FLow` Support.

4. Dataway Authorization support.

5. HTTP/HTTPS support.

6. All-in-one file.

7. No third-party package dependency.

## TODO

1. Because of the current version of Dataway does not handle the Cross-Site AJAX request from browser properly,
a proxy like backend server or Nginx may be needed when using SDK in frontend projects.

2. Because of the requirement of `Date` header by the current version of Dataway in ak-open mode,
signature is not avaliable in frontend projects. (`Date` header is not allowed in AJAX request according to the standard).

## Installation

No need to `npm`/`yarn`, just copy the only file `dataway.js`/`dataway.min.js` to your project and `require` it or include the file in HTML.

See [example.js](example.js) or [example.html](example.html)

## Quick Example

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

## API Document

###### *class* `Dataway(options)`

Dataway class

|   Fields of `options`   |        Type       | Required |      Default Value       |                               Description                                |
|-------------------------|-------------------|----------|--------------------------|--------------------------------------------------------------------------|
| `url`                   | `String`          | Optional | `null`                   | Dataway full access URL, e.g. `"http://localhost:9528/v1/write/metrics"` |
| `host`                  | `String`          | Optional | `"localhost"`            | Dataway host                                                             |
| `port`                  | `Integer`         | Optional | `9528`                   | Dataway port                                                             |
| `protocol`              | `String`          | Optional | `"http"`                 | Dataway protocol. `"http"`/`"https"`                                     |
| `path`                  | `String`          | Optional | `"/v1/write/metrics"`    | Dataway report path                                                      |
| `datakitUUID`           | `String`          | Optional | `"dataway-js-sdk-nodep"` | Datakit name                                                             |
| `accessKey`/`secretKey` | `String`/`String` | Optional | `null`/`null`            | Dataway AccessKey and SecretKey for authorization                        |
| `debug`                 | `Boolean`         | Optional | `false`                  | Print detailed debug info or not                                         |

The following instantiation are equivalent:
- `Dataway({ url: "http://localhost:9528/v1/write/metrics" })`
- `Dataway({ host: "localhost", port: "9528", protocol: "http", path: "/v1/write/metrics" })`

`datakitUUID` should be specified by business system name for being queried in DataFlux.

`accessKey`/`secretKey` is required when the authorization of Dataway opened. To open the authorization of Dataway:

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



###### *method* `Dataway.writePoint(data)`

Write one point

|     Parameter      |   Type   | Required |   Default Value   |                                                 Description                                                  |
|--------------------|----------|----------|-------------------|--------------------------------------------------------------------------------------------------------------|
| `data`             | `JSON`   | Required |                   | data point                                                                                                   |
| `data.measurement` | `String` | Required |                   | measurement                                                                                                  |
| `data.tags`        | `JSON`   | Optional | `null`            | tags. Both key and value should be a string                                                                  |
| `data.fields`      | `JSON`   | Optional | `null`            | fields. Key should be a string, value should be a string/integer/float/boolean value                         |
| `data.timestamp`   | `Number` | Optional | Current Timestamp | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |



---



###### *method* `Dataway.writePoints(data)`

Write many points

|       Parameter       |   Type   | Required |   Default Value   |                                                 Description                                                  |
|-----------------------|----------|----------|-------------------|--------------------------------------------------------------------------------------------------------------|
| `data`                | `Array`  | Required |                   | data point list                                                                                              |
| `data[#]`             | `JSON`   | Required |                   | data point data                                                                                              |
| `data[#].measurement` | `String` | Required |                   | measurement                                                                                                  |
| `data[#].tags`        | `JSON`   | Optional | `null`            | tags. Both key and value should be a string                                                                  |
| `data[#].fields`      | `JSON`   | Optional | `null`            | fields. Key should be a string, value should be a string/integer/float/boolean value                         |
| `data[#].timestamp`   | `Number` | Optional | Current Timestamp | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |



---



###### *method* `Dataway.writeKeyevent(data)`

Write a key event

|    Parameter     |   Type   | Required | Default Value |                                                    Description                                                     |
|------------------|----------|----------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `data`           | `JSON`   | Required |               | keyevent data                                                                                                      |
| `data.title`     | `String` | Required |               | title                                                                                                              |
| `data.timestamp` | `Number` | Required |               | event timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data.des`       | `String` | Optional |               | description                                                                                                        |
| `data.link`      | `String` | Optional |               | related external link, e.g. `"http://some-domain/some-path"`                                                       |
| `data.source`    | `String` | Optional |               | source                                                                                                             |
| `data.tags`      | `JSON`   | Optional | `null`        | extra tags. Both key and value should be a string                                                                  |



---



###### *method* `Dataway.writeKeyevents(data)`

Write many key events

|      Parameter      |   Type   | Required | Default Value |                                                    Description                                                     |
|---------------------|----------|----------|---------------|--------------------------------------------------------------------------------------------------------------------|
| `data`              | `Array`  | Required |               | key event list                                                                                                     |
| `data[#]`           | `JSON`   | Required |               | key event data                                                                                                     |
| `data[#].title`     | `String` | Required |               | title                                                                                                              |
| `data[#].timestamp` | `Number` | Required |               | event timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data[#].des`       | `String` | Optional |               | description                                                                                                        |
| `data[#].link`      | `String` | Optional |               | related external link, e.g. `"http://some-domain/some-path"`                                                       |
| `data[#].source`    | `String` | Optional |               | source                                                                                                             |
| `data[#].tags`      | `JSON`   | Optional | `null`        | extra tags. Both key and value should be a string                                                                  |



---



###### *method* `Dataway.writeFlow(data)`

Write a flow

|     Parameter     |    Type   |   Required  | Default Value |                                                 Description                                                  |
|-------------------|-----------|-------------|---------------|--------------------------------------------------------------------------------------------------------------|
| `data`            | `JSON`    | Required    |               | flow data                                                                                                    |
| `data.traceId`    | `String`  | Required    |               | flow trace ID                                                                                                |
| `data.name`       | `String`  | Required    |               | node name                                                                                                    |
| `data.type`       | `String`  | Required    |               | node type                                                                                                    |
| `data.timestamp`  | `Number`  | Required    |               | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data.duration`   | `Integer` | Alternative |               | duration of the flow on the node (second)                                                                    |
| `data.durationMs` | `Integer` | Alternative |               | duration of the flow on the node (millisecond)                                                               |
| `data.parent`     | `String`  | Optional    | `null`        | previous node name. The first node do not have one                                                           |
| `data.tags`       | `JSON`    | Optional    | `null`        | extra tags. Both key and value should be a string                                                            |
| `data.fields`     | `JSON`    | Optional    | `null`        | extra fields. Key should be a string, value should be a string/integer/float/boolean value                   |

Either `data.duration` or `data.durationMs` should be spcified.



---



###### *method* `Dataway.writeFlows(data)`

Write many flows

|      Parameter       |    Type   |   Required  | Default Value |                                                 Description                                                  |
|----------------------|-----------|-------------|---------------|--------------------------------------------------------------------------------------------------------------|
| `data`               | `Array`   | Required    |               | flow list                                                                                                    |
| `data[#]`            | `JSON`    | Required    |               | flow data                                                                                                    |
| `data[#].traceId`    | `String`  | Required    |               | flow trace ID                                                                                                |
| `data[#].name`       | `String`  | Required    |               | node name                                                                                                    |
| `data[#].type`       | `String`  | Required    |               | node type                                                                                                    |
| `data[#].timestamp`  | `Number`  | Required    |               | timestamp, Support second/millisecond/microsecond/nanosecond. SDK will detect and auto convert to nanosecond |
| `data[#].duration`   | `Integer` | Alternative |               | duration of the flow on the node (second)                                                                    |
| `data[#].durationMs` | `Integer` | Alternative |               | duration of the flow on the node (millisecond)                                                               |
| `data[#].parent`     | `String`  | Optional    | `null`        | previous node name. The first node do not have one                                                           |
| `data[#].tags`       | `JSON`    | Optional    | `null`        | extra tags. Both key and value should be a string                                                            |
| `data[#].fields`     | `JSON`    | Optional    | `null`        | extra fields. Key should be a string, value should be a string/integer/float/boolean value                   |

## Announcement

We picked some code from [crypto-js](https://github.com/brix/crypto-js) for MD5 and Hmac-Sha1.

## License

[Apache License Version 2.0](LICENSE)

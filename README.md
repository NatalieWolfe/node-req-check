# node-req-check
Request query and body parameter checking.

## Usage

The various check methods create a middleware that can be dropped onto your
route. They will check either the `query` or `body` parameter of the request
depending on the value of `req.method`. `GET` and `DELETE` requests will use the
`req.query`, all other methods will use `req.body`.

```js
const check = require('req-check');

app.get('/search', check.string({name: 'query', required: true}), searchEndpoint);

app.post(
  '/user/login',
  check.email({name: 'email', required: true}),
  check.string({name: 'password', required: true, min: 3}),
  userLoginEndpoint
);
```

## Available Checks

### check.string

Checks that a given parameter exists with length constraints. No validation of
the value of the parameter is made other than potentially checking the length.

__Options__:
* `name`: The name of the parameter to check.
* `required`: Boolean indicating if the parameter is required.
* `min`: Integer minimum parameter length.
* `max`: Integer maximum parameter length.

### check.email

Checks that the given parameter exists and could be a valid email. The email
validation is minimal since email validation is really complex and hard to get
perfect.

__Options__:
* `name`: The name of the parameter to check.
* `required`: Boolean indicating if the parameter is required.

### check.array

Checks that the given parameter exists and is an array. If the parameter is a
string it will be split first using the `delim` option.

__Options__:
* `name`: The name of the parameter to check.
* `required`: Boolean indicating if the parameter is required.
* `min`: Integer minimum parameter length.
* `max`: Integer maximum parameter length.
* `delim`: Delimiter to pass to `str.split`. Default is `/,\s*/g`.

### check.int

Checks that the given parameter exists and is an integer. If the parameter is a
string it will be parsed first using the `radix` option.

__Options__:
* `name`: The name of the parameter to check.
* `required`: Boolean indicating if the parameter is required.
* `min`: Integer minimum parameter value.
* `max`: Integer maximum parameter value.
* `radix`: Radix to pass to `parseInt`. Default is `10`.

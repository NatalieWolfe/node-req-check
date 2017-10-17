'use strict';

const restifyResponse = {
  missingParam: (name, res, next) => {
    next(new errors.MissingParameterError('Parameter ' + name + ' is required.'));
  },
  invalidParam: (name, expected, res, next) => {
    next(new errors.InvalidArgumentError('Parameter ' + name + ' should be ' + expected));
  }
};

const resResponse = {
  missingParam: (name, res) => {
    res.statusCode = 409;
    res.write('Parameter ' + name + ' is required.');
    res.end();
  },
  invalidParam: (name, expected, res) => {
    res.statusCode = 409;
    res.write('Parameter ' + name + ' should be ' + expected);
    res.end();
  }
};

let errors = null;
try {
  errors = require('restify-errors');
  module.exports = restifyResponse;
} catch (_e) {
  module.exports = resResponse;
}

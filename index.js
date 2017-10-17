'use strict';

const errors = require('./lib/errors');


module.exports = exports = config;

exports.config = config;
exports.string = string;
exports.email = email;
exports.array = array;
exports.int = int;


function config() {
  return module.exports;
}

function string(opts) {
  _setDefaults(opts, {
    required: false,
    min: -Infinity,
    max: Infinity
  });

  return function checkString(req, res, next) {
    const params = _getParams(req);
    const value = params[opts.name];
    if (!_checkRequired(value, opts, res, next)) {
      return;
    }
    if (typeof value !== 'string') {
      return errors.invalidParam(opts.name, 'a string', res, next);
    }
    if (!_checkMinMax(value.length, opts, res, next)) {
      return;
    }
    next();
  };
}

function email(opts) {
  _setDefaults(opts, {
    required: false
  });

  return function checkEmail(req, res, next) {
    const params = _getParams(req);
    const value = params[opts.name];
    if (!_checkRequired(value, opts, res, next)) {
      return;
    }
    if (!/^[\w+.%-]+@[\w+.%-]+$/.test(value)) {
      return errors.invalidParam(opts.name, 'an email', res, next);
    }
    next();
  };
}

function array(opts) {
  _setDefaults(opts, {
    delim: /,\s*/g,
    required: false,
    min: -Infinity,
    max: Infinity
  });

  return function checkArray(req, res, next) {
    const params = _getParams(req);
    let value = params[opts.name];
    if (!_checkRequired(value, opts, res, next)) {
      return;
    }
    if (typeof value === 'string') {
      value = value.split(opts.delim);
    }
    if (!Array.isArray(value)) {
      return errors.invalidParam(opts.name, 'an array', res, next);
    }
    if (!_checkMinMax(value.length, opts, res, next)) {
      return;
    }
    params[opts.name] = value;
    next();
  };
}

function int(opts) {
  _setDefaults(opts, {
    radix: 10,
    required: false,
    min: -Infinity,
    max: Infinity
  });

  return function checkNumber(req, res, next) {
    const params = _getParams(req);
    let value = params[opts.name];
    if (!_checkRequired(value, opts, res, next)) {
      return;
    }
    if (typeof value === 'string') {
      value = parseInt(value, opts.radix);
    }
    if (isNaN(value)) {
      return errors.invalidParam(opts.name, 'an integer', res, next);
    }
    if (!_checkMinMax(value, opts, res, next)) {
      return;
    }
    params[opts.name] = value;
    next();
  };
}

function _setDefaults(opts, defaults) {
  Object.keys(defaults).forEach((key) => {
    if (!opts.hasOwnProperty(key)) {
      opts[key] = defaults[key];
    }
  });
}

function _getParams(req) {
  return (/^(?:get|delete)$/i.test(req.method) ? req.query : req.body) || {};
}

function _checkRequired(value, opts, res, next) {
  if (opts.required && !value) {
    errors.missingParam(opts.name, res, next);
    return false;
  } else if (!opts.required && !value) {
    next();
    return false;
  }
  return true;
}

function _checkMinMax(value, opts, res, next) {
  if (value < opts.min || value > opts.max) {
    errors.invalidParam(opts.name, 'between ' + opts.min + ' and ' + opts.max, res, next);
    return false;
  }
  return true;
}

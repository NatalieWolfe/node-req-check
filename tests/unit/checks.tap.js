'use strict';

const sinon = require('sinon');
const tap = require('tap');

const check = require('../..');


tap.test('req-check', (t) => {
  t.autoend();

  t.test('string', (t) => {
    basicChecks(t, check.string);

    const ware = check.string({name: 'foo', min: 3, max: 6});
    const next = sinon.spy();
    const req = {method: 'get', query: {foo: 'bar'}};
    const res = {write: sinon.spy(), end: sinon.spy()};

    t.comment('minimum value');
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.equal(req.query.foo, 'bar', 'should leave value alone');

    t.comment('maximum value');
    next.reset();
    req.query.foo = 'foobar';
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.equal(req.query.foo, 'foobar', 'should leave value alone');

    t.comment('too small a value');
    next.reset();
    req.query.foo = 'a';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.comment('too large a value');
    next.reset();
    res.write.reset();
    res.end.reset();
    req.query.foo = 'fizzbang';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.end();
  });

  t.test('email', (t) => {
    basicChecks(t, check.email);

    const ware = check.email({name: 'foo'});
    const next = sinon.spy();
    const req = {method: 'get', query: {foo: 'bar@baz.com'}};
    const res = {write: sinon.spy(), end: sinon.spy()};

    t.comment('valid email');
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');

    t.comment('invalid email');
    next.reset();
    req.query.foo = 'nogood';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.end();
  });

  t.test('array', (t) => {
    basicChecks(t, check.array);

    const ware = check.array({name: 'foo', min: 3, max: 6});
    const next = sinon.spy();
    const req = {method: 'get', query: {foo: 'foo,bar,baz'}};
    const res = {write: sinon.spy(), end: sinon.spy()};

    t.comment('minimum value');
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.deepEqual(req.query.foo, ['foo', 'bar', 'baz'], 'should parse the value');

    t.comment('maximum value');
    next.reset();
    req.query.foo = 'foo,bar,baz,fizz,bang,boof';
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.deepEqual(
      req.query.foo,
      ['foo', 'bar', 'baz', 'fizz', 'bang', 'boof'],
      'should parse the value'
    );

    t.comment('too small a value');
    next.reset();
    req.query.foo = 'a';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.comment('too large a value');
    next.reset();
    res.write.reset();
    res.end.reset();
    req.query.foo = 'foo,bar,baz,fizz,bang,boof,biff';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.end();
  });


  t.test('int', (t) => {
    basicChecks(t, check.int);

    const ware = check.int({name: 'foo', min: 3, max: 6});
    const next = sinon.spy();
    const req = {method: 'get', query: {foo: '3'}};
    const res = {write: sinon.spy(), end: sinon.spy()};

    t.comment('minimum value');
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.equal(req.query.foo, 3, 'should parse the value');

    t.comment('maximum value');
    next.reset();
    req.query.foo = '6';
    ware(req, res, next);
    t.ok(next.calledOnce, 'should call next');
    t.equal(req.query.foo, 6, 'should parse the value');

    t.comment('too small a value');
    next.reset();
    req.query.foo = '0';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.comment('too large a value');
    next.reset();
    res.write.reset();
    res.end.reset();
    req.query.foo = '50';
    ware(req, res, next);
    t.ok(next.notCalled, 'should not call next');
    t.ok(res.write.calledOnce, 'should write to the response');
    t.ok(res.end.calledOnce, 'should end the response');

    t.end();
  });
});

function basicChecks(t, check) {
  t.type(check, 'function', 'should be a function');

  let ware = check({name: 'foo'});
  t.type(ware, 'function', 'should return a function');
  t.equal(ware.length, 3, 'should accept three parameters (req, res, next)');

  t.comment('not required, not given');
  const next = sinon.spy();
  ware({method: 'get'}, {}, next);
  t.ok(next.calledOnce, 'should call next once');
  t.equal(next.getCall(0).args.length, 0, 'should call next with no arguments');

  t.comment('required, not given');
  next.reset();
  const res = {write: sinon.spy(), end: sinon.spy()};
  ware = check({name: 'foo', required: true});
  ware({method: 'get'}, res, next);
  t.ok(next.notCalled, 'should not call next');
  t.ok(res.write.calledOnce, 'should write to the response');
  t.ok(res.end.calledOnce, 'should end the response');
}

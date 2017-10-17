'use strict';

const sinon = require('sinon');
const tap = require('tap');

const check = require('../..');


tap.test('req-check', (t) => {
  t.autoend();

  t.test('string', (t) => {
    basicChecks(t, check.string);
    t.end();
  });

  t.test('email');
  t.test('array');
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
  t.notOk(next.calledOnce, 'should not call next');
  t.ok(res.write.calledOnce, 'should write to the response');
  t.ok(res.end.calledOnce, 'should end the response');
}

import assert from 'assert';
import memoize from '../';

describe('memoize getter/method decorator', function() {

  class A {
    constructor(value = 42) {
      this.computedCount = 0;
      this.value = value;
    }

    @memoize
    get expensiveValue() {
      this.computedCount += 1;
      return this.value;
    }

    @memoize
    expensiveMethod() {
      this.computedCount += 1;
      return this.value + 1;
    }
  }

  it('computes class getter only once and memoizes result for future access', function() {
    let a = new A();
    assert(a.computedCount === 0);
    assert(a.expensiveValue === 42);
    assert(a.computedCount === 1);
    assert(a.expensiveValue === 42);
    assert(a.computedCount === 1);
  });

  it('computes class method only once and memoizes result for future access', function() {
    let a = new A();
    assert(a.computedCount === 0);
    assert(a.expensiveMethod() === 43);
    assert(a.computedCount === 1);
    assert(a.expensiveMethod() === 43);
    assert(a.computedCount === 1);
  });

  it('does not override memoized values from different methods', function() {
    let a = new A(41);
    assert(a.expensiveValue, 41);
    let b = new A(42);
    assert(b.expensiveValue, 42);
    assert(a.expensiveValue, 41);
    assert(b.expensiveValue, 42);
  });

  it('throws if applied on a method of more than zero arguments', function() {
    assert.throws(() => {
      class A {
        @memoize
        method(a) {

        }
      }
    }, /@memoize decorator can only be applied to methods of zero arguments/);
  });

});

/**
 * @copyright 2015, Andrey Popp <8mayday@gmail.com>
 */

const SENTINEL = {};

export default function memoize(target, name, descriptor) {
  if (typeof descriptor.value === 'function') {
    return _memoizeMethod(target, name, descriptor);
  } else if (typeof descriptor.get === 'function') {
    return _memoizeGetter(target, name, descriptor);
  } else {
    throw new Error('@memoize decorator can be applied to methods or getters, got ' + String(descriptor.value) + ' instead');
  }
}

function _memoizeGetter(target, name, descriptor) {
  let memoizedName = `_memoized_${name}`;
  let get = descriptor.get;
  target[memoizedName] = SENTINEL;
  return {
    ...descriptor,
    get() {
      if (this[memoizedName] === SENTINEL) {
        this[memoizedName] = get.call(this);
      }
      return this[memoizedName];
    }
  };
}

function _memoizeMethod(target, name, descriptor) {
  if (descriptor.value.length > 0) {
    throw new Error('@memoize decorator can only be applied to methods of zero arguments');
  }
  let memoizedName = `_memoized_${name}`;
  let value = descriptor.value;
  target[memoizedName] = SENTINEL;
  return {
    ...descriptor,
    value() {
      if (this[memoizedName] === SENTINEL) {
        this[memoizedName] = value.call(this);
      }
      return this[memoizedName];
    }
  };
}

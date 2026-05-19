// Minimal shim for `react-dom` used in RN bundling
// Provide only the small subset that packages like @react-aria/utils expect.

export function flushSync(cb) {
  if (typeof cb === 'function') {
    return cb();
  }
}

export function unstable_batchedUpdates(cb) {
  if (typeof cb === 'function') {
    return cb();
  }
}

export default {
  flushSync,
  unstable_batchedUpdates,
};

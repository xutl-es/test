const { AssertionError } = require('node:assert');
const { describe, it, only, skip, todo, beforeAll, beforeEach, afterEach, afterAll } = require('./harness.js');

exports.before = exports.beforeAll = beforeAll;
exports.beforeEach = beforeEach;
exports.afterEach = afterEach;
exports.after = exports.afterAll = afterAll;

exports.describe = Object.assign(describe, {
	it,
	skip,
	todo,
	only: (label, describer) => {
		describe(label, describer);
		only();
	},
});
exports.timeout = (label, ms, runner) => {
	it(label, () => Promise.race([runner(), expire(ms)]));
};
exports.it = Object.assign(it, {
	describe,
	skip,
	todo,
	only: (label, runner) => {
		it(label, runner);
		only();
	},
	timeout: exports.timeout,
});

exports.skip = Object.assign(skip, { describe, it });
exports.todo = Object.assign(todo, { describe, it });

exports.configure = ({ timeout }) => {
	const TESTS = Symbol.for('test-cases');
	globalThis[TESTS].timeout = timeout ?? globalThis[TESTS].timeout;
};
function expire(ms) {
	return new Promise((_, reject) => {
		const timer = setTimeout(() => reject(new AssertionError({ message: 'timeout', operator: 'time' })), ms);
		timer?.unref?.();
	});
}

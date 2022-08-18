const TESTS = Symbol.for('test-cases');
const stack = (globalThis[TESTS] = globalThis[TESTS] ?? [{ tests: [], ba: [], be: [], ae: [], aa: [], m: false }]);

exports.describe = function describe(label, definer) {
	stack.unshift({ label, tests: [], ba: [], be: [], ae: [], aa: [] });
	definer();
	const items = stack.shift();
	stack[0].tests.push(items);
	if (!stack[0].m) Promise.resolve().then(() => import('./run.js'));
	return {
		skip() {
			delete items.tests;
		},
		only() {
			exports.only();
		},
	};
};
exports.it = function it(label, runner) {
	if (stack.length < 2) throw new TypeError('call outside describe');
	const item = { label, runner };
	stack[0].tests.push(item);
	return {
		skip() {
			delete item.runner;
		},
		only() {
			exports.only();
		},
	};
};
exports.skip = function skip(label) {
	stack[0].tests.push({ label });
};
exports.todo = function todo(label) {
	skip(`TODO: ${label}`);
};
exports.only = function only() {
	return (stack[0].only = stack[0].only ?? stack[0].tests[stack[0].tests.length - 1]);
};

exports.beforeAll = function (runner) {
	if (stack.length < 2) throw new TypeError('call outside describe');
	stack[0].ba.push(runner);
};
exports.beforeEach = function (runner) {
	if (stack.length < 2) throw new TypeError('call outside describe');
	stack[0].be.push(runner);
};
exports.afterEach = function (runner) {
	if (stack.length < 2) throw new TypeError('call outside describe');
	stack[0].ae.push(runner);
};
exports.afterAll = function (runner) {
	if (stack.length < 2) throw new TypeError('call outside describe');
	stack[0].aa.push(runner);
};

exports.default = exports;

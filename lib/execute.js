const { resolve, basename, extname } = require('node:path');
const { cwd } = require('node:process');

const TESTS = Symbol.for('test-cases');
const stack = (globalThis[TESTS] = globalThis[TESTS] ?? [{ tests: [], ba: [], be: [], ae: [], aa: [], m: true }]);

async function subtests(result, tests, only, ba, be, ae, aa, enter, exit) {
	try {
		if (tests && tests.length) {
			if (ba && ba.length) for (const before of ba) await before();
			for (let idx = 0; idx < tests.length; idx++) {
				if (only && only !== tests[idx]) {
					await exec({ label: tests[idx].label }, idx, enter, exit);
				} else {
					try {
						if (be && be.length) for (const before of be) await before();
						const failed = !(await exec(tests[idx], idx + 1, enter, exit));
						if (failed) {
							result.status = '-';
							result.failed += 1;
						} else {
							result.passed += 1;
						}
						if (ae && ae.length) for (const after of ae) await after();
					} catch (er) {
						result.failed += 1;
						result.status = '-';
					}
				}
			}
			if (aa && aa.length) for (const after of aa) await after();
			if (result.status === '?') result.status = '+';
		}
	} catch (ex) {
		result.status = '-';
		result.failure = ex;
	}
}
async function runtest(result, runner) {
	try {
		if (runner) {
			await runner();
			result.status = '+';
			result.passed += 1;
		} else if (result.status === '?') {
			result.status = '!';
		}
	} catch (ex) {
		result.status = '-';
		result.failure = ex;
		result.failed += 1;
	}
}
async function exec({ label, tests, only, ba, be, ae, aa, runner }, idx, enter, exit) {
	const result = { status: '?', failure: null, passed: 0, failed: 0 };
	const children = tests?.length ?? 0;
	enter(idx, label, result, children);

	if ('function' === typeof runner) {
		await runtest(result, runner);
	} else if (tests && tests.length) {
		await subtests(result, tests, only, ba, be, ae, aa, enter, exit);
	} else {
		result.status = '!';
	}

	exit(idx, label, result, children);
	return result.status !== '-';
}
exports.run = async function run(enter, exit) {
	return exec(stack[0].tests?.length === 1 ? stack[0].tests[0] : stack[0], 0, enter, exit);
};
exports.suite = async function suite(filename) {
	try {
		await import(resolve(cwd(), filename));
	} catch (ex) {
		const label = basename(filename, extname(filename));
		const runner = () => {
			throw ex;
		};
		stack[0].tests.push({ label, runner });
	}
};
exports.have = function () {
	return stack[0].tests.length;
};

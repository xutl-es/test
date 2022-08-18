#!/usr/bin/env node

const { resolve } = require('node:path');
const { cwd } = require('node:process');
const { EOL } = require('node:os');

const { glob } = require('glob');

const { run, suite, have } = require('./execute.js');

const handlers = {
	'--tap': {
		indent: -1,
		out(line) {
			process.stdout.write(
				`${Array(this.indent > 0 ? this.indent : 0)
					.fill('  ')
					.join('')}${line}${EOL}`,
			);
		},
		enter(idx, label, result, children) {
			if (this.indent < 0) {
				this.indent += 1;
				this.out('TAP version 13');
			} else {
				this.indent += 1;
			}
			if (children) {
				if (idx) this.out(`# ${idx} - ${label}`);
				this.out(`1..${children}`);
			}
		},
		exit(idx, label, result, children) {
			this.indent -= 1;
			if (!idx) {
				this.out(`# Passed: ${result.passed} Failed: ${result.failed}`);
				return;
			}
			switch (result.status) {
				case '+':
					this.out(`ok ${idx} - ${label}`);
					break;
				case '-':
					this.out(`not ok ${idx} - ${label}`);
					// TODO: output failure reason
					this.indent += 1;
					this.out('---');
					this.out(`message: ${result.failure?.message ?? ''}`);
					this.out(`actual: ${result.failure?.actual ?? ''}`);
					this.out(`expected: ${result.failure?.expected ?? ''}`);
					(result.failure?.stack ?? '').split(/\r?\n/).forEach((l, i) => {
						if (!i && !l) return;
						this.out(`${i ? '' : 'stack: '}${l}`);
					});
					this.out('...');
					this.indent -= 1;
					break;
				case '!':
					this.out(`ok ${idx} - ${label} # skipped`);
					break;
				default:
					this.out(`not ok ${idx} - ${label} # uncertain`);
			}
		},
	},
	'--junit': {
		level: 0,
		out(line) {
			process.stdout.write(`${Array(this.level).fill('  ').join('')}${line}${EOL}`);
		},
		quote(str) {
			str = `${str}`.split('&').join('&amp;').split('"').join('&quot;');
			return `"${str}"`;
		},
		enter(idx, label, result, children) {
			if (!this.level) {
				this.out('<?xml version="1.0" encoding="utf-8"?>');
				this.out('<testsuites>');
			} else {
				if (children) {
					this.out(`<testsuite name=${this.quote(label)} tests="${children}">`);
				} else {
					this.out(`<testcase name=${this.quote(label)}>`);
				}
			}
			this.level += 1;
		},
		exit(idx, label, result, children) {
			this.level -= 1;
			if (!this.level) {
				this.out('</testsuites>');
				console.error(`# Passed: ${result.passed} Failed: ${result.failed}`);
			} else {
				if (children) {
					this.out('</testsuite>');
				} else {
					if (result.status === '!') {
						this.out(`  <skipped/>`);
					}
					if (result.failure) {
						this.out(
							`  <failure type="ERROR" message=${this.quote(result.failure.message ?? result.failure)}><![CDATA[${
								result.failure.stack
							}]]></failure>`,
						);
					}
					this.out('</testcase>');
				}
			}
		},
	},
};
async function main(mode, patterns) {
	if (!patterns.length && !have()) {
		patterns.push('**/*.test.{js,mjs,cjs}');
	}
	const wd = cwd();

	const files = (await Promise.all(patterns.map((pattern) => find(pattern)))).flat();
	const unique = new Set(files.map((file) => resolve(wd, file)));
	for (const file of unique.values()) await suite(file);

	const handler = handlers[mode] ?? handlers['--tap'];
	const pass = await run(handler.enter.bind(handler), handler.exit.bind(handler));
	process.exitCode = pass ? 0 : 1;
}

function find(pattern) {
	return new Promise((res, rej) => {
		glob(pattern, (err, files) => {
			if (err) return rej(err);
			res(files);
		});
	});
}

if (process.argv[2] && process.argv[2][0] === '-') {
	const mode = process.argv[2];
	const patterns = process.argv.slice(3);
	main(mode, patterns);
} else {
	main('--tap', process.argv.slice(2));
}

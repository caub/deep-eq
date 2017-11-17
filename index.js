const prettyFormat = require('pretty-format');
const chalk = require('chalk');

const formatOptions = {
	maxDepth: 3,
	highlight: true,
};

const format = o => prettyFormat(o, formatOptions);

class AssertionError extends Error {
	constructor(...args) {
		super(...args);
	}
}

const deepEqual = (o1, o2) => {
	const diffs = [];
	const deepEq = (o1, o2, path = []) => {
		const keys = new Set(Object.keys(o1).concat(Object.keys(o2)));
		keys.forEach(key => {
			const v1 = o1[key], v2 = o2[key];
			const keyStr = path.concat(key).join('.')
			if (v1 === undefined && v2 === undefined) {
				// ignore 
			} else if (v1 === undefined) {
				diffs.push(`${chalk.bold.red('\n → ' + keyStr)}: ${chalk.magentaBright(format(v2))}`);
			} else if (v2 === undefined) {
				diffs.push(`${chalk.bold.red('\n ← ' + keyStr)}: ${chalk.magenta(format(v1))}`);
			} else if (v1 && typeof v1 === 'object' && v2 && typeof v2 === 'object') {
				deepEq(v1, v2, path.concat(key));
			} else if (v1 !== v2) {
				diffs.push(`${chalk.bold.red('\n ↔ ' + keyStr)}: ${chalk.magenta(format(v1))} !== ${chalk.magentaBright(format(v2))}`);
			}
		});
	};
	deepEq(o1, o2);
	if (!diffs.length) return;

	throw new AssertionError(diffs.join(''));
};

module.exports = deepEqual;

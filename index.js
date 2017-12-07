const prettyFormat = require('pretty-format');
const chalk = require('chalk');

const formatOptions = {
	maxDepth: 3,
	highlight: true,
	min: true
};

const format = ({keyStr, v1, v2}, maxLen = Math.floor((process.stdout.columns - 3) / 2)) => {
	const k = keyStr.length > 20 ? '…' + keyStr.slice(-19) : keyStr;
	const s1 = v1 === undefined ? '' : prettyFormat(v1, formatOptions);
	const s2 = v2 === undefined ? '' : prettyFormat(v2, formatOptions);
	return {
		keyStr: k,
		v1: k.length + 1 + s1.length > maxLen ? s1.slice(0, maxLen - k.length - 3) + '…' : s1,
		v2: k.length + 1 + s2.length > maxLen ? s2.slice(0, maxLen - k.length - 3) + '…' : s2
	};
};

class AssertionError extends Error {
	constructor(...args) {
		super(...args);
		Error.captureStackTrace(this, deepEqual);
	}
}

const deepEqual = (o1, o2) => {
	const diffs = [];

	const deepEq = (o1, o2, path = []) => {
		const o1IsObj = typeof o1 === 'object' && o1 !== null;
		const o2IsObj = typeof o2 === 'object' && o2 !== null;
		if (!o1IsObj || !o2IsObj) {
			if (o1 !== o2) {
				diffs.push(format({keyStr: path.join('.'), v1: o1, v2: o2}));
			}
			return;
		}
		const keys = new Set(Object.keys(o1).concat(Object.keys(o2)));
		keys.forEach(key => {
			const v1 = o1[key], v2 = o2[key];
			const keyStr = path.concat(key).join('.')
			if (v1 === undefined && v2 === undefined) {
				// ignore 
			} else if (v1 === undefined) {
				diffs.push(format({keyStr, v2}));
			} else if (v2 === undefined) {
				diffs.push(format({keyStr, v1}));
			} else if (v1 && typeof v1 === 'object' && v2 && typeof v2 === 'object') {
				deepEq(v1, v2, path.concat(key));
			} else if (v1 !== v2) {
				diffs.push(format({keyStr, v1, v2}));
			}
		});
	};
	deepEq(o1, o2);
	if (!diffs.length) return;

	const r1Width = Math.max(...diffs.map(o => o.v1 ? o.keyStr.length + 1 + o.v1.length : 0));

	const arr = diffs.map(({keyStr: k, v1, v2}) => {
		const s1 = (v1 && k ? chalk.bold.red(k) + ' ' : '')+ chalk.magenta(v1);
		const s2 = (v2 && k ? chalk.bold.red(k) + ' ' : '') + chalk.magentaBright(v2);
		const pad1 = v1 ? r1Width - k.length - 1 - v1.length : r1Width;
		return `\n${s1}${' '.repeat(pad1)}\t${s2}`;
	});

	throw new AssertionError(arr.join(''));
};

module.exports = deepEqual;

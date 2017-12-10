const prettyFormat = require('pretty-format');
const chalk = require('chalk');

const formatOptions = {
	maxDepth: 3,
	highlight: true,
	min: true
};

const format = (keyStr, v1, v2, maxLen = Math.floor((process.stdout.columns - 3) / 2)) => {
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

/*
Todo typed arrays (Uint8Array, ...)
 */

const deepEqual = (o1, o2) => {

	const diff = (o1, o2, visited, path = []) => {
		const diffs = [];
		if (typeof o1 !== 'object' || o1 === null || typeof o2 !== 'object' || o2 === null) {
			if (o1 !== o2) {
				return [format(path.join('.'), o1, o2)];
			}
			return [];
		}
		if (Buffer.isBuffer(o1) && Buffer.isBuffer(o2)) {
			if (Buffer.compare(o1, o2) !== 0) {
				return ;
			}
			return [];
		}

		if (o1[visited] || o2[visited]) {
			return []; // can't go deeper, should we throw?
		}
		o1[visited] = o2[visited] = true;

		if (o1 instanceof Set && o2 instanceof Set) {
			// just shallow compare (unlike assert.deepEqual, todo?)
			return o1.size === o2.size && [...o1].some(x => !o2.has(x)) ?
				[format(path.join('.'), o1, o2)] :
				[];
		}
		if (o1 instanceof Map && o2 instanceof Map) {
			// just shallow compare (unlike assert.deepEqual, todo?)
			return o1.size === o2.size && [...o1].some(([k,v]) => o2.get(k) !== v) ?
				[format(path.join('.'), o1, o2)] :
				[];
		}
		const keys = new Set(Object.keys(o1).concat(Object.keys(o2)));
		keys.forEach(key => {
			const v1 = o1[key], v2 = o2[key];
			const keyStr = path.concat(key).join('.');
			if (v1 !== null && typeof v1 === 'object' && v2 !== null && typeof v2 === 'object') {
				diffs.push(...diff(v1, v2, visited, path.concat(key)));
			} else if (v1 !== v2) {
				diffs.push(format(keyStr, v1, v2));
			}
		});
		return diffs;
	};


	const diffs = diff(o1, o2, Symbol('deep-eq'));
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

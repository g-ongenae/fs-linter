'use strict';

const { concat, isNil } = require('lodash');

function cleanArray (arr) {
	return concat(...arr).filter((e) => !isNil(e));
}

function isUnwanted (name, options) {
	if (options && options.excludes) {
		return options.excludes.some((r) => {
			const re = new RegExp(r);
			return re.test(name);
		});
	}

	return false;
}

module.exports = {
	cleanArray,
	isUnwanted
};
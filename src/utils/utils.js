'use strict';

const { concat, isNil } = require('lodash');

function cleanArray (arr) {
	return concat(...arr).filter((e) => !isNil(e));
}

function isUnwanted (name, options) {
	if (options.excludes) {
		return options.excludes.some((r) => {
			return r.test(name);
		});
	}

	return false;
}

module.exports = {
	cleanArray,
	isUnwanted
};
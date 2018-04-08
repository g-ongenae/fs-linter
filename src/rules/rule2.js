'use strict';

const { camelCase } = require('lodash');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);

function isUpperCase (str) {
	return str.toUpperCase() === str;
}

async function moduleExportAClass (filename, e) {
	if (isUpperCase(filename.charAt(0))) {
		const fileContent = (await readFile(e.path)).toString();

		// TODO: Enhance validation
		return (/class [A-Z]\w*/).test(fileContent);
	}

	return false;
}

// eslint-disable-next-line no-unused-vars
async function check (e, o) {
	if (e.extension && e.extension === 'js') {
		const filename = e.name.substring(0, e.name.lastIndexOf('.'));
		const fileCorrectName = camelCase(filename);
		if (fileCorrectName !== filename) {
			const isAClass = await moduleExportAClass(filename, e);
			if (isAClass) {
				return null;
			}

			return {
				message: `${filename}.js should be named ${fileCorrectName}`,
				data: e,
			};
		}
	}

	return null;
}

module.exports = {
	name: 'RULE 2',
	description: 'JS files should have camelCase name',
	severity: 'critical',
	check,
	// correct,
};
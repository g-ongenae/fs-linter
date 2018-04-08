'use strict';

const { upperCase } = require('lodash');

// eslint-disable-next-line no-unused-vars
async function check (e, o) {
	if (e.extension && e.extension === 'md') {
		const filename = e.name.substring(0, e.name.lastIndexOf('.'));
		const filenameUpperCase = upperCase(filename).replace(/\s+/g, '_');
		if (filenameUpperCase !== filename) {
			return {
				message: `${filename}.md should be named ${filenameUpperCase}`,
				data: e,
			};
		}
	}

	return null;
}

module.exports = {
	name: 'RULE 1',
	description: 'Markdown files should be in uppercase',
	severity: 'warning',
	check,
	// correct,
};
'use strict';

const chalk = require('chalk');
const { isEmpty } = require('lodash');

const COLORS = {
	critical: 'cyan',
	error: 'red',
	warning: 'yellow',
	default: 'white',
};

function getColor (severity) {
	if (Object.keys(COLORS).includes(severity)) {
		return COLORS[severity];
	} else {
		return COLORS.default;
	}
}

function prettifyOneOutputProblem (output) {
	const color = getColor(output.severity);

	const severityLevel = output.severity || 'normal';
	let prettifyOutput = chalk[color](`Rule ${output.rule} with severity level ` +
		`${severityLevel} has ${output.problems.length} problems:\n`);
	prettifyOutput += output.description ? chalk.grey(`${output.description}\n`) : '';

	for (const file of output.problems) {
		prettifyOutput += chalk`- {white ${file.data.name}} {gray.dim at ${file.data.path}}\n`;
	}

	return {
		severity: output.severity,
		prettifyOutput
	};
}

function prettifyOutputForTerminal (output) {
	if (isEmpty(output)) {
		return {
			message: chalk.green('You don\'t have any problem in your file managemebnt, congrats!'),
			exitCode: 0
		};
	}

	const prettifyOutput = [];
	let problemSum = 0;

	for (const oneProblem of output) {
		problemSum += oneProblem.problems.length;
		prettifyOutput.push(prettifyOneOutputProblem(oneProblem));
	}

	prettifyOutput.sort((a, b) => {
		return a.severity && (a.severity.localeCompare(b.severity) >= 0) ?
			a : b;
	});

	let prettifyOutputAsString = prettifyOutput.map((o) => o.prettifyOutput).join('\n');
	prettifyOutputAsString += `\n\n${output.length} different(s) problem(s) and ${problemSum} problem(s) overall found.`;

	return {
		message: prettifyOutputAsString,
		exitCode: 1,
	};
}

module.exports = {
	getColor,
	prettifyOutputForTerminal,
	prettifyOneOutputProblem
};
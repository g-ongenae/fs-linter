#! /bin/env/node

'use strict';

const program = require('commander');
const { resolve } = require('path');
const { version, description } = require('../package.json');
const { readRecursivelyDirectory } = require('../src/readFiles');
const { applyEachRule } = require('../src/applyRules');
const { prettifyOutputForTerminal } = require('../src/prettifyOutput');

function list (val) {
	return val.split(',');
}

async function main (directory, rules, options) {
	const treeView = await readRecursivelyDirectory(directory, options);
	const problems = await applyEachRule(rules, treeView, options);
	const { message, exitCode } = prettifyOutputForTerminal(problems);
	console.log(message); // eslint-disable-line
	process.exit(exitCode); // eslint-disable-line
}

program
	.version(version)
	.description(description)
	.usage('fs-linter -c fsConfig.json -t .')
	.option('-d, --directory <dir>', 'Directory to be lint')
	.option('-r, --rules <rulesFiles>', 'The list of rules ex: rule1,rule2', list)
	.option('-o, --options <options>', 'List of options for the rules', JSON.parse)
	.parse(process.argv); // eslint-disable-line

if (program.directory && program.rules) {
	const opt = program.options || {};
	const dir = resolve(program.directory);
	main(dir, program.rules, opt);
} else {
	console.error('Directory and rules need to be set.'); // eslint-disable-line
}
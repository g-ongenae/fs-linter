'use strict';

const { concat, isNil } = require('lodash');
const { resolve } = require('path');

function cleanArray (arr) {
	return concat(...arr).filter((e) => !isNil(e));
}

async function applyRuleOnSubTree (ruleFunction, element, options) {
	let problems = [];

	if (element.content) {
		problems = await Promise.all(element.content.map(async (subElement) => {
			return applyRuleOnSubTree(ruleFunction, subElement, options);
		}));
	}

	problems.push(await ruleFunction(element, options));

	return cleanArray(problems);
}

async function applyRuleOnWholeTree (rulePath, treeView, options) {
	// eslint-disable-next-line no-undef
	const functionFullPath = resolve(`${__dirname}/rules`, rulePath);
	// eslint-disable-next-line global-require
	const ruleFunction = await require(functionFullPath);

	const problems = await Promise.all(treeView.map(async (treeElement) => {
		return applyRuleOnSubTree(ruleFunction, treeElement, options);
	}));

	return cleanArray(problems);
}

async function applyEachRule (rules, treeView, options) {
	const invalidFiles = await Promise.all(rules.map(async (r) => {
		return applyRuleOnWholeTree(r, treeView, options);
	}));

	return cleanArray(invalidFiles);
}

module.exports = {
	cleanArray,
	applyEachRule,
	applyRuleOnWholeTree,
	applyRuleOnSubTree
};
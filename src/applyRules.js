'use strict';

const { isEmpty } = require('lodash');
const { resolve } = require('path');
const { cleanArray } = require('./utils/utils');

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
	const rule = await require(functionFullPath);

	let problems = await Promise.all(treeView.map(async (treeElement) => {
		return applyRuleOnSubTree(rule.function, treeElement, options);
	}));

	problems = cleanArray(problems);

	if (isEmpty(problems)) {
		return null;
	} else {
		return {
			rule: rule.name,
			problems,
		};
	}
}

async function applyEachRule (rules, treeView, options) {
	const invalidFiles = await Promise.all(rules.map(async (r) => {
		return applyRuleOnWholeTree(r, treeView, options);
	}));

	return cleanArray(invalidFiles);
}

module.exports = {
	applyEachRule,
	applyRuleOnWholeTree,
	applyRuleOnSubTree
};
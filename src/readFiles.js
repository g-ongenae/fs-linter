'use strict';

const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const { isUnwanted } = require('./utils/utils');

const readdir = promisify(fs.readdir);
const stats = promisify(fs.stat);

async function getFileDescriptor (directory, file, options) {
	const fullFilePath = path.resolve(directory, file);
	if (isUnwanted(fullFilePath, options)) {
		return null;
	}

	const stat = await stats(fullFilePath);

	const fd = {
		name: file,
		path: fullFilePath,
		stat,
	};

	if (stat.isDirectory()) {
		// eslint-disable-next-line no-use-before-define
		fd.content = await readRecursivelyDirectory(fullFilePath, options);
	}

	if (stat.isFile()) {
		fd.extension = file.substring(file.lastIndexOf('.') + 1);
	}

	return fd;
}

async function readRecursivelyDirectory (directory, options) {
	if (isUnwanted(directory, options)) {
		return null;
	}

	const files = await readdir(directory);

	return Promise.all(files.map(async (f) => {
		return getFileDescriptor(directory, f, options);
	}));
}

module.exports = {
	getFileDescriptor,
	readRecursivelyDirectory
};
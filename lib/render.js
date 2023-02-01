import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';
import { isEmpty, isUndefined } from 'lodash';

export default async (pluginConfig, context) => {
	const logger = context.logger;
	
	const DEFAULT_README_PATH = './';
	const DEFAULT_TEMPLATE_PATH = './';
	
	var readmePath;
	var gotmplPath;

	if (isEmpty(pluginConfig.readmeFilePath) || isUndefined(pluginConfig.readmeFilePath)) {
		logger.warn('readmeFilePath can be empty within the config file. If it is not set to a intended path, then the default path will used.');
		readmePath = join(DEFAULT_README_PATH, 'README.md');

	} else if (isEmpty(pluginConfig.readmeTemplatePath) || isUndefined(pluginConfig.readmeTemplatePath)) {
		logger.warn('readmeTemplatePath can be empty within the config file. If it is not to a intended path, then the default path will used.');
		gotmplPath = join(DEFAULT_TEMPLATE_PATH, 'readme.gotmpl');

	} else {
		readmePath = join(pluginConfig.readmeFilePath, 'README.md');
		gotmplPath = join(pluginConfig.readmeTemplatePath, 'readme.gotmpl');
	}

	logger.log('readmeFilePath: ' + readmePath + ', gotmplPath: ' + gotmplPath);
	await renderReadme(readmePath, gotmplPath);
}

/*
 * Render the helm chart documentation if there is a template file or not with the helm-docs command line tool.
 * @param (string) readmeFilePath - The path where the README.md will be written.
 * @param (string) readmeTemplatePath - The path where the readme.gotmpl file will be read from.
 */
async function renderReadme(readmeFilePath, readmeTemplatePath) {
	const gotmplExists = await existsSync(readmeTemplatePath);
	if (!gotmplExists) {
		return execSync(
			`helm-docs --dry-run | tee ${readmeFilePath}`,
			{ encoding: 'utf-8' }
		);
	} else {
		return execSync(
			`helm-docs --dry-run --template-files=${readmeTemplatePath} | tee ${readmeFilePath}`,
			{ encoding: 'utf-8' }
		);
	}
}

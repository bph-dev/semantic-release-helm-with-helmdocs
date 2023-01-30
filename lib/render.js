import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

export default async (pluginConfig, context) => {
	const logger = context.logger;		
	
	const defaultTemplatePath = './';
	const defaultReadmePath = './';

	var readmePath;
	var gotmplPath;

	if (pluginConfig.readmeFilePath === "" || pluginConfig.readmeFilePath == undefined){
		logger.warn('readmeFilePath can be empty within the config file. If it is not set to a intended path, then the default path will used.');
		readmePath = path.join(defaultReadmePath, 'README.md');

	} else if (pluginConfig.readmeTemplatePath === "" | pluginConfig.readmeTemplatePath == undefined) {
		logger.warn('readmeTemplatePath can be empty within the config file. If it is not to a intended path, then the default path will used.');
		gotmplPath = path.join(defaultTemplatePath, 'readme.gotmpl');

	} else {
		readmePath = path.join(pluginConfig.readmeFilePath, 'README.md');
		gotmplPath = path.join(pluginConfig.readmeTemplatePath, 'readme.gotmpl');
	}

	logger.log('readmeFilePath: ' + readmePath);
	logger.log('readmeTemplatePath: ' + gotmplPath);
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
		return execSync('helm-docs --dry-run | tee ' + readmeFilePath,{encoding: 'utf-8'});
	} else {
		return execSync('helm-docs --dry-run --template-files='+ readmeTemplatePath + ' | tee ' + readmeFilePath,{encoding: 'utf-8'});
	}
}

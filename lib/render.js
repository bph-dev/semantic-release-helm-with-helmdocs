import { execSync } from 'child_process';
import { existsSync } from 'fs';

/*
 * Call render to render the helm chart documentation into markdown format with the name README.md.
 * @param {string} readmePath - The path where the README.md file will be written to after the value iis pulled from the top level pluginConfig object.
 */
export default async (pluginConfig, context) => {
	const logger = context.logger;	
	logger.log('readmeFilePath: ' + pluginConfig.readmeFilePath);
	logger.log('readmeTemplatePath: ' + pluginConfig.readmeTemplatePath);

	await renderReadme(pluginConfig.readmeFilePath, pluginConfig.readmeTemplatePath);

	logger.log('[✔] Chart documentation successfully prepared.');
}

/*
 * Render the helm chart documentation if there is a template file or not with the helm-docs command line tool.
 * @param (string) readmeFilePath - The path where the README.md will be written.
 */
async function renderReadme(readmeFilePath='./', readmeTemplatePath='./') {
	const gotmplExists = await existsSync(readmeTemplatePath + 'readme.gotmpl');
	if (!gotmplExists) {
		return execSync('helm-docs --dry-run | tee ' + readmeFilePath + 'README.md',{encoding: 'utf-8'});
	} else {
		return execSync('helm-docs --dry-run --template-files='+ readmeTemplatePath + 'readme.gotmpl | tee ' + readmeFilePath + 'README.md',{encoding: 'utf-8'});
	}
}

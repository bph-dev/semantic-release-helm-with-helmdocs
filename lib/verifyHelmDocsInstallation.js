import { execa } from 'execa';

export default async (pluginConfig, context) => {
	const logger = context.logger;

	if (pluginConfig.prepareHelmChartDocs) {
		logger.log('Searching for installation of helm-docs...');
		await findHelmDocsExec();
	}
	
	return false;
}
/*
 * Find if the helm-docs program is installed by querying its version number or something trivial.
 */
async function findHelmDocsExec() {
	try {
		await execa('helm-docs',['--version']);
		return true;
	} catch (error) 
		return 'There was an issue with finding and executing helm-docs.'
	}
}


import execa from 'execa';

export default async (pluginConfig, context) => {
	const logger = context.logger;

	if (pluginConfig.prepareHelmChartDocs) {
		logger.log('Searching for installation of helm-docs...');
		await findHelmDocsExec(context);
	}	else {
    logger.log('Skipping helm-docs installation.');
  }
}

/*
 * Find if the helm-docs program is installed by querying its version number or something trivial.
 */
async function findHelmDocsExec(context) {
  const logger = context.logger;

	try {
		await execa('helm-docs',['--version']);
    return true;

  } catch (error) {
    logger.warn('There was an issue with finding and executing helm-docs.');
    const version = '1.11.0';
    const tmpDir = '/tmp/helmdocs';
    logger.log('Downloading helm-docs...');

    try {
      await execa(
        'mkdir',
        ['-p', tmpDir]
      );
      await execa(
        'curl',
        ['-sSLo', 'helm-docs.tar.gz', `https://github.com/norwoodj/helm-docs/releases/download/v${version}/helm-docs_${version}_Linux_x86_64.tar.gz`]
      );
      await execa(
        'tar',
        ['-xzf', 'helm-docs.tar.gz', '-C', tmpDir]
      );
      await execa(
        'rm',
        ['-f', 'helm-docs.tar.gz']
      );
      await execa(
        `${tmpDir}/helm-docs`,
        ['-- version']
      );
      return
    } catch (error) {
      logger.error('Failed to install helm-docs: ' + error);
    }
  }
}

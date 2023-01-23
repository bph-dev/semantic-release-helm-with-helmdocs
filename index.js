import verifyChart from './lib/verifyConditions.js';
import prepareChart from './lib/prepare.js';
import publishChart from './lib/publish.js';
import verifyInstallation from './lib/verifyInstallation.js';
import renderChartDocs from './lib/render.js';

let verified = false;
let prepared = false;
let installed = false;

async function verifyConditions(pluginConfig, context) {
    await verifyChart(pluginConfig, context);
    verified = true;
}

async function prepare(pluginConfig, context) {
	const logger = context.logger;

    if (!verified) {
        await verifyConditions(pluginConfig, context);
    }

    await prepareChart(pluginConfig, context);		

	if (pluginConfig.prepareHelmChartDocs) {
		installed = await verifyInstallation(pluginConfig, context);
		if (installed) {
			await renderChartDocs(pluginConfig, context);
		} else {
			logger.log('Skip prepare Helm Chart Documentation.');
		}
	} else {
		logger.log('prepareHelmChartDocs set to ' + prepareHelmChartDocs);
	}

    prepared = true;
}

async function publish(pluginConfig, context) {
    if (!verified) {
        await verifyConditions(pluginConfig, context);
    }
    if (!prepared) {
        await prepare(pluginConfig, context);
    }

    await publishChart(pluginConfig, context);
}

export default {verifyConditions, prepare, publish};

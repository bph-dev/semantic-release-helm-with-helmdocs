import verifyChart from './lib/verifyConditions.js';
import verifyHelmDocsInstallation from './lib/verifyHelmDocsInstallation.js';
import prepareChart from './lib/prepare.js';
import prepareHelmChartDocumentation from './lib/render.js';
import publishChart from './lib/publish.js';

import { isNil, isEmpty, isUndefined, isBoolean } from 'lodash';

let verified = false;
let verifiedInstallation = false;
let prepared = false;

async function verifyConditions(pluginConfig, context) {
  const logger = context.logger;
	
  await verifyChart(pluginConfig, context);

  if (!isNil(pluginConfig.prepareHelmChartDocs) || !isEmpty(pluginConfig.prepareHelmChartDocs)) {
    if (isBoolean(pluginConfig.prepareHelmChartDocs)) {
      verifiedInstallation = verifyHelmDocsInstallation(pluginConfig, context);
    } else {
      logger.error('prepareHelmChartDocs must be a boolean');
      // verifiedInstallation remains false
    }
  }

  verified = true;
}

async function prepare(pluginConfig, context) {
  const logger = context.logger;

  if (!verified) {
  	await verifyConditions(pluginConfig, context);
  }

  await prepareChart(pluginConfig, context);
	
	if (!isNil(verifiedInstallation) || !isUndefined(verifiedInstallation)) {
    if (verifiedInstallation) {
      await prepareHelmChartDocumentation(pluginConfig, context);
    }
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

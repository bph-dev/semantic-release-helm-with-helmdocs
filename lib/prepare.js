import { promises as fsPromises } from 'fs';
import { join } from 'path';
import { load, dump } from 'js-yaml';
import  semver  from 'semver';

export default async (pluginConfig, context) => {
    const logger = context.logger;

    const {version} = context.nextRelease;

    const filePath = join(pluginConfig.chartPath, 'Chart.yaml');

    const chartYaml = await fsPromises.readFile(filePath);
    const oldChart = load(chartYaml);

    let newChart;
    if (pluginConfig.onlyUpdateVersion) {
        newChart = dump({...oldChart, version});
        logger.log('Updating Chart.yaml with version %s.', version);
    } else {
        newChart = dump({...oldChart, version: version, appVersion: version});
        logger.log('Updating Chart.yaml with version %s and appVersion %s.', version, version);
    }

    await fsPromises.writeFile(filePath, newChart);
};

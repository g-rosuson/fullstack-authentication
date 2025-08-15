import dotenv from 'dotenv';

dotenv.config();

import { validateCommonEnvironmentVariables, validateEnvironmentVariables } from './utils';

// Validate environment variables at module initialization (fail-fast)
const envConfig = validateEnvironmentVariables();
const commonConfig = validateCommonEnvironmentVariables();

const config = {
    ...envConfig,
    ...commonConfig,
};

export default config;

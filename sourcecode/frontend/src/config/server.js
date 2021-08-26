import getEnvVariable from '../helpers/getEnvVariable.js';

export default {
    variablesToExpose: [
        'RAZZLE_STRIPE_PUBLIC_KEY',
        'RAZZLE_API_URL',
        'RAZZLE_SENTRY',
        'RAZZLE_RELEASE_HASH',
        'NODE_ENV',
        'RAZZLE_RELEASE_DATE',
        'RAZZLE_SENTRY_FRONTEND',
        'RAZZLE_SENTRY_SSR',
    ],
    internalUrl: getEnvVariable('RAZZLE_API_INTERNAL_URL', 'http://api'),
};

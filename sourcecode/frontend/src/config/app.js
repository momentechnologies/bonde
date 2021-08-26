import getEnvVariable from '../helpers/getEnvVariable.js';

const environment = process.env.NODE_ENV || 'development';

export default {
    releaseHash: getEnvVariable('RAZZLE_RELEASE_HASH'),
    releaseDate: getEnvVariable('RAZZLE_RELEASE_DATE', 'dev'),
    environment,
    isProduction: environment === 'production',
    sentryUrl: getEnvVariable('RAZZLE_SENTRY_FRONTEND'),
    sentrySSRUrl: getEnvVariable('RAZZLE_SENTRY_SSR'),
    supportEmail: 'support@kaalrota.no',
    appUrl: 'https://www.kaalrota.no',
    appName: 'Kaalrota',
    appNameDomain: 'kaalrota.no',
    isServerSide: typeof window === 'undefined',
};

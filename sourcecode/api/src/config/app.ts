export default {
    isProd: process.env.NODE_ENV === 'production',
    isTest: process.env.NODE_ENV === 'test',
    url: process.env.CONFIG_APP_URL,
    apiUrl: process.env.CONFIG_API_URL,
    cookieDomain: process.env.CONFIG_API_COOKIE_DOMAIN,
    googleProjectId: 'metics',
    port: parseInt(process.env.CONFIG_APP_PORT),
    keyFilename:
        process.env.NODE_ENV === 'production'
            ? '/secrets/google/credentials.json'
            : undefined,
    sentryUrl: process.env.CONFIG_SENTRY_URL,
};

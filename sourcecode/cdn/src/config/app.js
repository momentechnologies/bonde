export default {
    isProd: process.env.NODE_ENV === 'production',
    googleProjectId: 'kaalrota',
    publicUrl:
        process.env.CONFIG_APP_PUBLIC_URL || 'https://cdn.local.kaalrota.no',
    port: process.env.CONFIG_APP_PORT
        ? parseInt(process.env.CONFIG_APP_PORT)
        : 8080,
};

export default {
    storage: process.env.CONFIG_IMAGE_STORAGE || 'local',
    generalFileBucket: 'kaalrota-files-hot',
    gcpAuth: {
        keyFilename: '/secrets/google/credentials.json',
    },
};

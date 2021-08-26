import appConfig from '../config/app';

export default {
    origin: () =>
        !appConfig.isServerSide ? window.location.origin : appConfig.appUrl,
};

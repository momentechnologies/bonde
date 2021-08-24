import './client';
import './setupDotenv';
import appConfig from './config/app';
import app from './app';
import logger from './services/logger';

const server = app.listen(appConfig.port, () => {
    logger.info(`Metics Backend listening on ${appConfig.port}`);
});

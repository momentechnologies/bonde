import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routes';
import appConfig from './config/app';
import endpointNotFoundHandler from './middlewares/endpointNotFoundHandler';
import exceptionHandler from './middlewares/exceptionHandler';

const app = express();
app.enable('trust proxy');

app.use(function (req, res, next) {
    const origin = req.get('origin');

    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', appConfig.url);

    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Token, Content-Type, Accept, authorization'
    );
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');

    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(router);
app.use(endpointNotFoundHandler);
app.use(exceptionHandler);

export default app;

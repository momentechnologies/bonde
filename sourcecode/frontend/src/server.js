import App from './App';
import React from 'react';
import { ApolloProvider, ApolloClient } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import express from 'express';
import path from 'path';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { renderToStringWithData } from '@apollo/client/react/ssr';
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server';
import { ServerStyleSheet } from 'styled-components';
import serverConfig from './config/server.js';
import appConfig from './config/app.js';
import * as Sentry from '@sentry/node';
import moment from 'moment';
import cookieParser from 'cookie-parser';
import getSitemap from './server/getSitemap.js';
import { ApolloLink } from 'apollo-link';
import { parse } from 'set-cookie-parser';
import { ignoreErrors } from './helpers/sentry.js';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();

if (appConfig.isProduction && appConfig.sentrySSRUrl) {
    Sentry.init({
        dsn: appConfig.sentrySSRUrl,
        release: appConfig.releaseHash,
        environment: appConfig.environment,
        ignoreErrors: ignoreErrors,
    });

    server.use(Sentry.Handlers.requestHandler());
}

server
    .disable('x-powered-by')
    .use(cookieParser())
    .use(
        express.static(
            process.env.NODE_ENV === 'production'
                ? path.join(__dirname, '../build/public')
                : 'public'
        )
    )
    .use((req, res, next) => {
        res.cookiesToSet = {};

        const getCookiesMiddleware = new ApolloLink((operation, forward) => {
            return forward(operation).map((response) => {
                parse(
                    operation.getContext().response.headers.get('set-cookie')
                ).forEach((cookie) => {
                    res.cookiesToSet[cookie.name] = cookie;
                });

                return response;
            });
        });

        const getCookiesString = (requestCookies, setCookies) => {
            const newSetCookies = Object.entries(setCookies).reduce(
                (newSetCookies, [key, { value }]) => ({
                    ...newSetCookies,
                    [key]: value,
                }),
                {}
            );

            return Object.entries({
                ...requestCookies,
                ...newSetCookies,
            })
                .map(([key, value]) => `${key}=${value}`)
                .join(';');
        };

        req.apolloClient = new ApolloClient({
            ssrMode: true,
            link: getCookiesMiddleware.concat(
                createHttpLink({
                    uri: serverConfig.internalUrl + '/api/v1/graphql',
                    credentials: 'same-origin',
                    headers: {
                        'x-real-ip': req.headers['x-real-ip'],
                        'x-forwarded-for': req.headers['x-forwarded-for'],
                        'user-agent': req.headers['user-agent'],
                        'accept-language': req.headers['accept-language'],
                        cookie: getCookiesString(req.cookies, res.cookiesToSet),
                    },
                })
            ),
            cache: new InMemoryCache(),
        });

        next();
    })
    .get('/sitemap.xml', getSitemap)
    .get('/*', (req, res) => {
        const envVariables = serverConfig.variablesToExpose.reduce(
            (envVariables, varKey) => {
                envVariables[varKey] = process.env[varKey];
                return envVariables;
            },
            {}
        );

        try {
            const context = {};
            const sheet = new ServerStyleSheet();
            const now = moment();
            let status = 200;

            const extractor = new ChunkExtractor({
                statsFile: path.resolve('build/loadable-stats.json'),
                // razzle client bundle entrypoint is client.js
                entrypoints: ['client'],
            });

            const SetupApp = sheet.collectStyles(
                <ChunkExtractorManager extractor={extractor}>
                    <ApolloProvider client={req.apolloClient}>
                        <StaticRouter context={context} location={req.url}>
                            <App
                                getNow={() => now.clone()}
                                cookies={req.cookies}
                                notFoundEvent={() => (status = 404)}
                                acceptedCookies={() =>
                                    req.cookies.acceptedCookies
                                }
                            />
                        </StaticRouter>
                    </ApolloProvider>
                </ChunkExtractorManager>
            );

            if (context.url) {
                res.redirect(context.url);
            } else {
                renderToStringWithData(SetupApp)
                    .then((content) => {
                        const helmet = Helmet.renderStatic();
                        const initialState = req.apolloClient.extract();

                        const scriptTags = extractor.getScriptTags();
                        const linkTags = extractor.getLinkTags();
                        const styleTags = extractor.getStyleTags();

                        if (context.url) {
                            return res.redirect(context.url);
                        }

                        render({
                            res,
                            content,
                            initialState,
                            sheet,
                            assets,
                            helmet,
                            envVariables,
                            status,
                            scriptTags,
                            linkTags,
                            styleTags,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        Sentry.captureException(err);

                        render({
                            res,
                            content: '',
                            sheet,
                            assets,
                            envVariables,
                            status,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        render({
                            res,
                            content: '',
                            assets,
                            envVariables,
                            status,
                        });
                    });
            }
        } catch (err) {
            console.error(err);
            Sentry.captureException(err);
            render({ res, content: '', assets, envVariables });
        }
    });

export default server;

const render = ({
    res,
    content,
    initialState = {},
    sheet,
    assets,
    helmet,
    envVariables = {},
    status = 200,
    scriptTags,
    linkTags,
    styleTags,
}) => {
    Object.values(res.cookiesToSet).forEach((cookieToSet) =>
        res.cookie(cookieToSet.name, cookieToSet.value, {
            ...cookieToSet,
        })
    );

    res.status(status).send(
        `<!doctype html>
    <html ${helmet ? helmet.htmlAttributes.toString() : ''}>
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        ${helmet ? helmet.title.toString() : ''}
        ${helmet ? helmet.meta.toString() : ''}
        ${helmet ? helmet.link.toString() : ''}
        ${helmet ? helmet.script.toString() : ''}
        <!-- Google Tag Manager -->
        <script>
            (function(w, d, s, l, i) {
                w[l] = w[l] || [];
                w[l].push({
                    'gtm.start': new Date().getTime(),
                    event: 'gtm.js',
                });
                var f = d.getElementsByTagName(s)[0],
                    j = d.createElement(s),
                    dl = l != 'dataLayer' ? '&l=' + l : '';
                j.async = true;
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
                f.parentNode.insertBefore(j, f);
            })(window, document, 'script', 'dataLayer', 'GTM-WRSCVQC');
        </script>
        <!-- End Google Tag Manager -->
        <script async src="https://js.stripe.com/v3/"></script>
        ${sheet ? sheet.getStyleTags() : ''}
        ${linkTags}
        ${styleTags}
    </head>
    <body>
        <div id="root">${content}</div>
        <script>
                window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(
                    /</g,
                    '\\u003c'
                )};
                window.envVariables=${JSON.stringify(envVariables)};
        </script>
        ${scriptTags}
    </body>
</html>`
    );
};

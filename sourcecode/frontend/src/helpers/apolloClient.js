import { ApolloClient } from '@apollo/client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import apiConfig from '../config/api';

export default class ApolloClientHelper {
    onLogout = () => {};

    apolloClient = new ApolloClient({
        link: ApolloLink.from([
            onError(({ graphQLErrors }) => {
                if (
                    graphQLErrors &&
                    graphQLErrors.some(({ type }) => type === 'not_logged_in')
                ) {
                    this.onLogout();
                }
            }),
            new HttpLink({
                uri: apiConfig.url + '/api/v1/graphql',
                credentials: 'include',
            }),
        ]),
        cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
        defaultOptions: {
            query: {
                errorPolicy: 'all',
            },
        },
    });

    addLogoutListener(listener) {
        this.onLogout = listener;
    }
}

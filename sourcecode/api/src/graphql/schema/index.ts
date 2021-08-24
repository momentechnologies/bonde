import _ from 'lodash';
import * as SchemaTools from '@graphql-tools/schema';
import * as MergeGraphqlSchemas from 'merge-graphql-schemas';

import * as authSchema from './auth';

const get = (services) => ({
    typeDefs: MergeGraphqlSchemas.mergeTypes(
        [...services.map((s) => s.schema).filter((s) => s)],
        {
            all: true,
        }
    ),
    resolvers: services.reduce(
        (resolvers, service) =>
            service.resolvers
                ? _.merge({}, resolvers, service.resolvers)
                : resolvers,
        {}
    ),
});

export default SchemaTools.makeExecutableSchema(get([authSchema]));

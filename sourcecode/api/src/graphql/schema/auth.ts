import gql from 'graphql-tag';
import Joi from 'joi';

export const schema = gql`
    type Query {
        test: String
    }
`;

const passwordValidation = Joi.string().min(6).required();

export const resolvers = {
    Query: {
        test: () => "adsf",
    },
};

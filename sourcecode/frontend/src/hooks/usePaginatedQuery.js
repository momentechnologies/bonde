import { useQuery } from '@apollo/client';
import _ from 'lodash';

const usePaginatedQuery = (
    query,
    dataPath,
    variables = {},
    pagination = { count: 20 },
    orderBy = 'popularity'
) => {
    const data = useQuery(query, {
        variables: {
            ...variables,
            pagination,
            orderBy,
        },
    });

    let fetchMore = null;

    const dataObject = data.data && _.get(data.data, dataPath, null);
    if (dataObject && dataObject.pageInfo.hasNextPage) {
        fetchMore = async () => {
            await data.fetchMore({
                variables: {
                    pagination: {
                        ...pagination,
                        after: dataObject.pageInfo.endCursor,
                    },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    const newData = _.cloneDeep(prev);

                    _.set(newData, dataPath, {
                        ..._.get(prev, dataPath),
                        pageInfo: _.get(fetchMoreResult, dataPath).pageInfo,
                        edges: [
                            ..._.get(prev, dataPath).edges,
                            ..._.get(fetchMoreResult, dataPath).edges,
                        ],
                    });

                    return newData;
                },
            });
        };
    }

    return {
        ...data,
        fetchMore,
    };
};

export default usePaginatedQuery;

import getEnvVariable from '../helpers/getEnvVariable.js';

export default {
    url: getEnvVariable('RAZZLE_API_URL', 'https://api.local.kaalrot.no'),
};

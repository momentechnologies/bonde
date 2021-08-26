import axios from 'axios';
import apiConfig from '../config/api.js';

export default async options => {
    const response = await axios({
        ...options,
        url: `${apiConfig.url}/api/v1${options.url}`,
        withCredentials: true,
    });

    return response.data;
};

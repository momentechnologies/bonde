import { getLCP, getFID, getCLS, getFCP, getTTFB } from 'web-vitals';
import request from './helpers/request';

const path = String(window.location.pathname);

const report = async (name, value) => {
    await request({
        url: '/tracking/web-vitals',
        method: 'POST',
        data: {
            name,
            value,
            path,
        },
    });
};

[getCLS, getFID, getLCP, getFCP, getTTFB].forEach((monitor) => {
    monitor(({ name, value }) => report(name, value));
});

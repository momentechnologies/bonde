import React from 'react';

const match = (event, key) => key.toLowerCase() === event.key.toLowerCase();

export default (key, callback) => {
    React.useEffect(() => {
        const onDown = event => {
            if (match(event, key)) {
                callback();
            }
        };

        window.addEventListener('keydown', onDown);
        return () => {
            window.removeEventListener('keydown', onDown);
        };
    }, [key, callback]);
};

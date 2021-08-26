import React from 'react';
import { Helmet } from 'react-helmet';

const MyHelmet = ({ title, description, children }) => {
    let parts;
    if (Array.isArray(title)) {
        parts = [...title];
    } else {
        parts = [title];
    }

    return (
        <Helmet>
            <title>{[...parts, 'Kaalrota'].filter(Boolean).join(' | ')}</title>
            <meta
                property="og:title"
                content={parts.filter(Boolean).join(' | ')}
            />
            {description && (
                <meta property="og:description" content={description} />
            )}
            {description && (
                <meta property="description" content={description} />
            )}
            {children}
        </Helmet>
    );
};

export default MyHelmet;

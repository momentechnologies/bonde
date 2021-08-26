import xml from 'xml';
const url = (baseUrl, path) => `${baseUrl}${path}`;

const staticUrls = (baseUrl) =>
    [
        {
            loc: '/',
            changefreq: 'always',
        },
        {
            loc: '/about',
            changefreq: 'monthly',
        },
        {
            loc: '/refund-policy',
            changefreq: 'monthly',
        },
        {
            loc: '/privacy-policy',
            changefreq: 'weekly',
        },
        {
            loc: '/wishes',
            changefreq: 'daily',
        },
    ].map((u) => ({ ...u, loc: url(baseUrl, u.loc) }));

export default async (req, res, next) => {
    const baseUrl = 'https://' + req.get('host');

    const urlsets = [...staticUrls(baseUrl)].map((loc) => ({
        url: Object.entries(loc).map(([key, value]) => ({
            [key]: value,
        })),
    }));

    res.set('Content-Type', 'text/xml').send(
        xml(
            {
                urlset: [
                    {
                        _attr: {
                            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
                        },
                    },
                    ...urlsets,
                ],
            },
            { declaration: true }
        )
    );
};

import request from './request';
import appConfig from '../config/app.js';
import sbjs from 'sourcebuster';

const removeMVA = true;
const removeShipping = true;

const actualPrice = (price, shipping) => {
    let newPrice = price;

    if (removeShipping && shipping) {
        newPrice = newPrice - shipping;
    }

    if (removeMVA) {
        newPrice = newPrice / 1.25;
    }

    return newPrice;
};

const fbq = (...params) => {
    console.log(params);
    if (!window.fbq) {
        return;
    }
    window.fbq(...params);
};

const dlp = (...params) => {
    console.log(params);
    window.dataLayer.push(...params);
};

const googleEvent = (eventCategory, eventAction, eventLabel) => {
    dlp({
        event: 'GAEvent',
        eventCategory,
        eventAction,
        eventLabel,
    });
};

const google4Event = (name, params) => {
    dlp({
        ...params,
        event: 'ga4Event',
        ga4EventName: name,
    });
};

const productEventTracking = async (productId, event) => {
    await request({
        url: '/tracking/product-event',
        method: 'POST',
        data: {
            productId,
            event,
        },
    });
};

const categoryEventTracking = async (categoryId, event) => {
    await request({
        url: '/tracking/category-event',
        method: 'POST',
        data: {
            categoryId,
            event,
        },
    });
};

const articleEventTracking = async (articleId, event) => {
    await request({
        url: '/tracking/article-events',
        method: 'POST',
        data: {
            articleId,
            event,
        },
    });
};

export default {
    event: googleEvent,
    google4Event,
    productEvent: productEventTracking,
    categoryEvent: categoryEventTracking,
    articleEvent: articleEventTracking,
    startSession: () => {
        sbjs.init();
        const data = {
            source: sbjs.get.current.src,
            medium: sbjs.get.current.mdm,
            campaign: sbjs.get.current.cmp,
            content: sbjs.get.current.cnt,
            term: sbjs.get.current.trm,
        };
        console.log(data);

        request({
            url: '/tracking',
            method: 'POST',
            data,
        }).catch(() => {});
    },
    authenticated: (user) => {
        dlp({
            event: 'authenticated',
            userId: user.id,
        });
    },
    transactionDone: (price, shippingPrice, order) => {
        google4Event('purchase', {
            transaction_id: order.id,
            currency: 'NOK',
            value: actualPrice(price, shippingPrice),
            items: order.orderProducts.map((orderProduct, index) => ({
                index: index + 1,
                item_id: orderProduct.product.id,
                item_name: orderProduct.product.title,
                price: actualPrice(orderProduct.price),
                quantity: orderProduct.amount,
            })),
        });
        dlp({
            event: 'transactionDone',
            totalPrice: actualPrice(price, shippingPrice),
            orderId: order.id,
        });
        dlp({
            event: 'gae.purchase',
            ecommerce: {
                purchase: {
                    actionField: {
                        id: order.id,
                        affiliation: appConfig.appName,
                        revenue: actualPrice(price, shippingPrice),
                    },
                    products: order.orderProducts.map((orderProduct) => ({
                        id: orderProduct.product.id,
                        price: actualPrice(orderProduct.price),
                        quantity: orderProduct.amount,
                        name: orderProduct.product.title,
                    })),
                },
            },
        });
        fbq('track', 'Purchase', {
            currency: 'NOK',
            value: actualPrice(price, shippingPrice),
            content_type: 'product',
            contents: order.orderProducts.map((orderProduct) => ({
                id: orderProduct.product.id,
                quantity: orderProduct.amount,
            })),
        });
    },
    initiateCheckout: (cartItems, totalPrice) => {
        google4Event('begin_checkout', {
            currency: 'NOK',
            items: cartItems.map((cartItem, index) => ({
                index: index + 1,
                item_id: cartItem.product.id,
                item_name: cartItem.product.title,
                quantity: cartItem.amount,
                price: actualPrice(cartItem.product.price),
            })),
        });
        fbq('track', 'InitiateCheckout', {
            contents: cartItems.map((cartItem) => ({
                id: cartItem.product.id,
                quantity: cartItem.amount,
            })),
            currency: 'NOK',
            value: actualPrice(totalPrice),
        });
    },
    checkoutAction: (step, option) => {
        dlp({
            event: 'gae.checkout',
            ecommerce: {
                checkout: {
                    actionField: { step, option },
                },
            },
        });
    },
    productClick: (product, options) => {
        let actionField = {};
        if (options.listName) {
            actionField.list = options.listName;
        }

        let productEvent = {
            name: product.title,
            id: product.id,
            price: actualPrice(product.price),
        };

        if (options.position) {
            productEvent.position = options.position;
        }

        google4Event('select_item', {
            currency: 'NOK',
            items: [
                {
                    index: 1,
                    item_id: product.id,
                    item_name: product.title,
                    price: actualPrice(product.price),
                },
            ],
        });
        dlp({
            event: 'gae.productClick',
            ecommerce: {
                click: {
                    actionField,
                    products: [productEvent],
                },
            },
        });
        productEventTracking(product.id, 'click');
    },
    productPageView: (product) => {
        dlp({
            event: 'gae.productView',
            ecommerce: {
                detail: {
                    actionField: {},
                    products: [
                        {
                            name: product.title,
                            id: product.id,
                            price: actualPrice(product.price),
                        },
                    ],
                },
            },
        });
        google4Event('view_item', {
            currency: 'NOK',
            items: [
                {
                    index: 1,
                    item_id: product.id,
                    item_name: product.title,
                    price: actualPrice(product.price),
                },
            ],
        });
        fbq('track', 'ViewContent', {
            content_type: 'product',
            content_ids: [product.id],
        });
        productEventTracking(product.id, 'view');
    },
    addToCart: (product, amount) => {
        dlp({
            event: 'gae.addToCart',
            ecommerce: {
                currencyCode: 'NOK',
                add: {
                    products: [
                        {
                            name: product.title,
                            id: product.id,
                            price: actualPrice(product.price),
                            quantity: amount,
                        },
                    ],
                },
            },
        });
        fbq('track', 'AddToCart', {
            content_type: 'product',
            contents: [
                {
                    id: product.id,
                    quantity: amount,
                },
            ],
        });
        google4Event('add_to_cart', {
            currency: 'NOK',
            items: [
                {
                    index: 1,
                    item_id: product.id,
                    item_name: product.title,
                    price: actualPrice(product.price),
                    quantity: amount,
                },
            ],
        });
        productEventTracking(product.id, 'addToCart');
    },
    productsImpression: (products, options) => {
        if (products.length === 0) return;

        dlp({
            event: 'gae.impression',
            ecommerce: {
                currencyCode: 'NOK',
                impressions: products.map((product, index) => {
                    let productEvent = {
                        name: product.title,
                        id: product.id,
                        price: actualPrice(product.price),
                        position: index + 1,
                        brand: product.brand.name,
                    };

                    if (options.listName) {
                        productEvent.list = options.listName;
                    }

                    return productEvent;
                }),
            },
        });
        google4Event('view_item_list', {
            currency: 'NOK',
            items: products.map((product, index) => {
                let productEvent = {
                    item_name: product.title,
                    item_id: product.id,
                    price: actualPrice(product.price),
                    index: index + 1,
                    item_brand: product.brand.name,
                };

                if (options.listName) {
                    productEvent.item_list_name = options.listName;
                }

                return productEvent;
            }),
        });
    },
    search: (string) => {
        fbq('track', 'Search', {
            search_string: string,
        });
        google4Event('search', {
            search_term: string,
        });
    },
    register: () => {
        fbq('track', 'CompleteRegistration');
        googleEvent('authentication', 'register');
    },
};

export default {
    routes: [
        {
            method: 'POST',
            path: '/request-work-view',
            handler: 'api::work-view-request.work-view-request.requestWorkView',
            config: {
                policies: [],
                middlewares: ['global::rateLimiter'],
            },
        },
    ],
};

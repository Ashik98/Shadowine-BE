export default {
    routes: [
        {
            method: 'POST',
            path: '/send-email',
            handler: 'api::contact-form.contact-form.sendEmail',
            config: {
                policies: [],
                middlewares: ['global::rateLimiter'],
            },
        },
    ],
};

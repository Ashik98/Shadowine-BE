export default {
    routes: [
        {
            method: 'GET',
            path: '/homepage',
            handler: 'custom-homepage.getHomepage',
            config: {
                auth: false,
                policies: [],
                middlewares: [],
            },
        },
    ],
};

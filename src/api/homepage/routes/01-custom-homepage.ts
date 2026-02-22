export default {
    routes: [
        {
            method: 'GET',
            path: '/homepage',
            handler: 'custom-homepage.getHomepage',
            config: {
                policies: [],
                middlewares: [],
            },
        },
    ],
};

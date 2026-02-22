import { Context } from 'koa';

export default {
    async getHomepage(ctx: Context) {
        try {
            const homepage = await strapi.db.query('api::homepage.homepage').findOne({
                where: { publishedAt: { $notNull: true } },
                populate: {
                    globalSettings: {
                        populate: {
                            logo: true,
                            favicon: true,
                            cta: true,
                            navItems: true,
                        },
                    },
                    hero: {
                        populate: {
                            cta: true,
                            showReelVideo: true,
                            showReelThumbnail: true,
                        },
                    },
                    marqueeItems: {
                        populate: {
                            logo: true,
                        },
                    },
                    services: {
                        populate: {
                            cards: {
                                populate: {
                                    icon: true,
                                },
                            },
                        },
                    },
                    works: {
                        populate: {
                            workCards: {
                                populate: {
                                    thumbnail: true,
                                    video: true,
                                },
                            },
                        },
                    },
                    about: {
                        populate: {
                            avatarImage: true,
                        },
                    },
                    contact: {
                        populate: {
                            addressCard: true,
                            cta: true,
                            socialLinks: true,
                        },
                    },
                    footer: {
                        populate: {
                            links: true,
                        },
                    },
                    seo: {
                        populate: {
                            openGraph: {
                                populate: {
                                    ogImage: true,
                                },
                            },
                        },
                    },
                },
            });

            if (!homepage) {
                return ctx.notFound('Homepage not found or not published');
            }

            ctx.body = {
                data: homepage,
            };
        } catch (error) {
            strapi.log.error('Error fetching homepage:', error);
            ctx.internalServerError('An error occurred while fetching the homepage data');
        }
    },
};

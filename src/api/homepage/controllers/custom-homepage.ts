import { Context } from 'koa';

// Fields to strip from every object in the response
const STRIP_FIELDS = new Set([
    'id',
    'documentId',
    'createdAt',
    'updatedAt',
    'publishedAt',
    'createdBy',
    'updatedBy',
    'locale',
    'localizations',
]);

// Identifies a Strapi media/upload object
function isMediaObject(obj: any): boolean {
    return obj && typeof obj === 'object' && 'url' in obj && 'mime' in obj;
}

// Transform media → only url + alternativeText
function transformMedia(media: any): any {
    if (!media) return null;
    return {
        url: media.url ?? null,
        alternativeText: media.alternativeText ?? null,
    };
}

// Recursively clean the raw DB response
function clean(value: any): any {
    if (value === null || value === undefined) return value;
    if (typeof value !== 'object') return value;

    if (Array.isArray(value)) {
        return value.map(clean);
    }

    if (isMediaObject(value)) {
        return transformMedia(value);
    }

    const result: Record<string, any> = {};
    for (const [key, val] of Object.entries(value)) {
        if (STRIP_FIELDS.has(key)) continue;
        result[key] = clean(val);
    }
    return result;
}

export default {
    async getHomepage(ctx: Context) {
        try {
            const homepage = await strapi.db.query('api::homepage.homepage').findOne({
                where: { publishedAt: { $notNull: true } },
                populate: {
                    // ── Global Settings ───────────────────────────────────
                    globalSettings: {
                        populate: {
                            logo: true,
                            favicon: true,
                            cta: true,
                            navItems: true,
                        },
                    },

                    // ── Hero Section ──────────────────────────────────────
                    hero: {
                        populate: {
                            cta: true,
                            showReelVideo: true,
                            showReelThumbnail: true,
                        },
                    },

                    // ── Marquee Items ─────────────────────────────────────
                    marqueeItems: {
                        populate: {
                            logo: true,
                        },
                    },

                    // ── Services Section ──────────────────────────────────
                    services: {
                        populate: {
                            cards: {
                                populate: {
                                    icon: true,
                                },
                            },
                        },
                    },

                    // ── Works Section ─────────────────────────────────────
                    works: {
                        populate: {
                            works: {
                                populate: true,
                            },
                            privateView: {
                                populate: {
                                    cta: true,
                                },
                            },
                        },
                    },

                    // ── About Section ─────────────────────────────────────
                    about: {
                        populate: {
                            avatarImage: true,
                        },
                    },

                    // ── Stats Section ─────────────────────────────────────
                    stats: {
                        populate: {
                            stats: true,
                        },
                    },

                    // ── Contact Section ───────────────────────────────────
                    contact: {
                        populate: {
                            addressCard: true,
                            cta: true,
                            socialLinks: {
                                populate: {
                                    icon: true,
                                },
                            },
                        },
                    },

                    // ── Footer Section ────────────────────────────────────
                    footer: {
                        populate: {
                            links: true,
                        },
                    },

                    // ── SEO ───────────────────────────────────────────────
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
                data: clean(homepage),
            };
        } catch (error: any) {
            strapi.log.error('[custom-homepage] Error fetching homepage data:');
            strapi.log.error(error?.message || error);
            strapi.log.error(error?.stack || '');
            ctx.internalServerError(error?.message || 'An error occurred while fetching the homepage data');
        }
    },
};

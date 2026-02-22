/**
 * Rate Limiter Middleware
 *
 * Limits requests to specific endpoints based on IP address.
 * Default: 2 requests per hour per IP address.
 *
 * Usage:
 * Add to route config: middlewares: ['global::rateLimiter']
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT_MAX_REQUESTS = 2;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now) {
            rateLimitStore.delete(ip);
        }
    }
}, 10 * 60 * 1000);

export default (config: any, { strapi }: { strapi: any }) => {
    return async (ctx: any, next: any) => {
        const ipAddressRaw =
            ctx.request.ip ||
            ctx.request.header['x-forwarded-for'] ||
            ctx.request.socket?.remoteAddress ||
            'unknown';
        const ipAddress = Array.isArray(ipAddressRaw) ? ipAddressRaw[0] : ipAddressRaw;

        if (ipAddress === 'unknown') {
            strapi.log.warn('Rate limiter: Unable to determine IP address');
            return await next();
        }

        const now = Date.now();
        const entry = rateLimitStore.get(ipAddress);

        if (!entry || entry.resetTime < now) {
            rateLimitStore.set(ipAddress, {
                count: 1,
                resetTime: now + RATE_LIMIT_WINDOW_MS,
            });
            ctx.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
            ctx.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - 1).toString());
            ctx.set('X-RateLimit-Reset', new Date(now + RATE_LIMIT_WINDOW_MS).toISOString());
            return await next();
        }

        if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
            const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
            ctx.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
            ctx.set('X-RateLimit-Remaining', '0');
            ctx.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
            ctx.set('Retry-After', retryAfterSeconds.toString());
            ctx.status = 429;
            ctx.body = {
                error: 'Too many requests. Please try again later.',
                retryAfter: retryAfterSeconds,
                resetTime: new Date(entry.resetTime).toISOString(),
            };
            strapi.log.warn(`Rate limit exceeded for IP: ${ipAddress}`);
            return;
        }

        entry.count += 1;
        rateLimitStore.set(ipAddress, entry);
        ctx.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
        ctx.set('X-RateLimit-Remaining', (RATE_LIMIT_MAX_REQUESTS - entry.count).toString());
        ctx.set('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());
        return await next();
    };
};

import { factories } from '@strapi/strapi';
import { sendEmail } from '../services/emailService';
import { verifyRecaptcha } from '../services/recaptchaService';

/**
 * Read and parse JSON body from the request.
 * Falls back to reading from the raw Node.js stream if Strapi's body parser
 * hasn't populated ctx.request.body (common for custom routes on empty schemas).
 */
async function parseBody(ctx: any): Promise<any> {
    const existing = ctx.request.body;
    if (existing && typeof existing === 'object' && Object.keys(existing).length > 0) {
        return existing.data || existing;
    }

    return new Promise((resolve) => {
        const chunks: Buffer[] = [];
        ctx.req.on('data', (chunk: Buffer) => chunks.push(chunk));
        ctx.req.on('end', () => {
            try {
                const raw = Buffer.concat(chunks).toString('utf8');
                resolve(raw ? JSON.parse(raw) : {});
            } catch {
                resolve({});
            }
        });
        ctx.req.on('error', () => resolve({}));
    });
}

export default factories.createCoreController('api::contact-form.contact-form' as any, ({ strapi }) => ({

    async sendEmail(ctx) {
        try {
            const body = await parseBody(ctx);
            const {
                name,
                email,
                phone,
                message,
                recaptchaToken,
                source,
                page,
                ipAddress: bodyIpAddress,
            } = body;

            // ── Validate required fields ─────────────────────────────────
            if (!name || !email || !message) {
                ctx.status = 400;
                return { error: 'Missing required fields. Please provide name, email and message.' };
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                ctx.status = 400;
                return { error: 'Invalid email format.' };
            }

            // ── reCAPTCHA verification ────────────────────────────────────
            if (!recaptchaToken) {
                ctx.status = 400;
                return { error: 'reCAPTCHA verification is required.' };
            }

            const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
            if (!recaptchaSecretKey) {
                strapi.log.error('RECAPTCHA_SECRET_KEY is not set in environment variables');
                ctx.status = 500;
                return { error: 'Server configuration error. Please contact administrator.' };
            }

            const isRecaptchaValid = await verifyRecaptcha(recaptchaToken, recaptchaSecretKey);
            if (!isRecaptchaValid) {
                ctx.status = 400;
                return { error: 'reCAPTCHA verification failed. Please try again.' };
            }

            // ── Resolve IP address ────────────────────────────────────────
            let ipAddress: string;
            if (bodyIpAddress) {
                ipAddress = bodyIpAddress;
            } else {
                const ipRaw = ctx.request.ip || ctx.request.header['x-forwarded-for'] || 'unknown';
                ipAddress = Array.isArray(ipRaw) ? ipRaw[0] : ipRaw;
            }

            // ── Save to contact-submission collection ─────────────────────
            try {
                await strapi.documents('api::contact-submission.contact-submission').create({
                    data: {
                        name,
                        email,
                        phone,
                        message,
                        contactStatus: 'new',
                        ipAddress,
                        userAgent: ctx.request.header['user-agent'] || 'unknown',
                        source: source || 'contact-form',
                        page: page || undefined,
                        publishedAt: new Date(),
                    },
                });
                strapi.log.info(`Contact submission saved for ${email}`);
            } catch (dbError) {
                strapi.log.error('Failed to save contact submission:', dbError);
            }

            // ── Send email via AWS SES ─────────────────────────────────────
            const result = await sendEmail({ name, email, phone, message });

            return {
                success: true,
                message: "Message received! 🚀 We'll get back to you faster than your coffee gets cold.",
                messageId: result.MessageId,
            };

        } catch (error: any) {
            strapi.log.error('Error in sendEmail controller:', error?.message || error);
            ctx.status = 500;
            return { error: error.message || 'Failed to send email. Please try again later.' };
        }
    },

}));

import axios from 'axios';

/**
 * Verify reCAPTCHA token with Google
 * @param token - reCAPTCHA token from frontend
 * @param secretKey - reCAPTCHA secret key from env
 * @returns true if verification passed
 */
export async function verifyRecaptcha(token: string, secretKey: string): Promise<boolean> {
    if (!token) return false;

    try {
        const response = await axios.post(
            'https://www.google.com/recaptcha/api/siteverify',
            null,
            {
                params: {
                    secret: secretKey,
                    response: token,
                },
            }
        );

        const { success } = response.data;
        // Works for both reCAPTCHA v2 (boolean) and v3 (also check score if needed)
        return success === true;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
}

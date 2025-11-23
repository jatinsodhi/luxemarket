// Dynamic import to avoid issues if Resend is not installed
let Resend: any;
try {
    Resend = require('resend').Resend;
} catch (e) {
    console.warn('[EMAIL] Resend package not found. Running in mock mode only.');
}

const getResendClient = () => {
    if (!Resend || !process.env.RESEND_API_KEY) {
        return null;
    }
    try {
        return new Resend(process.env.RESEND_API_KEY);
    } catch (error) {
        console.error('[EMAIL] Failed to initialize Resend:', error);
        return null;
    }
};

interface EmailOptions {
    to: string;
    subject: string;
    otp?: string;
    userName?: string;
}

// Professional HTML email template
const getOTPEmailHTML = (otp: string, userName?: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - LuxeMarket</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">LuxeMarket</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; font-weight: 700;">
                                ${userName ? `Hi ${userName}!` : 'Welcome!'}
                            </h2>
                            <p style="margin: 0 0 24px; color: #6b7280; font-size: 16px; line-height: 1.6;">
                                Thank you for signing up with LuxeMarket. To complete your registration, please verify your email address using the code below:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 32px 0;">
                                <tr>
                                    <td align="center" style="padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 2px dashed #e5e7eb;">
                                        <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                                            Your Verification Code
                                        </p>
                                        <p style="margin: 0; color: #4f46e5; font-size: 36px; font-weight: 700; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                This code will expire in <strong style="color: #111827;">10 minutes</strong>. If you didn't request this code, please ignore this email.
                            </p>
                            
                            <div style="margin: 32px 0; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 8px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <strong>Security Tip:</strong> Never share this code with anyone. LuxeMarket will never ask for your verification code.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9fafb; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px; text-align: center;">
                                Need help? Contact us at <a href="mailto:support@luxemarket.com" style="color: #4f46e5; text-decoration: none;">support@luxemarket.com</a>
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} LuxeMarket. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

export const sendVerificationEmail = async (email: string, otp: string, userName?: string) => {
    try {
        // Always log to console for development
        console.log(`------------------------------------`);
        console.log(`[EMAIL] Sending OTP to: ${email}`);
        console.log(`OTP: ${otp}`);
        console.log(`------------------------------------`);

        // Get Resend client
        const resend = getResendClient();

        // If no client available, use mock mode
        if (!resend) {
            console.warn('[EMAIL] No Resend client available. Running in MOCK mode.');
            console.log(`[MOCK EMAIL] To: ${email}`);
            console.log(`Subject: Verify Your Email - LuxeMarket`);
            console.log(`OTP: ${otp}`);
            return { success: true, mock: true };
        }

        // Send real email with Resend
        const { data, error } = await resend.emails.send({
            from: 'LuxeMarket <onboarding@resend.dev>', // Use your verified domain
            to: [email],
            subject: 'Verify Your Email - LuxeMarket',
            html: getOTPEmailHTML(otp, userName),
        });

        if (error) {
            console.error('[EMAIL] Resend error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }

        console.log('[EMAIL] Successfully sent via Resend:', data?.id);
        return { success: true, messageId: data?.id };
    } catch (error: any) {
        console.error('[EMAIL] Error sending email:', error);
        // Don't throw - return mock success to prevent signup failure
        console.warn('[EMAIL] Falling back to mock mode due to error');
        return { success: true, mock: true, error: error.message };
    }
};

// Legacy function for backward compatibility
export const sendEmail = async (email: string, subject: string, text: string) => {
    console.log(`------------------------------------`);
    console.log(`[LEGACY EMAIL] To: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${text}`);
    console.log(`------------------------------------`);
    return true;
};

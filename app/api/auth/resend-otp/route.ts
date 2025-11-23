import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: 'User is already verified' }, { status: 400 });
        }

        // Generate new 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set new OTP expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        // Update user with new OTP
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        try {
            await sendVerificationEmail(email, otp, user.name);
            return NextResponse.json({
                message: 'New verification code sent to your email.',
                email: user.email,
            });
        } catch (emailError: any) {
            console.error('Email sending failed:', emailError);
            return NextResponse.json({
                message: 'OTP generated but email sending failed - check console for OTP.',
                email: user.email,
                warning: 'Email service unavailable. OTP logged to console.',
            });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

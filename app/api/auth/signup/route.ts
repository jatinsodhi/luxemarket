import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { name, email, password, phoneNumber } = await req.json();

        const userExists = await User.findOne({ email });

        if (userExists) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP expiry to 10 minutes from now
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password,
            phoneNumber,
            otp,
            otpExpiry,
            isVerified: false,
        });

        if (user) {
            try {
                await sendVerificationEmail(email, otp, name);
                return NextResponse.json({
                    message: 'User created. Please check your email for the verification code.',
                    email: user.email,
                }, { status: 201 });
            } catch (emailError: any) {
                console.error('Email sending failed:', emailError);
                // Still return success but with a warning
                return NextResponse.json({
                    message: 'User created. Email sending failed - check console for OTP.',
                    email: user.email,
                    warning: 'Email service unavailable. OTP logged to console.',
                }, { status: 201 });
            }
        } else {
            return NextResponse.json({ message: 'Invalid user data' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}


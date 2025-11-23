import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, otp } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (!user.otp) {
            return NextResponse.json({ message: 'No OTP found. Please sign up again.' }, { status: 400 });
        }

        // Check if OTP has expired
        if (user.otpExpiry && new Date() > user.otpExpiry) {
            return NextResponse.json({
                message: 'OTP has expired. Please request a new one.',
                expired: true
            }, { status: 400 });
        }

        // Verify OTP
        if (user.otp === otp) {
            user.isVerified = true;
            user.otp = undefined; // Clear OTP
            user.otpExpiry = undefined; // Clear expiry
            await user.save();

            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                isAdmin: user.isAdmin,
                isVerified: true,
                token: generateToken(user._id),
            });
        } else {
            return NextResponse.json({ message: 'Invalid OTP. Please try again.' }, { status: 400 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

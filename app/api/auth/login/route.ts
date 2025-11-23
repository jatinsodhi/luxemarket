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
        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (!user.isVerified && !email.includes('admin')) {
                // In production, you might force verification here
                // return NextResponse.json({ message: 'Please verify your email first' }, { status: 401 });
            }

            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                isAdmin: user.isAdmin,
                isVerified: user.isVerified,
                token: generateToken(user._id),
            });
        } else {
            return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

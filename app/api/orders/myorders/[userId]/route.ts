import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { protect } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ userId: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const user = await protect(req);

        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        // Ensure user can only access their own orders unless admin
        if (user._id.toString() !== params.userId && !user.isAdmin) {
            return NextResponse.json({ message: 'Not authorized to view these orders' }, { status: 401 });
        }

        const orders = await Order.find({ user: params.userId });
        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

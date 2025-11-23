import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { protect, admin } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const user = await protect(req);

        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const order = await Order.findById(params.id).populate('user', 'name email');

        if (order) {
            // Ensure user can only access their own order unless admin
            if (user._id.toString() !== order.user._id.toString() && !user.isAdmin) {
                return NextResponse.json({ message: 'Not authorized to view this order' }, { status: 401 });
            }
            return NextResponse.json(order);
        } else {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { protect, admin } from '@/lib/auth';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const user = await protect(req);

        if (!user || !admin(user)) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const order = await Order.findById(params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const updatedOrder = await order.save();
            return NextResponse.json(updatedOrder);
        } else {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

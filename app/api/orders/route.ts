import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { protect } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await protect(req);

        if (!user) {
            return NextResponse.json({ message: 'Not authorized' }, { status: 401 });
        }

        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        } = await req.json();

        if (orderItems && orderItems.length === 0) {
            return NextResponse.json({ message: 'No order items' }, { status: 400 });
        }

        const order = new Order({
            orderItems,
            user: user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        return NextResponse.json(createdOrder, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

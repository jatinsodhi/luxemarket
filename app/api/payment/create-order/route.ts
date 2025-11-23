import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder',
});

export async function POST(req: Request) {
    try {
        const { amount } = await req.json();
        const options = {
            amount: Math.round(amount * 100),
            currency: 'USD',
            receipt: 'order_rcptid_' + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: 'Something went wrong with payment init' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails } = await req.json();

        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const secret = process.env.RAZORPAY_KEY_SECRET || 'secret_placeholder';

        const expectedSign = crypto
            .createHmac('sha256', secret)
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSign) {
            if (orderDetails && orderDetails.email) {
                await sendEmail(
                    orderDetails.email,
                    `Order Confirmation #${razorpay_order_id}`,
                    `Thank you for your purchase. Your order is being processed.`
                );
            }
            return NextResponse.json({ message: 'Payment verified successfully' });
        } else {
            return NextResponse.json({ message: 'Invalid signature sent!' }, { status: 400 });
        }
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { protect, admin } from '@/lib/auth';

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const product = await Product.findById(params.id);

        if (product) {
            return NextResponse.json(product);
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        await connectDB();
        const user = await protect(req);

        if (!user || !admin(user)) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const product = await Product.findById(params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            return NextResponse.json({ message: 'Product removed' });
        } else {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

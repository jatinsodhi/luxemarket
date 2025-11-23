import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { protect, admin } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await protect(req);

        if (!user || !admin(user)) {
            return NextResponse.json({ message: 'Not authorized as admin' }, { status: 401 });
        }

        const { name, price, description, image, category, countInStock } = await req.json();

        const product = new Product({
            name,
            price,
            user: user._id,
            image,
            category,
            countInStock,
            numReviews: 0,
            description,
        });

        const createdProduct = await product.save();
        return NextResponse.json(createdProduct, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

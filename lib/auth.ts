import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/db';

export const protect = async (req: Request) => {
    let token;

    if (req.headers.get('authorization')?.startsWith('Bearer')) {
        try {
            token = req.headers.get('authorization')?.split(' ')[1];
            const decoded: any = jwt.verify(token!, process.env.JWT_SECRET || 'secret');

            await connectDB();
            const user = await User.findById(decoded.id).select('-password');

            return user;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    return null;
};

export const admin = (user: any) => {
    return user && user.isAdmin;
};

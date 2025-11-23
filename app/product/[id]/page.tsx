import { ProductDetails } from '@/views/ProductDetails';

export default function Page({ params }: { params: { id: string } }) {
    return <ProductDetails id={params.id} />;
}

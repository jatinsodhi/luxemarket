import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Premium Leather Backpack',
    price: 129.99,
    category: 'Accessories',
    description: 'Handcrafted from genuine full-grain leather, this backpack features a padded laptop sleeve and vintage brass hardware. Perfect for the urban commuter.',
    image: 'https://picsum.photos/400/400?random=1'
  },
  {
    id: '2',
    name: 'Wireless Noise-Canceling Headphones',
    price: 249.99,
    category: 'Electronics',
    description: 'Immerse yourself in high-fidelity audio with our latest active noise-canceling technology. 30-hour battery life ensures you never miss a beat.',
    image: 'https://picsum.photos/400/400?random=2'
  },
  {
    id: '3',
    name: 'Minimalist Quartz Watch',
    price: 89.50,
    category: 'Fashion',
    description: 'A sleek, modern timepiece featuring a sapphire crystal face and genuine leather strap. Water-resistant and elegantly designed for any occasion.',
    image: 'https://picsum.photos/400/400?random=3'
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    price: 399.00,
    category: 'Furniture',
    description: 'Maximize productivity with this fully adjustable ergonomic chair. Features lumbar support, breathable mesh back, and premium rollerblade wheels.',
    image: 'https://picsum.photos/400/400?random=4'
  },
  {
    id: '5',
    name: 'Smart Home Assistant',
    price: 49.99,
    category: 'Electronics',
    description: 'Control your home with your voice. This compact smart speaker delivers surprisingly big sound and integrates with thousands of smart devices.',
    image: 'https://picsum.photos/400/400?random=5'
  },
  {
    id: '6',
    name: 'Organic Cotton T-Shirt',
    price: 25.00,
    category: 'Fashion',
    description: 'Soft, breathable, and sustainably sourced. This 100% organic cotton tee is a wardrobe staple that feels as good as it looks.',
    image: 'https://picsum.photos/400/400?random=6'
  }
];

export const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Accessories', 'Furniture'];

import React from 'react';
import { Plus, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative">
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-[4/5]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
           <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <Eye size={16} /> View Details
           </span>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-1 text-lg hover:text-indigo-600 transition-colors">{product.name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="flex items-center gap-2 bg-gray-900 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
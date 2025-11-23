'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, ShoppingBag, ArrowLeft, User, Clock, ShieldAlert } from 'lucide-react';
import { Review } from '../types';

interface ProductDetailsProps {
  id?: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ id: propId }) => {
  const params = useParams();
  const id = propId || (params?.id as string);
  const router = useRouter();
  const { products, addReview } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const product = products.find(p => p.id === id);

  // Review State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => router.push('/')} className="text-indigo-600 hover:underline">Back to Shop</button>
      </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    const newReview: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString()
    };

    addReview(product.id, newReview);
    setComment('');
    setRating(5);
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image Section */}
        <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 aspect-square lg:aspect-auto lg:h-[600px]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <div className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">{product.category}</div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>

          {/* Rating Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={18} fill={star <= Math.round(averageRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-500 text-sm">({product.reviews?.length || 0} reviews)</span>
          </div>

          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{product.description}</p>

          <div className="text-3xl font-bold text-gray-900 mb-8">${product.price.toFixed(2)}</div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-900 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-gray-200"
            >
              <ShoppingBag size={20} /> Add to Cart
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <div className="text-center">
              <div className="font-bold text-gray-900">Free Shipping</div>
              <div className="text-xs text-gray-500">On orders over $50</div>
            </div>
            <div className="text-center border-l border-gray-100">
              <div className="font-bold text-gray-900">30 Days</div>
              <div className="text-xs text-gray-500">Easy Returns</div>
            </div>
            <div className="text-center border-l border-gray-100">
              <div className="font-bold text-gray-900">Secure</div>
              <div className="text-xs text-gray-500">Payment Process</div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          Customer Reviews <span className="bg-gray-100 text-gray-500 text-sm font-medium px-3 py-1 rounded-full">{product.reviews?.length || 0}</span>
        </h2>

        {/* Add Review Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-12">
          <h3 className="font-bold text-lg mb-4">Write a Review</h3>
          {!user ? (
            <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3 text-gray-600">
              <ShieldAlert size={20} />
              <p>Please <span onClick={() => router.push('/login')} className="font-bold text-indigo-600 cursor-pointer hover:underline">log in</span> to leave a review.</p>
            </div>
          ) : (
            <form onSubmit={handleAddReview}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="text-yellow-400 transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        size={28}
                        fill={(hoveredStar || rating) >= star ? "currentColor" : "none"}
                        className={(hoveredStar || rating) >= star ? "text-yellow-400" : "text-gray-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                <textarea
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Tell us what you think..."
                />
              </div>
              <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-600 transition-colors">
                Submit Review
              </button>
            </form>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{review.userName}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                          ))}
                        </div>
                        <span>• {new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
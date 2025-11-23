'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Review } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addReview: (productId: string, review: Review) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [product, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedReviews = product.reviews ? [review, ...product.reviews] : [review];
        return { ...product, reviews: updatedReviews };
      }
      return product;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, addReview }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within a ProductProvider');
  return context;
};
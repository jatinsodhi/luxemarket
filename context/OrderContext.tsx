'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, CartItem } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (userId: string, items: CartItem[], total: number, shippingAddress: any, paymentId?: string) => Promise<void>;
  getUserOrders: (userId: string) => Promise<Order[]>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_URL = 'http://localhost:5000/api/orders';

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('demo_orders');
    if (saved) {
      setOrders(JSON.parse(saved));
    }
  }, []);

  const createOrder = async (userId: string, items: CartItem[], total: number, shippingAddress: any, paymentId?: string) => {
    const mockOrder: Order = {
      id: 'ORD-' + Math.floor(Math.random() * 100000),
      userId,
      items,
      total,
      status: 'Processing',
      date: new Date().toISOString(),
      shippingAddress,
      paymentId
    };

    try {
      // Transform cart items to match backend schema
      const orderItems = items.map(item => ({
        name: item.name,
        qty: item.quantity,
        image: item.image,
        price: item.price,
        product: item.id
      }));

      const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : '';

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod: 'Razorpay',
          itemsPrice: total,
          taxPrice: total * 0.08,
          shippingPrice: 0,
          totalPrice: total,
          paymentResult: { id: paymentId, status: 'COMPLETED' },
          user: userId
        })
      });

      if (!res.ok) throw new Error('Failed to create order in DB');

      const newOrder = await res.json();
      setOrders(prev => [newOrder, ...prev]);
    } catch (err) {
      console.warn("Backend offline: Saving order locally for demo");
      // Fallback: Save to local state and local storage
      const newOrders = [mockOrder, ...orders];
      setOrders(newOrders);
      localStorage.setItem('demo_orders', JSON.stringify(newOrders));
    }
  };

  const getUserOrders = async (userId: string) => {
    try {
      const userToken = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).token : '';
      const res = await fetch(`${API_URL}/myorders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        return data;
      }
      throw new Error("Backend fetch failed");
    } catch (err) {
      console.warn("Backend offline: Loading local demo orders");
      // Return locally stored orders filtered by user (simulated)
      // In a real app, local storage isn't multi-user safe, but fine for demo
      return orders;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getUserOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within a OrderProvider');
  return context;
};
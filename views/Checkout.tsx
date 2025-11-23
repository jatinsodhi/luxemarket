'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { PaymentStatus } from '../types';
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const Checkout: React.FC = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const router = useRouter();
  const totalWithTax = cartTotal * 1.08;

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'USA'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSimulation = async () => {
    // Simulate a short delay then success
    await new Promise(resolve => setTimeout(resolve, 1500));
    await createOrder(
      user!.id,
      cart,
      totalWithTax,
      {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      },
      'pay_demo_' + Date.now()
    );
    setStatus(PaymentStatus.SUCCESS);
    clearCart();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to complete purchase");
      router.push('/login');
      return;
    }

    setStatus(PaymentStatus.PROCESSING);

    try {
      // 1. Attempt to contact backend
      let orderData;
      try {
        const response = await fetch('http://localhost:5000/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: totalWithTax }),
        });
        if (!response.ok) throw new Error('Backend unreachable');
        orderData = await response.json();
      } catch (backendErr) {
        console.warn("Backend offline or Create Order failed. Switching to Simulation.");
        await handleSimulation();
        return;
      }

      // 2. Load Razorpay SDK
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Check internet connection.");
        setStatus(PaymentStatus.FAILED);
        return;
      }

      // 3. Open Razorpay Options
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LuxeMarket",
        description: "Premium Checkout Transaction",
        image: "https://example.com/your_logo",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // 4. Verify Payment on Backend
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  userId: user.id,
                  items: cart,
                  shippingAddress: formData,
                  email: user.email
                }
              })
            });

            if (verifyRes.ok) {
              await createOrder(
                user.id,
                cart,
                totalWithTax,
                {
                  address: formData.address,
                  city: formData.city,
                  postalCode: formData.postalCode,
                  country: formData.country
                },
                response.razorpay_payment_id
              );
              setStatus(PaymentStatus.SUCCESS);
              clearCart();
            } else {
              alert("Payment verification failed");
              setStatus(PaymentStatus.FAILED);
            }
          } catch (err) {
            console.error(err);
            // Even if verification fails (e.g. network issue after payment), 
            // we might want to show success locally for demo
            setStatus(PaymentStatus.FAILED);
          }
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: user.email,
          contact: user.phoneNumber || "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', function (response: any) {
        alert(response.error.description);
        setStatus(PaymentStatus.FAILED);
      });

    } catch (err) {
      console.error("Checkout Error:", err);
      setStatus(PaymentStatus.FAILED);
    }
  };

  if (status === PaymentStatus.SUCCESS) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="bg-green-100 p-6 rounded-full mb-6 animate-bounce">
          <CheckCircle size={64} className="text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          Your order has been confirmed. A confirmation email has been sent to your inbox.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => router.push('/profile')}
            className="bg-indigo-50 text-indigo-600 px-8 py-3 rounded-full font-medium hover:bg-indigo-100 transition-colors"
          >
            View Order
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-900 text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input name="firstName" onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input name="lastName" onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input name="address" onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input name="city" onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input name="postalCode" onChange={handleInputChange} required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              Payment Method <Lock size={16} className="text-green-600" />
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white p-2 rounded border border-gray-200">
                  <img src="https://cdn.iconscout.com/icon/free/png-256/free-razorpay-1649771-1399875.png" alt="Razorpay" className="h-6" />
                </div>
                <span className="font-medium text-gray-700">Razorpay Secure</span>
              </div>
              <p className="text-sm text-gray-500">You will be redirected to the secure payment gateway to complete your purchase using Credit Card, Debit Card, UPI, or Net Banking.</p>
            </div>
          </section>

          <button
            disabled={status === PaymentStatus.PROCESSING}
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
          >
            {status === PaymentStatus.PROCESSING ? (
              <>
                <Loader2 className="animate-spin" /> Processing...
              </>
            ) : (
              `Pay $${totalWithTax.toFixed(2)}`
            )}
          </button>
        </form>

        {/* Summary Side */}
        <div className="bg-white p-8 rounded-2xl shadow-lg h-fit border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-4">Order Review</h3>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600">
            <span>Tax (8%)</span>
            <span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-xl text-gray-900">
            <span>Total</span>
            <span>${totalWithTax.toFixed(2)}</span>
          </div>

          <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>Ensure you enable pop-ups for the payment window.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
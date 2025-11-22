import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Navigate } from 'react-router-dom';
import { Package, User as UserIcon, Clock, MapPin, ChevronRight } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { getUserOrders, orders } = useOrders();

  useEffect(() => {
    if (user) {
      getUserOrders(user.id);
    }
  }, [user, getUserOrders]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userOrders = orders;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-xl text-gray-900">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.isAdmin && (
                <span className="mt-2 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">
                  Administrator
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium text-sm flex items-center gap-2">
                <Package size={16} /> My Orders
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                <UserIcon size={16} /> Account Settings
              </button>
              <button onClick={logout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                 Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            Order History <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{userOrders.length} orders</span>
          </h1>

          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start shopping to see your history here.</p>
              <a href="/" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                Start Shopping
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Order Placed</p>
                        <p className="text-sm font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                        <p className="text-sm font-medium text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Ship To</p>
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-1 group relative cursor-help">
                          {order.shippingAddress.address}
                          <MapPin size={12} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <p className="text-xs text-gray-500 uppercase font-bold mb-1">Order # {order.id}</p>
                       <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                         order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                         order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                         'bg-yellow-100 text-yellow-700'
                       }`}>
                         {order.status}
                       </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <p className="text-sm font-medium mt-1">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                             <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
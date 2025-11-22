import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { generateProductDescription } from '../services/geminiService';
import { CATEGORIES } from '../constants';
import { Product } from '../types';
import { Trash2, Sparkles, Plus, Package, Loader2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { products, addProduct, deleteProduct } = useProducts();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Electronics',
    price: 0,
    description: '',
    image: 'https://picsum.photos/400/400?random=' + Date.now()
  });

  const handleGenerateDescription = async () => {
    if (!newProduct.name || !newProduct.category) {
      alert("Please enter a product name and category first.");
      return;
    }
    setIsGenerating(true);
    const description = await generateProductDescription(newProduct.name, newProduct.category);
    setNewProduct(prev => ({ ...prev, description }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) return;

    addProduct({
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      category: newProduct.category || 'Other',
      description: newProduct.description,
      image: newProduct.image || 'https://picsum.photos/400/400'
    } as Product);

    // Reset form
    setNewProduct({
      name: '',
      category: 'Electronics',
      price: 0,
      description: '',
      image: 'https://picsum.photos/400/400?random=' + Date.now()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
           <p className="text-gray-500 mt-1">Manage inventory and use AI to generate content.</p>
        </div>
        <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Sparkles size={18} /> AI Powered
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus size={20} /> Add New Product
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Super Bass Speaker"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input 
                  type="number" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !newProduct.name}
                    className="text-xs flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={12} /> : <Sparkles size={12} />}
                    Auto-Generate
                  </button>
                </div>
                <textarea 
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none"
                  placeholder="Click Auto-Generate to use Gemini AI..."
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold transition-colors"
              >
                Add to Inventory
              </button>
            </form>
          </div>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-200">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <Package size={20} /> Current Inventory ({products.length})
               </h2>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                     <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-200">
                   {products.map(product => (
                     <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center gap-4">
                           <img src={product.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                           <div>
                             <div className="font-medium text-gray-900">{product.name}</div>
                             <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                         <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded-full text-gray-600">{product.category}</span>
                       </td>
                       <td className="px-6 py-4 font-medium text-gray-900">
                         ${product.price.toFixed(2)}
                       </td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => deleteProduct(product.id)}
                           className="text-red-400 hover:text-red-600 transition-colors"
                           title="Delete Product"
                         >
                           <Trash2 size={18} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
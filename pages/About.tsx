
import React from 'react';
import { ShieldCheck, Truck, RefreshCcw, Users } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Reinventing Luxury Commerce</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          LuxeMarket isn't just a store. It's a curated experience powered by next-generation technology to bring you the world's finest goods with unparalleled service.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {[
          { icon: ShieldCheck, title: "Authenticity Guaranteed", desc: "Every item is verified by our expert team to ensure 100% authenticity." },
          { icon: Truck, title: "Global Express Shipping", desc: "We ship to over 100 countries with express delivery options available." },
          { icon: RefreshCcw, title: "30-Day Returns", desc: "Not perfectly satisfied? Return it within 30 days for a full refund." },
          { icon: Users, title: "24/7 Expert Support", desc: "Our concierge team is available around the clock to assist you." }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
            <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6 text-indigo-600">
              <feature.icon size={28} />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Founded in 2024, LuxeMarket began with a simple idea: luxury should be accessible, transparent, and digital-first. We are building the bridge between traditional craftsmanship and modern technology.
            </p>
            <p className="text-gray-300 leading-relaxed">
              By leveraging AI for personalized recommendations and maintaining strict quality controls, we provide a shopping experience that feels as premium as the products we sell.
            </p>
          </div>
          <div className="h-96 md:h-auto">
            <img src="https://picsum.photos/800/800?random=99" alt="Office" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

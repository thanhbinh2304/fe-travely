import React from 'react';
import Banner from '@/components/client/banner';

export default function Homepage() {
  return (
    <div className="min-h-screen">
      {/* Banner chỉ hiển thị ở trang chủ */}
      <Banner />

      {/* Content */}
      <div>
        {/* Things to do section */}
        <section className="container mx-auto  px-4 py-25">
          <h2 className="text-3xl font-bold mb-8">Things to do wherever you&apos;re going</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {/* Destination Cards */}
            {[
              { name: 'Rome', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400' },
              { name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
              { name: 'Amsterdam', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400' },
              { name: 'Barcelona', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400' },
              { name: 'Venice', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400' },
              { name: 'Florence', image: 'https://images.unsplash.com/photo-1519455953755-af066f52f1a6?w=400' },
            ].map((destination) => (
              <div key={destination.name} className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                <div className="aspect-[4/3] relative">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">
                    {destination.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Attractions section */}
        <section className="container mx-auto px-4 py-16 bg-gray-50">
          <h2 className="text-3xl font-bold mb-8">Attractions you can&apos;t miss</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] bg-gray-200">
                  <img
                    src={`https://images.unsplash.com/photo-${1500000000000 + item * 10000000}?w=400`}
                    alt={`Attraction ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">Amazing Tour {item}</h3>
                  <p className="text-gray-600 text-sm mb-3">Discover the beauty of this destination</p>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-bold">From $99</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

    </div>
  )
}

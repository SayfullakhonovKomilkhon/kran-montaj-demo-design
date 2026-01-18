'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define product type based on the Supabase database structure
interface Product {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  price: number | string | null;
}

// Helper function to format price (handles both number and string with "от")
function formatPrice(price: number | string | null): string {
  if (!price) return '';
  
  // If price is a string that already contains "от", just return it formatted
  if (typeof price === 'string') {
    const cleanPrice = price.replace(/от\s*/gi, '').trim();
    const numPrice = parseFloat(cleanPrice.replace(/\s/g, ''));
    if (!isNaN(numPrice)) {
      return `от ${numPrice.toLocaleString()} сум`;
    }
    return price;
  }
  
  // If price is a number, format it
  return `от ${price.toLocaleString()} сум`;
}

export default function CatalogSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        console.log('Fetching products for home page...');
        
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(3);

        if (error) {
          console.error('Supabase error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('Products data received for home page:', data);
        setProducts(data || []);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // SVG fallback icons
  const fallbackIcons = [
    <svg key="crane1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M21 10H3M21 10V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V10M21 10L15.5 3.5C15.1673 3.1673 14.6836 3 14.1716 3H9.82843C9.31641 3 8.83266 3.1673 8.5 3.5L3 10M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16ZM9 16C9 16.5523 8.55229 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55229 15 9 15.4477 9 16Z" />
    </svg>,
    <svg key="crane2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M9 21H6C4.34315 21 3 19.6569 3 18V16.5M9 21L11 19M9 21V18M15 21H18C19.6569 21 21 19.6569 21 18V16.5M15 21L13 19M15 21V18M3 16.5V6C3 4.34315 4.34315 3 6 3H9M3 16.5H9M21 16.5V6C21 4.34315 19.6569 3 18 3H15M21 16.5H15M9 3L11 5M9 3V6M15 3L13 5M15 3V6M9 6H15M9 12H15M9 18H15" />
    </svg>,
    <svg key="crane3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-20 h-20 text-gray-400">
      <path d="M10.5421 20.0018C6.71886 18.8578 3.86002 15.3071 3.86002 11.11C3.86002 5.8287 8.1387 1.55002 13.42 1.55002C16.8137 1.55002 19.7913 3.37238 21.3657 6.10002M10.5421 20.0018L6.74198 17.2018M10.5421 20.0018L11.02 15.5018M13.42 5.77952C15.7537 5.77952 17.6405 7.66636 17.6405 10.0001C17.6405 12.3337 15.7537 14.2206 13.42 14.2206C11.0863 14.2206 9.19943 12.3337 9.19943 10.0001C9.19943 7.66636 11.0863 5.77952 13.42 5.77952Z" />
    </svg>
  ];

  // Handle image loading errors
  const [imgErrors, setImgErrors] = useState<{[key: string]: boolean}>({});
  
  const handleImageError = (id: string) => {
    setImgErrors(prev => ({...prev, [id]: true}));
  };

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-gray-100 relative overflow-hidden">
      {/* Industrial background elements */}
      <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      
      {/* Diagonal accent */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 20px)'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16 relative z-10" data-aos="fade-up">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h2 
            className="text-2xl sm:text-3xl font-black text-gray-900 md:text-4xl uppercase tracking-tight"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Наш <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">каталог</span>
          </h2>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
            <div className="w-8 h-0.5 bg-gray-300 rounded"></div>
          </div>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">Надёжное грузоподъёмное оборудование для вашего производства</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-3 border-b-3 border-orange-500 mb-4"></div>
              <p className="text-gray-700 font-bold">Загрузка оборудования...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 text-lg font-semibold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl font-semibold">Нет доступных продуктов</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {products.map((product, index) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-200"
                data-aos="fade-up"
                data-aos-delay={100 * (index + 1)}
                data-aos-duration="600"
              >
                {/* Top accent bar */}
                <div className="h-1.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500"></div>
                
                {/* Image container */}
                <div className="h-48 bg-gradient-to-br from-slate-100 via-gray-50 to-slate-100 relative overflow-hidden">
                  {/* Grid pattern */}
                  <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                  
                  {/* Industrial badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-gray-800 text-yellow-400 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                      Кран
                    </div>
                  </div>
                  
                  {imgErrors[product.id] || !product.image_url ? (
                    <div className="flex items-center justify-center w-full h-full">
                      {fallbackIcons[index % fallbackIcons.length]}
                    </div>
                  ) : (
                    <div className="relative w-full h-full transform duration-500 group-hover:scale-110">
                      <Image
                        src={product.image_url}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                        onError={() => handleImageError(product.id)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  {product.price && (
                    <div className="inline-flex items-center bg-gradient-to-r from-gray-800 to-gray-700 px-3 py-1.5 rounded-lg">
                      <span className="text-yellow-400 font-bold text-sm">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Bottom bar */}
                <div className="h-1 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700"></div>
              </div>
            ))}
          </div>
        )}

        {/* CTA button */}
        <div className="flex justify-center mt-12 relative z-10" data-aos="fade-up" data-aos-delay="400">
          <Link 
            href="/catalog" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 uppercase tracking-wide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Смотреть весь каталог
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
} 
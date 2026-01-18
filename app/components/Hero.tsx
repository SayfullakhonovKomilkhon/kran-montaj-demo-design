'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Industrial dark background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>
      
      {/* Diagonal stripes accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
        <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 30px)'}}></div>
      </div>
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-4xl">
          {/* Industrial badge */}
          <div 
            className="inline-flex items-center px-4 py-2 bg-gray-800/80 border border-orange-500/30 rounded-full mb-8"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Грузоподъёмное оборудование</span>
          </div>
          
          {/* Main heading */}
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight"
            data-aos="fade-up"
            data-aos-delay="100"
            data-aos-duration="800"
          >
            <span className="block">КРАН-МОНТАЖ</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400">
              СЕРВИС
            </span>
          </h1>
          
          {/* Decorative line */}
          <div 
            className="flex items-center mt-6 space-x-3"
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="800"
          >
            <div className="w-16 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"></div>
            <div className="w-8 h-1 bg-gray-600 rounded-full"></div>
            <div className="w-4 h-1 bg-gray-700 rounded-full"></div>
          </div>
          
          {/* Subtitle */}
          <p 
            className="mt-8 text-xl sm:text-2xl text-gray-300 max-w-2xl leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="300"
            data-aos-duration="800"
          >
            <span className="text-orange-400 font-semibold">15 лет опыта</span> в изготовлении, монтаже и обслуживании 
            промышленного грузоподъёмного оборудования
          </p>
          
          {/* Stats row */}
          <div 
            className="mt-12 grid grid-cols-3 gap-6 max-w-lg"
            data-aos="fade-up"
            data-aos-delay="400"
            data-aos-duration="800"
          >
            <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">500+</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Проектов</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="text-3xl sm:text-4xl font-black text-yellow-400">15</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Лет опыта</div>
            </div>
            <div className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
              <div className="text-3xl sm:text-4xl font-black text-orange-400">100%</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Гарантия</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div 
            className="mt-12 flex flex-wrap gap-4"
            data-aos="fade-up"
            data-aos-delay="500"
            data-aos-duration="800"
          >
            <Link
              href="/services"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:from-orange-600 hover:to-yellow-600 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Наши услуги
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link
              href="/contacts"
              className="group inline-flex items-center px-8 py-4 bg-transparent border-2 border-gray-600 rounded-xl text-gray-300 font-bold text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Связаться с нами
            </Link>
          </div>
        </div>
      </div>
      
      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

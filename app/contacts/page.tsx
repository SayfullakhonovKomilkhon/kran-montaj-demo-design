'use client';

import { Suspense } from 'react';
import ContactSection from '../components/ContactSection';

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="py-12 pt-8 bg-gradient-to-b from-slate-100 to-gray-50 flex justify-center items-center min-h-[50vh]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-14 w-14 border-t-3 border-b-3 border-orange-500 mb-5"></div>
        <p className="text-gray-700 font-bold text-lg">Загрузка контактов...</p>
      </div>
    </div>
  );
}

// Main content component
function ContactContent() {
  return (
    <div className="bg-gradient-to-b from-slate-100 to-gray-50 min-h-screen overflow-hidden">
      {/* Industrial-themed header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Industrial grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        {/* Diagonal stripes accent */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
          <div className="absolute inset-0" style={{backgroundImage: 'repeating-linear-gradient(45deg, #f59e0b, #f59e0b 2px, transparent 2px, transparent 20px)'}}></div>
        </div>
        
        {/* Orange accent glow */}
        <div className="absolute -left-20 top-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
          <div className="text-center relative">
            {/* Industrial icon */}
            <div className="inline-flex items-center justify-center mb-6" data-aos="fade-up" data-aos-duration="800">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
            </div>
            
            <h1
              className="text-3xl font-black text-white sm:text-5xl tracking-tight uppercase"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Связаться <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">с нами</span>
            </h1>
            
            {/* Industrial underline */}
            <div className="flex items-center justify-center mt-4 space-x-2" data-aos="fade-up" data-aos-delay="150">
              <div className="w-12 h-1 bg-gray-600 rounded"></div>
              <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
              <div className="w-12 h-1 bg-gray-600 rounded"></div>
            </div>
            
            <p
              className="mt-6 max-w-2xl mx-auto text-base text-gray-300 leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Оставьте заявку и наши специалисты свяжутся с вами <span className="text-orange-400 font-semibold">в ближайшее время</span> для обсуждения вашего проекта
            </p>
            
            {/* Quick contact info */}
            <div className="mt-10 flex flex-wrap justify-center gap-6" data-aos="fade-up" data-aos-delay="300">
              <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="text-white font-semibold">+998 99 827 91 59</span>
              </div>
              <div className="flex items-center bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-white font-semibold">info@kran-montaj.uz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom edge */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500"></div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 pb-28 sm:px-6 lg:px-8 pt-12 relative">
        <div className="relative z-10">
          <ContactSection />
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ContactContent />
    </Suspense>
  );
}
